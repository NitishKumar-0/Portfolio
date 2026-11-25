import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RefreshCw } from 'lucide-react'

const refreshInterval = 10 * 60 * 1000

function readSavedData(username) {
  if (typeof window === 'undefined') return null
  try {
    const saved = window.localStorage.getItem('leetcode-heatmap:' + username)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function activityLevel(submissions) {
  if (!submissions) return 0
  if (submissions <= 2) return 1
  if (submissions <= 5) return 2
  if (submissions <= 9) return 3
  return 4
}

function formatUpdatedAt(value) {
  if (!value) return 'Not updated yet'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not updated yet' : date.toLocaleString()
}

export function LeetCodeHeatmap({ username }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [hoveredDay, setHoveredDay] = useState(null)
  const dataRef = useRef(null)

  const refresh = useCallback(async () => {
    const hasData = Boolean(dataRef.current)
    setLoading(!hasData)
    setRefreshing(hasData)
    setError('')

    try {
      const response = await fetch('/api/leetcode/heatmap/' + encodeURIComponent(username), { cache: 'no-store' })
      const responseText = await response.text()
      let result
      try {
        result = JSON.parse(responseText)
      } catch {
        const isHtml = /<\s*!doctype\s+html|<\s*html[\s>]/i.test(responseText)
        throw new Error(isHtml
          ? 'The heatmap API returned the website page instead of data. Run npm run dev to start the API, or deploy the Express server with the site.'
          : 'The heatmap API returned an invalid response.')
      }
      if (!response.ok) throw new Error(result.error || 'Could not load LeetCode activity.')
      dataRef.current = result
      setData(result)
      window.localStorage.setItem('leetcode-heatmap:' + username, JSON.stringify(result))
      if (result.stale) setError('LeetCode is unavailable. Showing the last cached result.')
    } catch (requestError) {
      setError(requestError instanceof TypeError && requestError.message === 'Failed to fetch'
        ? 'Could not reach the portfolio API. Start the app with npm run dev.'
        : requestError.message || 'Could not load LeetCode activity.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [username])

  useEffect(() => {
    const saved = readSavedData(username)
    dataRef.current = saved
    setData(saved)
    setLoading(!saved)
    refresh()
    const interval = window.setInterval(refresh, refreshInterval)
    return () => window.clearInterval(interval)
  }, [refresh, username])

  const calendar = useMemo(() => {
    if (!data || !Array.isArray(data.days) || !data.days.length) return null
    const days = data.days
    const firstDate = new Date(days[0].date + 'T00:00:00Z')
    const leadingCells = firstDate.getUTCDay()
    const rawCells = [
      ...Array.from({ length: leadingCells }, (_, index) => ({ key: 'leading-' + index, blank: true })),
      ...days.map(day => ({ ...day, level: activityLevel(day.submissions) })),
    ]
    const trailingCells = (7 - (rawCells.length % 7)) % 7
    const cells = [...rawCells, ...Array.from({ length: trailingCells }, (_, index) => ({ key: 'trailing-' + index, blank: true }))]
    const weeks = cells.length / 7
    const monthLabels = new Map()

    days.forEach((day, index) => {
      const date = new Date(day.date + 'T00:00:00Z')
      if (index === 0 || date.getUTCDate() === 1) {
        const week = Math.floor((leadingCells + index) / 7)
        if (!monthLabels.has(week)) monthLabels.set(week, date.toLocaleString(undefined, { month: 'short', timeZone: 'UTC' }))
      }
    })

    return { cells, weeks, monthLabels }
  }, [data])

  if (loading && !data) {
    return <section className="leetcode-heatmap" aria-live="polite"><p className="leetcode-heatmap-message">Loading LeetCode activity...</p></section>
  }

  if (!data) {
    return <section className="leetcode-heatmap" aria-live="polite"><div className="leetcode-heatmap-heading"><span /><button className="leetcode-refresh" onClick={refresh} disabled={refreshing} aria-label="Refresh LeetCode activity"><RefreshCw size={15} /></button></div><p className="leetcode-heatmap-message error">{error || 'LeetCode activity is unavailable right now.'}</p></section>
  }

  return <section className="leetcode-heatmap" aria-label="LeetCode activity heatmap">
    <div className="leetcode-heatmap-heading">
      <div><span className="leetcode-username">@{data.username || username}</span></div>
      <button className={'leetcode-refresh' + (refreshing ? ' is-refreshing' : '')} onClick={refresh} disabled={refreshing} aria-label="Refresh LeetCode activity" title="Refresh activity"><RefreshCw size={15} /></button>
    </div>

    <div className="leetcode-stats">
      <div><strong>{Number(data.totalSubmissions).toLocaleString()}</strong><span>Submissions | last 365 days</span></div>
      <div><strong>{Number(data.totalActiveDays).toLocaleString()}</strong><span>Total active days</span></div>
      <div><strong>{data.currentStreak == null ? '-' : data.currentStreak + ' days'}</strong><span>Maximum streak</span></div>
    </div>

    {calendar && <div className="leetcode-calendar-scroll" aria-label="Daily submissions for the last 365 days">
      <div className="leetcode-calendar">
        <div className="leetcode-weekday-labels" aria-hidden="true"><span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span /></div>
        <div className="leetcode-calendar-main">
          <div className="leetcode-month-labels" style={{ gridTemplateColumns: 'repeat(' + calendar.weeks + ', 10px)' }}>
            {Array.from(calendar.monthLabels, ([week, month]) => <span key={week} style={{ gridColumn: week + 1 }}>{month}</span>)}
          </div>
          <div className="leetcode-day-grid">
            {calendar.cells.map(cell => cell.blank
              ? <span key={cell.key} className="leetcode-day empty" aria-hidden="true" />
              : <span key={cell.date} className={'leetcode-day level-' + cell.level} aria-label={cell.date + ': ' + cell.submissions + ' submissions'} role="img" onMouseEnter={event => setHoveredDay({ ...cell, x: event.clientX, y: event.clientY })} onMouseMove={event => setHoveredDay({ ...cell, x: event.clientX, y: event.clientY })} onMouseLeave={() => setHoveredDay(null)} />)}
          </div>
        </div>
      </div>
    </div>}

    {hoveredDay && createPortal(<div className={'leetcode-day-tooltip' + (['10', '11', '12'].includes(hoveredDay.date.slice(5, 7)) ? ' leetcode-day-tooltip-left' : '')} style={{ left: hoveredDay.x, top: hoveredDay.y - 10 }} role="tooltip">
      {Number(hoveredDay.submissions).toLocaleString()} {hoveredDay.submissions === 1 ? 'submission' : 'submissions'} on {new Date(hoveredDay.date + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
    </div>, document.body)}

    <div className="leetcode-heatmap-footer">
      <span className={error ? 'leetcode-warning' : ''}>{error ? error + ' | ' : 'Updated '}{formatUpdatedAt(data.updatedAt)}</span>
      <span className="leetcode-legend"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <i key={level} className={'leetcode-day level-' + level} aria-hidden="true" />)}<span>More</span></span>
    </div>
  </section>
}

export default LeetCodeHeatmap
