# SKILLS

## Reach for this when

You want a reusable procedure that loads for a relevant task, rather than a rule
that applies to every request. Here the procedure is the issue lifecycle.

## What this does

[issue-lifecycle/SKILL.md](issue-lifecycle/SKILL.md) is the NF core used in the
workshop. It separates **start**, **work**, and **finish**. Starting opens or
reuses an issue, applies `in progress`, and stops. Finishing verifies the right
published change and the agreed gate, normally a merged PR, before closing.
It supports read-only previews and honest pending-online recovery.

The `description` helps GitHub Copilot CLI select a SKILL; it is not a deterministic
event trigger. The starter also includes repository instructions that direct
ordinary feature requests to this SKILL. Its lab preview checks automatic
selection without a slash command. Explicit invocation below is useful for
isolating discovery problems, not proof of automatic selection. Hooks are different.

## Try it

Use a disposable repository you can write to. From this reference repository's root,
set `$TargetRepo` to its existing local folder. Do not overwrite an existing SKILL.

```powershell
$TargetRepo = 'C:\path\to\your-working-repo'
New-Item -ItemType Directory -Force "$TargetRepo\.github\skills"
Copy-Item .\skills\issue-lifecycle "$TargetRepo\.github\skills\issue-lifecycle" -Recurse
Set-Location $TargetRepo
copilot
```

On macOS/Linux, copy the same folder to `.github/skills/issue-lifecycle` in your
working repo using your editor or file manager.

Inside GitHub Copilot CLI:

```text
/skills reload
/skills info issue-lifecycle
/issue-lifecycle Start tracking the grounded impact-counter feature from my local PM brief in this repository. Open or reuse the issue, mark it in progress, then stop.
```

Review the issue, make and publish the change under the agreed gate, then invoke
the SKILL again with the actual issue number and evidence. Do not use the
reference or public NF repository as your classroom target.
If reload is unavailable on the room's CLI version, restart GitHub Copilot CLI in the same repo.

The [starter walkthrough](https://github.com/NuevoFoundation/copilot-cli-skills-sandbox-starter)
explains the complete exercise, including staging the new SKILL and pushing the commit.
The reviewed local package builds the SKILL first; ten website PM briefs are
optional sequential challenges. Check which package version you have.
In the lab, try the guide's natural-language request and observe selection.

Source: [Adding agent SKILLS for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills).
