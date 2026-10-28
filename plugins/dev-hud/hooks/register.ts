import type { Register } from 'claude-code'

const duration = (ms: number) => {
  const s = Math.round(ms / 1000)
  return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}

export const register: Register = on => {
  let model = '?'
  let effort = 'default'
  let steps = 0

  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined) {
      model = e.model.replace(/^claude-/, '')
      effort = e.effort === undefined ? 'default' : `${e.effort}`
    }
    steps++
    return yield* next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result

    const usage = await $.session.usage()
    const now = await $.clock.now()
    const cost = usage.cost ? ` · 💲${usage.cost.usd.toFixed(2)}` : ''

    $.ui.status(`◆ ${model} · ⚡ ${effort} · ⏱ ${duration(e.durationMs)} last turn · ${steps} requests${cost} · ⏳ ${duration(now - usage.startedAt)}`)
    return result
  }).catch(($, e, next) => next(e))
}
