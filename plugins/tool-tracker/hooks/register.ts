import type { Register } from 'claude-code'

export const register: Register = on => {
  let calls = 0
  let failed = 0

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    calls++
    if (ran.deny === undefined && ran.isError === true) {
      failed++
      $.ui.toast(`❌ ${e.tool} failed`)
    }
    $.ui.status(`🔧 ${calls} tools · ❌ ${failed} failed`)
    return ran
  }).catch(($, e, next) => next(e))
}
