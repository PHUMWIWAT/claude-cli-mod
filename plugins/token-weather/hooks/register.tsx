import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const history = atom({ plugin: 'token-weather', key: 'history' } as const, [])
const window = atom({ plugin: 'token-weather', key: 'window' } as const, 0)

const BARS = '▁▂▃▄▅▆▇█'

const forecast = (percent: number) =>
  percent < 25 ? { icon: '☀', word: 'Clear', color: 'yellow' }
  : percent < 50 ? { icon: '☁', word: 'Cloudy', color: 'cyan' }
  : percent < 75 ? { icon: '☂', word: 'Showers', color: 'blue' }
  : percent < 90 ? { icon: '☇', word: 'Storm', color: 'magenta' }
  : { icon: '↯', word: 'Compact soon', color: 'red' }

const k = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${n}`)

export const register: Register = on => {
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const { context } = await $.session.usage()
    const tokens = context.tokens ?? (context.percent !== undefined ? Math.round((context.percent / 100) * context.window) : undefined)
    if (tokens !== undefined) {
      await update($, history, prev => [...prev, tokens].slice(-12))
      await update($, window, () => context.window)
    }
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const { context } = await $.session.usage()
    const size = context.window || (await read($, window))
    const stored = await read($, history)
    const live = context.tokens ?? stored[stored.length - 1]
    if (e.props.hasSurvey || live === undefined || size === 0) {
      return next(e)
    }

    const turns = stored.length > 0 && stored[stored.length - 1] === live ? stored : [...stored, live].slice(-12)
    const tokens = live
    const percent = Math.round((tokens / size) * 100)
    const { icon, word, color } = forecast(percent)
    const chart = turns.map(t => BARS[Math.min(7, Math.floor((t / size) * 8))]).join('')
    const added = turns.length > 1 ? tokens - turns[turns.length - 2] : tokens
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text color={color}>{icon} {word}</Text>
        <Text> {percent}% · {k(tokens)} / {k(size)} </Text>
        <Text color={color}>{chart}</Text>
        <Text dimColor> {added >= 0 ? '▲ +' : '▼ -'}{k(Math.abs(added))} last turn</Text>
      </Box>
    )
  })
}
