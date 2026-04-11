const { execSync } = require("child_process");

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

    const files = run("git diff --cached --name-only").split("\n");

    // 🔥 detect action
    let action = "update";
    if (status.includes("A")) action = "add";
    else if (status.includes("D")) action = "remove";

    // 🔥 generate smart message from file
    const messages = files.map(file => {
      const name = file.split("/").pop();

      if (file.endsWith(".html")) {
        return `feat: ${action} ${name} structure`;
      }
      if (file.endsWith(".css")) {
        return `style: ${action} ${name} styles`;
      }
      if (file.endsWith(".js")) {
        return `feat: ${action} ${name} logic`;
      }
      if (file.endsWith(".json")) {
        return `config: ${action} ${name}`;
      }

      return `fix: ${action} ${name}`;
    });

    // 🔥 join multiple files
    let message = messages[0];

    // 🚫 avoid duplicate
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
