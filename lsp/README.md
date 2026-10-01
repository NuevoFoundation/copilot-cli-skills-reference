# LSP: language-aware code services

## Reach for this when

You need diagnostics, definitions, references, or symbols in a codebase.
Language Server Protocol connects a supporting client to a language server
that provides those services. It is not a replacement for tests or a guarantee
that a model understands every implication of a change.

## NF example

The production website has a larger typed codebase. Language-aware navigation
can help a developer find a component's definition or inspect a diagnostic
before making a feature change. The classroom deliberately uses simple static
HTML, so configuring a language server is not a prerequisite for building the SKILL.

## Inspect before adding anything

In a supporting GitHub Copilot CLI version, `/lsp` is the management entry point.
Inspect the existing configuration and the language/server support for that
client. Do not assume an editor extension is automatically the CLI's server.
Plugins may carry LSP configuration, but the underlying server and its
prerequisites still need to be available and approved.

This directory is a decision guide, not a universal server configuration.
No server is installed by opening this reference repository.

**Prompt requests a task. SKILL supplies a procedure. LSP supplies code services.**

Sources: the installed CLI's `/help` and `/lsp` help; the
[GitHub Copilot CLI documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli).
