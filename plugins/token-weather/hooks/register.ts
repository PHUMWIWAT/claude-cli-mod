import type { Register } from 'claude-code'

const BARS = '▁▂▃▄▅▆▇█'

const forecast = (percent: number) =>
  percent < 25 ? '☀ Clear'
  : percent < 50 ? '☁ Cloudy'
  : percent < 75 ? '☂ Showers'
  : percent < 90 ? '☇ Storm'
  : '↯ Compact soon'

const k = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${n}`)

export const register: Register = on => {
  let turns: number[] = []

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result

    const { context } = await $.session.usage()
    const size = context.window
    const tokens = context.tokens ?? (context.percent !== undefined ? Math.round((context.percent / 100) * size) : undefined)
    if (tokens === undefined || size === 0) return result

    const added = turns.length > 0 ? tokens - turns[turns.length - 1] : tokens
    turns = [...turns, tokens].slice(-12)
    const percent = Math.round((tokens / size) * 100)
    const chart = turns.map(t => BARS[Math.min(7, Math.floor((t / size) * 8))]).join('')
    const delta = `${added >= 0 ? '▲ +' : '▼ -'}${k(Math.abs(added))}`

    $.ui.status(`${forecast(percent)} ${percent}% · ${k(tokens)} / ${k(size)} ${chart} ${delta} last turn`)
    return result
  }).catch(($, e, next) => next(e))
}
