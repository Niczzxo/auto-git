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

    const diff = run("git diff --cached").slice(0, 400);
    const files = run("git diff --cached --name-only");

    // 🧠 TYPE DETECT
    let type = "fix";

    if (status.includes("A")) type = "feat";
    else if (status.includes("D")) type = "remove";
    else if (files.match(/\.(css|scss)$/)) type = "style";
    else if (files.match(/\.(js|ts)$/)) type = "feat";
    else if (files.match(/\.html/)) type = "feat";
    else if (files.match(/\.json/)) type = "config";

    // 🧠 BETTER PROMPT
    const prompt = `
Generate a git commit message based on changes.

Rules:
- max 6 words
- lowercase
- prefix with ${type}
- be specific (no "update code")

Files:
${files}
`;

    const ai = execSync(
      `ollama run tinyllama "${prompt}"`,
      { encoding: "utf-8" }
    ).trim();

    let message = ai.split("\n")[0]
      .replace(/[^a-z0-9: ]/gi, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();

    // 🔥 SMART FALLBACK (NOT GENERIC)
    if (!message || message.includes("update code")) {
      const fileName = files.split("\n")[0];

      if (fileName.includes(".html")) {
        message = `${type}: add html structure`;
      } else if (fileName.includes(".css")) {
        message = `${type}: update ui styles`;
      } else if (fileName.includes(".js")) {
        message = `${type}: update logic`;
      } else {
        message = `${type}: update ${fileName}`;
      }
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
