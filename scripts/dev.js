import { spawn } from 'node:child_process'

const processes = [
  spawn(process.execPath, ['server/index.js'], { stdio: 'inherit', env: { ...process.env, PORT: '3001' } }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--configLoader', 'runner', '--host', '127.0.0.1'], { stdio: 'inherit' }),
]

let stopping = false
function stopAll(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of processes) if (!child.killed) child.kill()
  process.exitCode = code
}

for (const child of processes) {
  child.on('error', () => stopAll(1))
  child.on('exit', code => {
    if (!stopping && code !== 0) stopAll(code || 1)
  })
}

process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))
