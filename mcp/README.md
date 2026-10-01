# Model Context Protocol (MCP)

## Reach for this when

GitHub Copilot CLI needs tools or context from an external system. The SKILL defines the
procedure; MCP supplies operations that the procedure may use.

## What this does

[issue-lifecycle-mcp.md](issue-lifecycle-mcp.md) is a concrete, copyable task for
the **built-in GitHub MCP server**. It starts read-only. You do not need to install
Docker, create a token, or add another GitHub server just to try this example.

No `mcp.json` is required for the built-in server. The earlier Docker/PAT example
was removed rather than introducing a second authentication dependency into this
introductory lab. An MCP connection does not bypass repository or organization policy.

## Try it

In GitHub Copilot CLI, signed in with the intended account:

```text
/mcp
```

Inspect the GitHub server and its exposed tools. Names and availability can vary
with the client and organization policy. Confirm that issue read operations are
available, then paste the **Preview** request from the example and substitute
your own `OWNER/REPO`.

Expected evidence: the confirmed repo and a table of actual issues, or an explicit
empty/blocked result. A successful MCP connection alone does not prove issue-write
permission. The example provides a separate, explicit write request for later.

For another approved service, GitHub Copilot CLI project configuration can live at
`.github/mcp.json` or `.mcp.json`. Review the server's origin, permissions, network
behavior and credential handling before trusting it. Never commit credentials.
For a local server, `PATH` is inherited automatically; other needed environment
variables must be explicitly configured according to the current docs.

This layer is take-home exploration. The live SKILL uses `gh`, keeping one tool
path and one troubleshooting story for the room.

Source: [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers).
