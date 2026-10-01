# Plugins

## Reach for this when

A useful set of customizations is ready to package and reuse. A plugin is the
distribution unit, not an extra workflow the beginner must learn first.

## What this does

`nuevo-issue-lifecycle` bundles **four components**:

| Component | Location |
| --- | --- |
| SKILL | `skills/issue-lifecycle/SKILL.md` |
| Explicit task command | `com.github.copilot/commands/start-tracked-change.md` |
| Preview-first triage agent | `com.github.copilot/agents/issue-triager.agent.md` |
| Bounded commit-message hook | `com.github.copilot/hooks/hooks.json` and its Node script |

The manifest uses Agent Plugins 1.0. The SKILL location is portable; the other
three locations are specific to GitHub Copilot CLI. The hook uses `${PLUGIN_ROOT}` and a real
script, not a second inline implementation. Its limits are documented in
[hooks](../hooks/README.md), including fail-open timeouts.

Repository-wide guidance is deliberately installed via
[instructions](../instructions/README.md), **not an unverified bundled rule**.
The documented plugin rules directory alone did not establish that the original
plain Markdown rule was active: isolated `instruction list` probes returned no
rule source. This bundle does not depend on that uncertainty.

## Try it without a global install

Requires a compatible GitHub Copilot CLI. Node.js 18 or newer must be on `PATH` for the
hook and its regression checks.
From the reference root, capture the absolute plugin path:

```powershell
$PluginPath = (Resolve-Path .\plugins\nuevo-issue-lifecycle).Path
copilot --plugin-dir "$PluginPath" plugin list --json
copilot --plugin-dir "$PluginPath" skill list --json
```

On CLI 1.0.89, discovery lists `issue-lifecycle` and `start-tracked-change` as
plugin-sourced SKILLS. The latter is the bundled command, not the editor's
`.prompt.md` file or its input-substitution syntax.

Move to your disposable working repo, then mount the same plugin for that session:

```powershell
Set-Location 'C:\path\to\your-working-repo'
copilot --plugin-dir "$PluginPath"
```

Inside CLI inspect `/plugin`, `/skills list`, `/agent` and `/hooks`. If you already
copied the standalone `issue-lifecycle` SKILL, remove that copy **only after saving
your own work**, or use a fresh repo to avoid name collisions.

Start with a no-write request:

```text
/start-tracked-change Explain the plan for a brand-yellow CSS change. Preview only, no GitHub or file writes.
```

Then try the actual start phase only in the confirmed writable repo, with normal
approvals. The hook's input/output regression tests do not substitute for observing
its behavior in a real, trusted CLI session on the target laptop image.

Separately, the bundled triage agent is registered as
`nuevo-issue-lifecycle:issue-triager`, not the standalone agent's unqualified name.
In a new session, select it as the primary agent with:

```powershell
copilot --plugin-dir "$PluginPath" --agent nuevo-issue-lifecycle:issue-triager
```

This role previews triage; it is not the agent for the open-work-close lab.

If you later want a persistent install, run `copilot plugin install "$PluginPath"`.
Undo that with `copilot plugin uninstall nuevo-issue-lifecycle`. A session-local
`--plugin-dir` mount disappears when that session ends and needs no uninstall.
Do not globally install this workshop plugin on the managed classroom machines.

## Keep the bundle in sync

From the reference root, run `node .\scripts\sync-examples.js` after editing the
canonical SKILL, prompt, agent or hook. Run again with `--check` to detect drift.
Do not edit generated payload copies independently.

Sources: [Plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference),
[creating plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating).
