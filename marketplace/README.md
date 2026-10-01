# Marketplace: a catalog, not the package

## Reach for this when

Several people need a discoverable, versioned way to find compatible plugins.
A **plugin** is the bundle; a **marketplace** is a catalog that points to bundles.
Installing a catalog entry does not make its code trustworthy or grant permission
to every tool it includes.

## NF example

An approved team catalog could distribute a reviewed version of the delivery
plugin. This reference includes a local plugin example, but it does **not**
publish an NF marketplace or ask attendees to install one during the lab.

## Inspect before installing

Current GitHub Copilot CLI exposes `/plugin` interactively and `copilot plugin`
in the terminal. Its help includes marketplace management:

```powershell
copilot plugin --help
copilot plugin marketplace --help
```

Catalog browsing or installation may need network access and organization
approval. Review the source, permissions, hook code, external services, and
version before installation. Do not add an unapproved catalog to a managed room
account to get around restrictions.

Use the plugin's **session-local** example from [plugins/README.md](../plugins/README.md)
when you want to inspect the prepared bundle without globally installing it.
Preserve existing personal and repository settings.

**Plugin = package. Marketplace = catalog. Neither is mandatory for one SKILL.**

Source: [About GitHub Copilot CLI plugins](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-plugins).
