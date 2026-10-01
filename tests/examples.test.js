const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const plugin = path.join(root, "plugins/nuevo-issue-lifecycle");

test("all generated payloads match their canonical sources", () => {
  const child = spawnSync(process.execPath, [path.join(root, "scripts/sync-examples.js"), "--check"], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
});

test("skill defines discoverable bounded phases without blanket shell preapproval", () => {
  const skill = fs.readFileSync(path.join(root, "skills/issue-lifecycle/SKILL.md"), "utf8");
  assert.match(skill, /^---\r?\nname: issue-lifecycle\r?\ndescription: .+/);
  assert.doesNotMatch(skill, /allowed-tools:/);
  assert.match(skill, /Stop here/);
  assert.match(skill, /gh api --hostname HOST repos\/OWNER\/REPO\/commits\/FULL_SHA/);
  assert.match(skill, /Reuse a supplied open issue/);
  assert.match(skill, /An already closed issue can be previewed/);
  assert.match(skill, /exact `in progress` label/);
  assert.match(skill, /Normally this is a merged pull/);
  assert.match(skill, /LOCAL ONLY \/ PENDING ONLINE/);
  assert.match(skill, /Verify and cite the merge commit/);
  assert.match(skill, /reuse an already-posted summary/);
});

test("plugin manifest uses the documented schema and no legacy path fields", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(plugin, "plugin.json"), "utf8"));
  assert.equal(manifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
  assert.equal(manifest.name, "nuevo-issue-lifecycle");
  for (const legacy of ["skills", "agents", "hooks", "commands"]) assert.equal(manifest[legacy], undefined);
});

test("both hook configurations use the native event and preserve the bounded matcher", () => {
  for (const file of ["hooks/require-issue-reference.json", "plugins/nuevo-issue-lifecycle/com.github.copilot/hooks/hooks.json"]) {
    const config = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
    const hook = config.hooks.preToolUse[0];
    assert.equal(config.version, 1);
    assert.equal(hook.type, "command");
    assert.equal(hook.matcher, "bash|powershell|shell");
    assert.equal(hook.timeoutSec, 15);
    assert.match(hook.powershell, /require-issue-reference\.js/);
    assert.match(hook.bash, /require-issue-reference\.js/);
    assert.doesNotMatch(hook.powershell, /node -e/);
  }
});

test("plugin task has no editor-only input placeholders", () => {
  const command = fs.readFileSync(path.join(plugin, "com.github.copilot/commands/start-tracked-change.md"), "utf8");
  assert.doesNotMatch(command, /\$\{input:/);
  assert.match(command, /preview only/);
});

test("all nine concept directories have their promised entry points", () => {
  const examples = {
    instructions: "copilot-instructions.md",
    prompts: "start-tracked-change.prompt.md",
    agents: "issue-triager.agent.md",
    skills: "issue-lifecycle/SKILL.md",
    hooks: "require-issue-reference.js",
    mcp: "issue-lifecycle-mcp.md",
    lsp: "README.md",
    plugins: "nuevo-issue-lifecycle/plugin.json",
    marketplace: "README.md",
  };
  for (const [directory, example] of Object.entries(examples)) {
    assert.ok(fs.statSync(path.join(root, directory, "README.md")).isFile());
    assert.ok(fs.statSync(path.join(root, directory, example)).isFile());
  }
});
