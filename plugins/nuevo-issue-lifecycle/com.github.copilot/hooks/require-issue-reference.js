const fs = require("node:fs");

const SHELL_TOOLS = new Set(["bash", "powershell", "shell"]);
const ISSUE_REFERENCE = /(?:^|[\s(])(?:[\w.-]+\/[\w.-]+)?#[1-9]\d*\b|https?:\/\/[^\s]+\/issues\/[1-9]\d*\b/;
const OPTIONS_WITH_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--config-env"]);

function deny(reason) {
  return { permissionDecision: "deny", permissionDecisionReason: reason };
}

// Only a small literal-command subset is inspected, not a complete shell grammar.
function splitCommands(command) {
  const commands = [[]];
  let text = "";
  let started = false;
  let quote = "";
  let quoteCount = 0;
  let literal = true;

  function finishToken() {
    if (started) commands.at(-1).push({ text, literal: literal && quoteCount <= 1 });
    text = "";
    started = false;
    quoteCount = 0;
    literal = true;
  }

  for (let i = 0; i < command.length; i += 1) {
    const char = command[i];
    if (quote) {
      if (char === quote) {
        quote = "";
      } else {
        if (quote === '"' && /[$`\\]/.test(char)) literal = false;
        text += char;
      }
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      quoteCount += 1;
      started = true;
    } else if (/[;&|\r\n]/.test(char)) {
      finishToken();
      if (commands.at(-1).length) commands.push([]);
    } else if (/\s/.test(char)) {
      finishToken();
    } else if (char === "#" && !started) {
      while (i < command.length && !/[\r\n]/.test(command[i])) i += 1;
      finishToken();
      if (commands.at(-1).length) commands.push([]);
    } else {
      started = true;
      if (/[$`<>(){}]/.test(char)) literal = false;
      text += char;
    }
  }
  if (quote) throw new SyntaxError("Unclosed quotation in the command.");
  finishToken();
  return commands.filter((tokens) => tokens.length);
}

function commitArguments(tokens) {
  if (!/^git(?:\.exe)?$/i.test(tokens[0].text.split(/[\\/]/).at(-1))) return null;
  for (let i = 1; i < tokens.length; i += 1) {
    const option = tokens[i].text;
    if (option === "commit") return tokens.slice(i + 1);
    if (OPTIONS_WITH_VALUE.has(option)) {
      i += 1;
    } else if (/^(?:-C.+|-c.+|--(?:git-dir|work-tree|namespace|config-env)=.+)$/.test(option)) {
      continue;
    } else if (["--no-pager", "--paginate", "--no-optional-locks", "--literal-pathspecs"].includes(option)) {
      continue;
    } else {
      return null;
    }
  }
  return null;
}

function evaluate(payload) {
  if (!payload || typeof payload !== "object" || typeof payload.toolName !== "string") {
    return deny("Invalid hook payload: expected toolName and toolArgs. Inspect the hook configuration.");
  }
  if (!SHELL_TOOLS.has(payload.toolName.toLowerCase())) return {};
  let toolArgs = payload.toolArgs;
  if (typeof toolArgs === "string") {
    try {
      toolArgs = JSON.parse(toolArgs);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      return deny("Invalid toolArgs JSON. No permission was granted.");
    }
  }
  if (!toolArgs || typeof toolArgs.command !== "string") {
    return deny("Invalid shell payload: toolArgs.command must be a string. No permission was granted.");
  }

  let commands;
  try {
    commands = splitCommands(toolArgs.command);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return deny(`Cannot inspect this command: ${error.message} Use a simple literal git commit command.`);
  }

  for (const tokens of commands) {
    const args = commitArguments(tokens);
    if (!args) continue;
    const messages = [];
    let unsupported = false;
    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (arg.text === "--") break;
      if (arg.text === "-m" || arg.text === "--message" || arg.text === "-am") {
        const message = args[++i];
        if (!message || !message.literal) unsupported = true;
        else messages.push(message.text);
      } else if (/^(?:--message=|-m.)/.test(arg.text)) {
        if (!arg.literal) unsupported = true;
        messages.push(arg.text.replace(/^(?:--message=|-m)/, ""));
      } else if (/^(?:-F|-C|-c|--file|--reuse-message|--reedit-message|--fixup|--squash|--trailer)/.test(arg.text)) {
        unsupported = true;
      }
    }
    if (unsupported || !messages.length) {
      return deny("This teaching guard inspects literal -m messages only. Use git commit -m \"Describe the change (#42)\" with your actual issue number; file, variable, reused and generated messages need a different check.");
    }
    if (!ISSUE_REFERENCE.test(messages.join("\n"))) {
      return deny("The commit message needs an issue reference, for example (#42). A number in a tool description, filename, comment or another command does not count. Open the issue first.");
    }
  }
  return {};
}

if (require.main === module) {
  let result;
  try {
    result = evaluate(JSON.parse(fs.readFileSync(0, "utf8")));
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    result = deny("Invalid hook JSON. The command was not approved; fix the hook input.");
  }
  if (result.permissionDecision === "deny") {
    process.stderr.write(`[issue-reference] ${result.permissionDecisionReason}\n`);
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

module.exports = { evaluate };
