const { execSync } = require("child_process");
const path = require("path");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10
  }).trim();
}

(async () => {
  try {
    console.log("🚀 AUTO COMMIT RUNNING...");

    run("git add -A");

    const status = run("git diff --cached --name-status");
    if (!status) return;

    const lines = status.split("\n");

    const messages = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const code = parts[0]; // A / M / D / R
      const file = parts[parts.length - 1];

      const name = path.basename(file);
      const ext = path.extname(file).replace(".", "") || "file";

      let action = "update";

      if (code === "A") action = "add";
      else if (code === "D") action = "remove";
      else if (code === "R") action = "rename";
      else if (code === "M") action = "update";

      // 🔥 universal message
      return `${action}: ${name} ${ext}`;
    });

    // 🔥 combine message (first + count)
    let message = messages[0];

    if (messages.length > 1) {
      message += ` +${messages.length - 1} files`;
    }

    // 🚫 duplicate fix
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
