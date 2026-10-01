const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");
const { evaluate } = require("../hooks/require-issue-reference.js");

const cases = [
  ["ordinary read", "git status --short", false],
  ["missing reference", 'git commit -m "Use yellow"', true],
  ["actual reference", 'git commit -m "Use yellow (#42)"', false],
  ["message option", 'git commit --message="Use yellow (#42)"', false],
  ["short attached option", 'git commit -m"Use yellow (#42)"', false],
  ["multiple paragraphs", 'git commit -m "Use yellow" -m "Tracks #42"', false],
  ["all tracked files option", 'git commit -am "Use yellow (#42)"', false],
  ["GitHub issue URL", 'git commit -m "Tracks https://github.com/nuevo/lab/issues/42"', false],
  ["qualified reference", 'git commit -m "Tracks nuevo/lab#42"', false],
  ["zero is not an issue", 'git commit -m "Use yellow (#0)"', true],
  ["color is not an issue", 'git commit -m "Use #123abc"', true],
  ["global directory option", 'git -C . commit -m "Use yellow"', true],
  ["global attached directory", 'git -C. commit -m "Use yellow"', true],
  ["config is not message", 'git -c user.name="#42" commit -m "Use yellow"', true],
  ["global worktree option", 'git --work-tree=. --git-dir=.git commit -m "Use yellow"', true],
  ["git exe", 'git.exe commit -m "Use yellow"', true],
  ["quoted executable", '"C:\\Program Files\\Git\\cmd\\git.exe" commit -m "Use yellow (#42)"', false],
  ["PowerShell call operator", '& git commit -m "Use yellow"', true],
  ["description command is not message", 'echo "#42"; git commit -m "Use yellow"', true],
  ["later command is not message", 'git commit -m "Use yellow"; echo "#42"', true],
  ["comment is not message", 'git commit -m "Use yellow" #42', true],
  ["path is not message", 'git commit -m "Use yellow" -- "#42.txt"', true],
  ["second commit needs own reference", 'git commit -m "First (#42)" && git commit -m "Second"', true],
  ["two valid commits", 'git commit -m "First (#42)"; git commit -m "Second (#43)"', false],
  ["newline separated commands", 'echo "#42"\ngit commit -m "Use yellow"', true],
  ["read-only string mention", 'echo "git commit -m missing"', false],
  ["missing message", "git commit", true],
  ["unclosed quotation", 'git commit -m "Use yellow (#42)', true],
  ["variable message", 'git commit -m "$message (#42)"', true],
  ["file message", 'git commit -F message.txt', true],
  ["file message plus literal", 'git commit -F message.txt -m "Extra (#42)"', true],
  ["reuse message", "git commit --reuse-message=HEAD", true],
  ["fixup message", "git commit --fixup=HEAD", true],
];

for (const [name, command, denied] of cases) {
  test(name, () => {
    const result = evaluate({ toolName: "powershell", toolArgs: { command } });
    if (denied) assert.equal(result.permissionDecision, "deny");
    else assert.deepEqual(result, {});
    assert.notEqual(result.permissionDecision, "allow");
  });
}

test("a reference in metadata cannot approve a commit", () => {
  const result = evaluate({
    toolName: "powershell",
    toolArgs: { command: 'git commit -m "Use yellow"', description: "Fix #42" },
  });
  assert.equal(result.permissionDecision, "deny");
});

test("unrelated tools preserve normal permissions", () => {
  assert.deepEqual(evaluate({ toolName: "view", toolArgs: { path: "README.md" } }), {});
});

test("JSON-encoded toolArgs are decoded, not searched as raw text", () => {
  assert.deepEqual(evaluate({
    toolName: "bash",
    toolArgs: JSON.stringify({ command: 'git commit -m "Use yellow (#42)"' }),
  }), {});
  assert.equal(evaluate({
    toolName: "bash",
    toolArgs: JSON.stringify({ command: 'git commit -m "Use yellow"', description: "#42" }),
  }).permissionDecision, "deny");
  assert.equal(evaluate({ toolName: "bash", toolArgs: "{bad" }).permissionDecision, "deny");
});

test("malformed shell arguments are visible denials", () => {
  for (const payload of [null, {}, { toolName: "shell" }, { toolName: "shell", toolArgs: "{}" }]) {
    assert.equal(evaluate(payload).permissionDecision, "deny");
  }
});

test("stdin protocol emits valid JSON and an explicit error for malformed input", () => {
  const child = spawnSync(process.execPath, [path.join(__dirname, "../hooks/require-issue-reference.js")], {
    input: "{broken",
    encoding: "utf8",
  });
  assert.equal(child.status, 0);
  assert.equal(JSON.parse(child.stdout).permissionDecision, "deny");
  assert.match(child.stderr, /Invalid hook JSON/);
});

test("plugin and standalone script are byte-identical", () => {
  const canonical = fs.readFileSync(path.join(__dirname, "../hooks/require-issue-reference.js"));
  const bundled = fs.readFileSync(path.join(__dirname, "../plugins/nuevo-issue-lifecycle/com.github.copilot/hooks/require-issue-reference.js"));
  assert.deepEqual(bundled, canonical);
});
