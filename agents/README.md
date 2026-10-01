# Custom agents

## Reach for this when

A recurring role benefits from its own instructions and tool selection.
Delegating to that agent can isolate its working context; selecting it as your
primary agent is a different interaction. Not every simple task needs delegation.

## What this does

`issue-triager.agent.md` previews labels and next steps for **at most five** issues.
It uses existing label conventions, does not close issues, and applies nothing
until the user explicitly approves the exact proposal.

`tools: ['shell']` enables the tool category that includes shell execution. It
does not make the agent technically read-only; normal approvals still matter.

## Try it

From the reference repo's root, set a disposable working repository. Preserve
any existing agent of the same name.

```powershell
$TargetRepo = 'C:\path\to\your-working-repo'
New-Item -ItemType Directory -Force "$TargetRepo\.github\agents"
Copy-Item .\agents\issue-triager.agent.md "$TargetRepo\.github\agents\issue-triager.agent.md"
Set-Location $TargetRepo
copilot
```

On macOS/Linux, copy the file into the working repo's `.github/agents/` folder.
Restart after installing it, then use `/agent` to inspect available agents.

For a delegated, bounded task, ask:

> Use issue-triager to preview triage for at most five open issues in this
> repository. Confirm the target first. Do not create labels, edit issues or
> post comments. Show me the proposal.

Inspect the returned proposal. Approve specific changes only if wanted. This is
an optional take-home exercise, not something to run across a live team backlog
during the Sandbox.

Source: [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration).
