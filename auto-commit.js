const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10
  }).trim();
}

(async () => {
  try {
    run("git add .");

    const diff = run("git diff --cached").slice(0, 500);
    if (!diff) return;

    // 🧠 AI commit message
    const ai = execSync(
      `ollama run tinyllama "write short meaningful git commit message (feat/fix/style): ${diff}"`,
      { encoding: "utf-8" }
    ).trim();

    let message = ai.split("\n")[0]
      .replace(/[^a-z0-9: ]/gi, "")
      .toLowerCase()
      .trim();

    if (!message) message = "fix: update code";

    // 🚫 duplicate avoid
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) return;

    run(`git commit -m "${message}"`);

    // 🔥 AUTO PUSH FIXED
    const branch = run("git rev-parse --abbrev-ref HEAD");
    try {
      run(`git push origin ${branch}`);
    } catch {
      run(`git push -u origin ${branch}`);
    }

    console.log("✔", message);

  } catch (e) {
    console.log("Error:", e.message);
  }
})();
