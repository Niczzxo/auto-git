const { execSync } = require("child_process");
const path = require("path");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10
  }).trim();
}

function humanize(file) {
  return path.basename(file)
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ");
}

function detectContext(diff, file) {
  const lower = diff.toLowerCase();

  // 🧠 detect intent
  if (lower.includes("color") || lower.includes("style") || file.match(/\.(css|scss)$/)) {
    return "update ui design";
  }

  if (lower.includes("function") || lower.includes("return") || file.match(/\.(js|ts)$/)) {
    return "update logic";
  }

  if (lower.includes("error") || lower.includes("fix") || lower.includes("bug")) {
    return "fix issue";
  }

  if (lower.includes("api") || lower.includes("fetch")) {
    return "update api handling";
  }

  if (lower.includes("config") || file.match(/\.json/)) {
    return "update configuration";
  }

  return "update code";
}

(async () => {
  try {
    console.log("🚀 SMART AUTO COMMIT...");

    run("git add -A");

    const status = run("git diff --cached --name-status");
    if (!status) return;

    const diff = run("git diff --cached").slice(0, 800);
    const lines = status.split("\n");

    const messages = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const code = parts[0];
      const file = parts[parts.length - 1];

      const name = humanize(file);
      const context = detectContext(diff, file);

      let action = "update";

      if (code === "A") action = "add";
      else if (code === "D") action = "remove";
      else if (code === "R") action = "rename";

      // 🔥 human + context based message
      return `${action} ${name} ${context}`;
    });

    let message = messages[0];

    if (messages.length > 1) {
      message += ` and ${messages.length - 1} more updates`;
    }

    // 🚫 avoid same message
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) {
      message += " " + Date.now().toString().slice(-4);
    }

    run(`git commit -m "${message}"`);

    const branch = run("git rev-parse --abbrev-ref HEAD");

    try {
      run(`git push origin ${branch}`);
    } catch {
      run(`git push -u origin ${branch}`);
    }

    console.log("✔", message);

  } catch (e) {
    console.log("❌ Error:", e.message);
  }
})();
