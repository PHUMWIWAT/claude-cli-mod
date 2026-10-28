# claude-cli-mod

Claude Code mods. Install any of them at the prompt of a Claude Code terminal session (answer `y` to add the marketplace, then pick a scope):

| Mod | What it does | Install |
| --- | --- | --- |
| [tool-tracker](plugins/tool-tracker) | Tool-call and failure counts in the status line; a toast when a tool fails | `/plugin install tool-tracker --marketplace PHUMWIWAT/claude-cli-mod` |
| [token-weather](plugins/token-weather) | A weather forecast of your context window above the prompt, with a 12-turn sparkline | `/plugin install token-weather --marketplace PHUMWIWAT/claude-cli-mod` |

From a shell, use `claude plugin install <mod> --marketplace PHUMWIWAT/claude-cli-mod`.
