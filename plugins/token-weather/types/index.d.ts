export type History = number[]

declare module 'claude-code' {
  interface PluginState {
    'token-weather': { history: History; window: number }
  }
}
