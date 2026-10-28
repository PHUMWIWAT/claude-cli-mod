# tool-tracker

A Claude Code mod that counts every tool call in the current session and shows the total, plus how many failed, in the status line (`🔧 12 tools · ❌ 1 failed`). When a tool call fails, a toast pops up naming the tool, so you notice errors right away without scrolling back through the transcript.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install tool-tracker --marketplace PHUMWIWAT/claude-cli-mod
```

Answer `y` to add the marketplace, then pick a scope (user is first).

From a shell:

```
claude plugin install tool-tracker --marketplace PHUMWIWAT/claude-cli-mod
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `PHUMWIWAT/claude-cli-mod`, then Add plugin.

No configuration needed. The counts reset each session.
