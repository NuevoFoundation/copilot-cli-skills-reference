# Hooks

## Reach for this when

You need code to run at a known tool lifecycle point. Unlike a SKILL's prose,
this script returns a decision from a deterministic check.

## What this does

`require-issue-reference.js` is a **bounded teaching guard**, not a security
boundary or an unskippable repository policy. Before a direct shell `git commit`,
it checks the literal `-m` message for an issue reference such as `(#42)`.

It reads only `toolArgs.command`, not a tool description or other metadata.
Common global Git options such as `git -C . commit` are recognized. Multiple
literal `-m` paragraphs and direct commands joined by `;`, `&&` or newlines are
checked. File-based, variable, reused and generated messages are denied for this
demo rather than silently treated as checked.

The script returns **`{}`**, not `"allow"`, when it has nothing to deny. Normal
GitHub Copilot CLI permissions still apply. Malformed payloads produce an explicit denial
and stderr diagnostic. It does not run Git, connect to GitHub, or verify that the
referenced issue exists.

**Limits matter:** aliases, functions, nested shells, scripts, unusual Git
options, shell interpolation and commits outside the agent are not covered by
this small parser. A user can change local hooks. Command `preToolUse` crashes
normally deny the tool, but **hook timeouts fail open** through normal permissions.
Use repository rules, required CI checks and appropriately designed server-side
controls for an actual policy. Do not call this example universal enforcement.

## Try it

Requires Node.js 18 or newer on `PATH` for the checks below. No npm packages.
From this reference repo's root:

```powershell
node --test .\tests\hooks.test.js
'{"toolName":"powershell","toolArgs":{"command":"git commit -m \"Use brand yellow\""}}' | node .\hooks\require-issue-reference.js
'{"toolName":"powershell","toolArgs":{"command":"git commit -m \"Use brand yellow (#42)\""}}' | node .\hooks\require-issue-reference.js
```

The first payload returns `"deny"`; the second returns `{}`. Neither command
actually creates a commit. `#42` is illustrative.

To try the hook in a **disposable working repo**, set `$TargetRepo` while still
in the reference root. Inspect existing hooks before copying; do not overwrite them.

```powershell
$TargetRepo = 'C:\path\to\your-working-repo'
New-Item -ItemType Directory -Force "$TargetRepo\.github\hooks"
Copy-Item .\hooks\require-issue-reference.js "$TargetRepo\.github\hooks\require-issue-reference.js"
Copy-Item .\hooks\require-issue-reference.json "$TargetRepo\.github\hooks\require-issue-reference.json"
Set-Location $TargetRepo
copilot
```

On macOS/Linux, copy those same two files into the working repo's `.github/hooks`
folder. Start GitHub Copilot CLI from that repo's root. The JSON contains Bash and PowerShell
commands. Inspect a rejected tool call before approving any live commit.
The room exercise does **not** require installing this hook.

Source: [GitHub Copilot CLI hooks configuration](https://docs.github.com/en/copilot/reference/hooks-configuration).
