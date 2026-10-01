# Reusable prompts

## Reach for this when

You want an explicit, repeatable task with one changing input. A prompt is the
request you initiate; a SKILL packages the procedure and relevant resources.

## What this does

The example opens one issue and applies `in progress`, then stops. It does not
run the entire lifecycle automatically. Always confirm the writable repo first.

## Try it in GitHub Copilot CLI

Start GitHub Copilot CLI in your disposable working repository, then paste:

```text
Start tracking this change: add the three approved homepage impact values
from the supplied local brief, retaining the dated-source caveat.
First confirm this is my intended writable repository and host. Use its
owner/name with gh --repo, prefixed by HOST/ on a non-default host.
Reuse an issue if one is already supplied; otherwise
create one explaining what and why. Check for the exact "in progress" label,
create it only if missing, and apply it. Report the issue URL and stop.
Do not edit files, commit, push or close anything. Surface any error.
```

This is an interactive prompt, not a special `.prompt.md` loader or a headless
permission workaround. Review the normal approval prompts before writes.

## Optional editor file

`start-tracked-change.prompt.md` includes a `${input:change:...}` input. Current
VS Code documentation supports these files in the **Local agent** experience,
but deprecates them for **Agent Host**, where they are not loaded. Do not assume
the behavior is identical across editors or hosts.

In a supported VS Code Local-agent setup, copy this file from the reference
root into your working repo's `.github\prompts\` folder. Run
`/start-tracked-change` in that editor's chat view and supply the input.
Keep existing prompts intact. This editor path is optional, not part of the CLI lab.

For a packaged CLI slash command, see the [plugin](../plugins/README.md). Its
command takes input from the invocation, not the editor input-placeholder syntax.

Source: [VS Code prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files).
