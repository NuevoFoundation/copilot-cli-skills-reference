const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const plugin = path.join(root, "plugins", "nuevo-issue-lifecycle");
const args = process.argv.slice(2);
let check = false;
let starter;
let production;

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--check") check = true;
  else if (args[i] === "--starter" && args[i + 1] && !args[i + 1].startsWith("--")) {
    starter = path.resolve(args[++i]);
    if (!fs.existsSync(path.join(starter, "index.html")) || !fs.existsSync(path.join(starter, "styles.css"))) {
      throw new Error(`Not a starter directory: ${starter}`);
    }
  } else if (args[i] === "--production" && args[i + 1] && !args[i + 1].startsWith("--")) {
    production = path.resolve(args[++i], ".github", "skills", "issue-lifecycle", "SKILL.md");
    if (!fs.existsSync(production)) throw new Error(`Production skill not found: ${production}`);
  } else {
    throw new Error("Usage: node scripts\\sync-examples.js [--check] [--starter PATH] [--production REPO_PATH]");
  }
}

const files = [
  ["agents/issue-triager.agent.md", path.join(plugin, "com.github.copilot/agents/issue-triager.agent.md")],
  ["hooks/require-issue-reference.js", path.join(plugin, "com.github.copilot/hooks/require-issue-reference.js")],
];
const outputs = files.map(([source, destination]) => ({
  destination,
  content: fs.readFileSync(path.join(root, source)),
}));
const canonical = path.join(root, "skills", "issue-lifecycle", "SKILL.md");
const skill = fs.readFileSync(production || canonical, "utf8").replace(/\r\n/g, "\n");
if (!/^---\nname: issue-lifecycle\ndescription: .+\n---\n/.test(skill)) {
  throw new Error("Expected the issue-lifecycle production core.");
}
outputs.push({ destination: path.join(plugin, "skills", "issue-lifecycle", "SKILL.md"), content: Buffer.from(skill) });
if (production) outputs.push({ destination: canonical, content: Buffer.from(skill) });
if (starter) {
  outputs.push({ destination: path.join(starter, "rescue", "issue-lifecycle", "SKILL.md"), content: Buffer.from(skill) });
  const sections = [
    ["01-discovery.txt", "---\n"],
    ["02-target-and-gate.txt", "# Nuevo Foundation issue lifecycle\n"],
    ["03-start.txt", "## Start:"],
    ["04-work.txt", "## Work:"],
    ["05-finish.txt", "## Finish:"],
    ["06-preview-and-recovery.txt", "## Preview or unavailable services\n"],
  ];
  const starts = sections.map(([, marker]) => skill.indexOf(marker));
  if (starts.some((start, i) => start < 0 || (i && start <= starts[i - 1]))) {
    throw new Error("Skill sections changed; update the guided assembly intentionally.");
  }
  for (let i = 0; i < sections.length; i += 1) {
    outputs.push({
      destination: path.join(starter, "skill-parts", sections[i][0]),
      content: Buffer.from(skill.slice(starts[i], starts[i + 1] ?? skill.length)),
    });
  }
  const guidePath = path.join(starter, "lab-guide.html");
  const guide = fs.readFileSync(guidePath, "utf8");
  const marker = /<!-- CORE:BEGIN -->[\s\S]*?<!-- CORE:END -->/;
  if (!marker.test(guide)) throw new Error("Lab guide core marker is missing.");
  const escaped = skill.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  outputs.push({
    destination: guidePath,
    content: Buffer.from(guide.replace(marker, `<!-- CORE:BEGIN --><pre id="core-source" tabindex="0"><code>${escaped}</code></pre><!-- CORE:END -->`)),
  });
}
const prompt = fs.readFileSync(path.join(root, "prompts/start-tracked-change.prompt.md"), "utf8");
if (!/^The change to track: .*$/m.test(prompt)) throw new Error("Prompt input marker is missing.");
outputs.push({
  destination: path.join(plugin, "com.github.copilot/commands/start-tracked-change.md"),
  content: Buffer.from(prompt.replace(
    /^The change to track: .*$/m,
    "The change to track: use the change supplied in the invocation. If missing, ask for one sentence. If the user requests preview only, explain the steps without making any writes."
  )),
});

let mismatches = 0;
for (const { destination, content } of outputs) {
  if (check) {
    if (!fs.existsSync(destination) || !fs.readFileSync(destination).equals(content)) {
      console.error(`Out of sync: ${destination}`);
      mismatches += 1;
    }
  } else {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }
}
if (mismatches) process.exitCode = 1;
else console.log(`${check ? "Verified" : "Synchronized"} ${outputs.length} example payloads.`);
