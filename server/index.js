import express from 'express'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(currentFile), '..')
const distDir = path.join(rootDir, 'dist')
const contactRateLimits = new Map()

try {
  const localEnv = readFileSync(path.join(rootDir, '.env'), 'utf8')
  for (const line of localEnv.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]] !== undefined) continue
    let value = match[2]
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    process.env[match[1]] = value
  }
} catch {}

const app = express()
const port = Number(process.env.PORT) || 3001
const cacheTtlMs = 7 * 60 * 1000
const cache = new Map()
const pending = new Map()

const calendarQuery = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      username
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`

app.use('/api', (req, res, next) => {
  const origin = req.get('origin')
  if (origin === 'http://127.0.0.1:5173' || origin === 'http://localhost:5173') {
    res.set('Access-Control-Allow-Origin', origin)
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.vary('Origin')
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  return next()
})
app.use('/api', express.json({ limit: '12kb' }))

app.post('/api/contact', async (req, res) => {
  const name = String(req.body?.name || '').trim().replace(/[\r\n]+/g, ' ')
  const email = String(req.body?.email || '').trim()
  const message = String(req.body?.message || '').trim()
  if (!name || name.length > 100) return res.status(400).json({ error: 'Enter a name under 100 characters.' })
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
  if (message.length < 10 || message.length > 3000) return res.status(400).json({ error: 'Message must be between 10 and 3000 characters.' })

  const now = Date.now()
  const address = req.ip || 'unknown'
  const limit = contactRateLimits.get(address)
  if (limit && now < limit.resetAt && limit.count >= 5) {
    return res.status(429).json({ error: 'Too many messages. Please try again later.' })
  }
  if (!limit || now >= limit.resetAt) contactRateLimits.set(address, { count: 1, resetAt: now + 15 * 60 * 1000 })
  else contactRateLimits.set(address, { count: limit.count + 1, resetAt: limit.resetAt })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'Email delivery is not configured yet.' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)
  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL || 'nitishkumar176576@gmail.com'],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: controller.signal,
    })
    if (!delivery.ok) {
      console.error(`Contact email delivery failed with HTTP ${delivery.status}.`)
      return res.status(502).json({ error: 'Could not send your message right now. Please try again later.' })
    }
    return res.json({ sent: true })
  } catch {
    return res.status(502).json({ error: 'Email service is unreachable. Please try again later.' })
  } finally {
    clearTimeout(timeout)
  }
})

function parseCalendar(rawCalendar) {
  if (!rawCalendar) return {}
  if (typeof rawCalendar === 'object') return rawCalendar
  try {
    return JSON.parse(rawCalendar)
  } catch {
    throw new Error('LeetCode returned an invalid activity calendar.')
  }
}

function isoDateFromTimestamp(value) {
  const timestamp = Number(value)
  if (!Number.isFinite(timestamp)) return null
  const date = new Date(timestamp > 1e12 ? timestamp : timestamp * 1000)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

async function fetchCalendar(username, year) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        origin: 'https://leetcode.com',
        referer: `https://leetcode.com/u/${username}/`,
        'user-agent': 'Mozilla/5.0 Portfolio LeetCode activity integration',
      },
      body: JSON.stringify({ query: calendarQuery, variables: { username, year } }),
      signal: controller.signal,
    })

    if (!response.ok) throw new Error(`LeetCode returned HTTP ${response.status}.`)
    const payload = await response.json()
    if (payload.errors?.length) throw new Error('LeetCode could not return calendar data.')
    return payload.data?.matchedUser ?? null
  } finally {
    clearTimeout(timeout)
  }
}

function addUtcDays(date, count) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + count)
  return result
}

async function buildHeatmap(username) {
  const today = new Date()
  const currentYear = today.getUTCFullYear()
  const [currentUser, previousUser] = await Promise.all([
    fetchCalendar(username, currentYear),
    fetchCalendar(username, currentYear - 1),
  ])

  if (!currentUser) return null
  const currentCalendar = currentUser.userCalendar || {}
  const previousCalendar = previousUser?.userCalendar || {}
  const activityByDate = new Map()

  for (const calendar of [previousCalendar, currentCalendar]) {
    const entries = parseCalendar(calendar.submissionCalendar)
    for (const [timestamp, rawCount] of Object.entries(entries)) {
      const date = isoDateFromTimestamp(timestamp)
      const submissions = Number(rawCount)
      if (!date || !Number.isFinite(submissions) || submissions <= 0) continue
      activityByDate.set(date, (activityByDate.get(date) || 0) + submissions)
    }
  }

  const startDate = addUtcDays(today, -364)
  startDate.setUTCHours(0, 0, 0, 0)
  const days = Array.from({ length: 365 }, (_, index) => {
    const date = addUtcDays(startDate, index).toISOString().slice(0, 10)
    return { date, submissions: activityByDate.get(date) || 0 }
  })

  const totalSubmissions = days.reduce((total, day) => total + day.submissions, 0)
  const recentActiveDays = days.filter(day => day.submissions > 0).length
  const apiActiveDays = Number(currentCalendar.totalActiveDays)
  const streak = Number(currentCalendar.streak)

  return {
    username: currentUser.username || username,
    totalSubmissions,
    totalActiveDays: Number.isFinite(apiActiveDays) && apiActiveDays >= 0 ? apiActiveDays : recentActiveDays,
    currentStreak: Number.isFinite(streak) && streak >= 0 ? streak : null,
    days,
    updatedAt: new Date().toISOString(),
  }
}

app.get('/api/leetcode/heatmap/:username', async (req, res) => {
  const username = String(req.params.username || '').trim()
  if (!/^[A-Za-z0-9_-]{1,25}$/.test(username)) {
    return res.status(400).json({ error: 'Invalid LeetCode username.' })
  }

  res.set('Cache-Control', 'no-store')
  const key = username.toLowerCase()
  const cached = cache.get(key)
  if (cached && Date.now() - cached.cachedAt < cacheTtlMs) {
    return res.json(cached.data)
  }

  try {
    let request = pending.get(key)
    if (!request) {
      request = buildHeatmap(username)
      pending.set(key, request)
    }
    const data = await request
    pending.delete(key)

    if (!data) return res.status(404).json({ error: 'LeetCode user was not found.' })
    cache.set(key, { data, cachedAt: Date.now() })
    return res.json(data)
  } catch {
    pending.delete(key)
    if (cached) return res.json({ ...cached.data, stale: true })
    return res.status(502).json({ error: 'LeetCode activity is temporarily unavailable.' })
  }
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    return res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Portfolio API listening on http://localhost:${port}`)
})
