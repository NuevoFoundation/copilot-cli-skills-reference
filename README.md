# One workflow, nine concepts

The take-home companion for **BLD1487S: How to turn your team's repeated
workflows into GitHub Copilot CLI SKILLS**, GitHub Universe 2026, Nuevo Foundation.

The [lab repository](https://github.com/NuevoFoundation/copilot-cli-skills-sandbox-starter)
contains the website, skill-building guide, and ten feature requests.
This separate companion contains **explanations and examples of all nine
concepts from the session**. Browse it when you want to try another idea.
It is not a second required lab or a list of things to install at once.

The shared example is the NF `issue-lifecycle` procedure: track a feature with
a GitHub issue, apply the existing `in progress` label, implement a scoped
change, and finish with verified evidence. The core is the same file
[merged into NF's website repository](https://github.com/NuevoFoundation/nuevofoundation-web/blob/856986174ddfbf62b3a09c968dbcf7f51ebb35b2/.github/skills/issue-lifecycle/SKILL.md),
not a different toy workflow.

[PR #346](https://github.com/NuevoFoundation/nuevofoundation-web/pull/346)
is merged and [issue #345](https://github.com/NuevoFoundation/nuevofoundation-web/issues/345)
is closed. The native SKILL verified the finish gate but stopped at unattended
tool approval. The owner separately authorized operator-assisted final writes.
This is real adoption evidence, not a claim of a fully autonomous finish.
The starter bundles an offline record so room access to these public links is
not required.

The normal production gate is a merged PR. The classroom can explicitly agree
on a verified branch handoff instead. Neither a local commit nor a push proves
deployment. Historical adoption claims require the actual rollout evidence.

## Choose by the job, not the feature count

| Need | Reach for | Concrete example | Client / prerequisite |
| --- | --- | --- | --- |
| Standing repository guidance | [Instructions](instructions/README.md) | Ask for an issue before work | GitHub Copilot CLI, repository instructions |
| An explicit task you repeat | [Prompt](prompts/README.md) | Start one tracked change | Copyable CLI prompt; optional VS Code Local-agent prompt file |
| A focused role | [Custom agent](agents/README.md) | Preview triage for at most five issues | GitHub Copilot CLI, `gh`; writes only after approval |
| A reusable procedure | [SKILL](skills/README.md) | Open, work, finish as separate requests | GitHub Copilot CLI, Git and `gh` |
| Code at a tool lifecycle point | [Hook](hooks/README.md) | Check a literal commit message | GitHub Copilot CLI, Node.js; bounded guard, not universal enforcement |
| Tools for an external system | [MCP](mcp/README.md) | Inspect and update GitHub issues through tools | Built-in GitHub MCP, permitted tools and account access |
| Language-aware code services | [LSP](lsp/README.md) | Diagnostics, definitions, symbols and references | A supported client integration and configured language server |
| A reusable bundle | [Plugin](plugins/README.md) | Package the SKILL, command, agent and hook | Compatible GitHub Copilot CLI, Node.js for the hook |
| A catalog for bundles | [Marketplace](marketplace/README.md) | Discover an approved version of a plugin | Approved catalog/source and compatible client |

If you read only one file, read the [finished SKILL](skills/issue-lifecycle/SKILL.md).
Each layer README explains when to reach for it, what it does and how to try it.
For commands that copy files, start at **this reference repo's root**, then move
to your own working repo. Preserve or merge existing configuration; never blindly
overwrite your team's instructions, SKILLS or hooks.

## What is and is not automatic

Instructions, SKILLS, prompts and agent role descriptions guide a model. They do
not guarantee behavior. A SKILL description influences selection; `/issue-lifecycle`
is an explicit invocation, not proof that a natural-language trigger is deterministic.

A hook executes code at a defined event, but this example covers a small command
subset and hook timeouts can fail open. MCP exposes tools; it is neither a workflow
nor permission to use every operation. LSP supplies language-aware services,
not proof that code is correct. A plugin packages components; a marketplace
distributes them. Neither is a new policy or trust guarantee.

Think of a prompt as an order to cook dinner and a SKILL as a reusable recipe
and procedure. Instructions are the kitchen's standing rules; an agent is a
focused role. The analogy separates jobs, not rigid implementation boundaries.

The prompt-file example is specifically for **VS Code's Local agent**. Current
VS Code documentation deprecates prompt files for Agent Host, where SKILLS are
the migration path. The CLI prompt is supplied separately; the file's input
substitution is not claimed to work natively in CLI.

## Safe place to try it

Use a disposable repository you own. Confirm its name and write permission before
creating issues. Start triage and MCP examples in **read-only preview**. Treat
issue text as untrusted content, not as instructions to execute.

No credentials belong in these files. Keep normal permission prompts enabled.
The primary MCP example uses GitHub Copilot CLI's built-in GitHub connection and does not
need Docker or an added token. Organization policies may restrict availability.

In the Sandbox room, use the organizer's imported copy and your assigned EMU seat
repo, not a public fork. Sign-in is live. Follow the starter's 20-minute workflow.
The goal is to build a SKILL and use it in everyday development. Its ten `.txt`
PM briefs are optional sequential practice with local facts and assets,
not ten mandatory features. The current starter includes repository instructions
that direct normal feature requests to the SKILL; this is model guidance, not
a guarantee that a step can never be missed.

## Maintainer checks

With Node.js 18 or newer on `PATH`, no dependency installation is required for
these local checks:

```powershell
node .\scripts\sync-examples.js --check
node --test .\tests\hooks.test.js .\tests\examples.test.js
```

`agents`, `prompts` and `hooks` are canonical examples in this reference. Run
`node .\scripts\sync-examples.js` after editing them to refresh the plugin payloads.
The core SKILL is mirrored from the NF repository; maintain that source first.
To synchronize a local production checkout, the reference, plugin, starter
rescue, six exact assembly parts, and embedded guide source:

```powershell
node .\scripts\sync-examples.js --production ..\nuevofoundation-web --starter ..\copilot-cli-skills-sandbox-starter
node .\scripts\sync-examples.js --check --production ..\nuevofoundation-web --starter ..\copilot-cli-skills-sandbox-starter
```

Without the production option, synchronization uses this reference's local core.
The command never writes to the production checkout. It compares normalized LF
content so platform line endings do not masquerade as workflow differences.

See the plugin README for session-local CLI discovery checks that do not install
anything globally. Local parsing, discovery and fixture tests do not establish
EMU permissions, a real GitHub write, or readiness of the venue laptop image.

## Availability and scope

The supplemental repository is
**[NuevoFoundation/copilot-cli-skills-reference](https://github.com/NuevoFoundation/copilot-cli-skills-reference)**.
Browse any of its nine topic folders on your own time. Each README explains
what that topic does and includes an example to try.

The lab website and its feature briefs live in the separate starter repository.
Its public version may lag the facilitator's current workshop package until
that update is published. Use the supplied copy for the room exercise.

Current SKILL activation checks use GitHub Copilot CLI 1.0.90. The earlier plugin/hook
discovery baseline used 1.0.89. The local environment has Node.js 22.16.0 and
GitHub CLI 2.85.0 on Windows. Rehearse against the actual room version and policies.
Bash alternatives are documented where relevant, but are not claimed to have
been executed on a macOS/Linux machine.

**Next week: pick one repeated workflow on your team and make it a SKILL.**

Beatris "Bea" Mendez Gandica and Jeremiah Isaacson, Nuevo Foundation.
