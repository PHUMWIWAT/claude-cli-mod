import { expect, test } from 'claude-code/testing'

test('the band shows after a turn', async ($, on) => {
  on('session.usage', () => ({ value: { startedAt: 0, rateLimits: [], context: { tokens: 134400, window: 200000, percent: 67 } } }))
  on('turn.complete', () => ({ text: '' }))
  await $.turn.complete({ answer: 'hi', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  const ui = await $.ui.mount({ plugin: 'token-weather', component: 'AbovePrompt', surface: 'terminal', props: { hasSurvey: false, isWorking: false, maxRows: 3 } } as never)
  const t = await ui.find({ type: 'Text', text: /Showers/ })
  expect(t?.text).toBe('☂ Showers')
  await ui.unmount()
})
