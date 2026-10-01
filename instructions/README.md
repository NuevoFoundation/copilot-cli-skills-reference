# Instructions

## Reach for this when

A rule should guide work throughout a repository, without asking for the same
context each time. It is standing guidance, not runtime enforcement.

## What this does

`copilot-instructions.md` asks for an issue before work, the exact `in progress`
label while work is active, and verified evidence at the agreed completion gate.
It keeps target checks, normal approvals, and read-only previews explicit.

## Try it

From the reference repo's root, set the target to a disposable working repo.
If its instructions file already exists, **merge the relevant text in your editor
instead of running the copy command**.

```powershell
$TargetRepo = 'C:\path\to\your-working-repo'
New-Item -ItemType Directory -Force "$TargetRepo\.github"
Copy-Item .\instructions\copilot-instructions.md "$TargetRepo\.github\copilot-instructions.md"
Set-Location $TargetRepo
copilot instruction list --json
copilot
```

On macOS/Linux, copy the same file to `.github/copilot-instructions.md` in your
working repo using your editor. Inside CLI, `/instructions` lets you inspect sources.

Ask: "I want to update the footer. Explain the first step under our house rule;
do not modify GitHub or files yet." You should see an issue-first plan. A model
response is an observation, not a guarantee the rule can never be missed.

For path-scoped guidance, use `.github/instructions/*.instructions.md` with an
appropriate `applyTo` pattern. Do not put this workshop example into a personal
global configuration unless you genuinely want it in every repository.

Source: [Custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions).
