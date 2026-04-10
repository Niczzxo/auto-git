const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20
  }).trim();
}

(async () => {
  try {
    // ⚡ NO DELAY (lightning mode)
    run("git add .");

    const diffFull = run("git diff --cached");
    if (!diffFull) return;

    const diff = diffFull.slice(0, 600);

    // 🧠 AI detect type automatically
    const prompt = `
Analyze code changes and generate a git commit message.

Rules:
- max 7 words
- lowercase
- prefix must be one of: feat, fix, style, refactor
- choose type based on change meaning

Changes:
${diff}
`;

    const ai = execSync(
      `ollama run tinyllama "${prompt}"`,
      { encoding: "utf-8" }
    ).trim();

    let message = ai.split("\n")[0]
      .replace(/[^a-z0-9: ]/gi, "")
      .toLowerCase()
      .trim();

    if (!message) message = "fix: update code";

    // 🚫 duplicate block
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) return;

    run(`git commit -m "${message}"`);

    // 🔥 smart push
    let branch = "main";
    try {
      branch = run("git rev-parse --abbrev-ref HEAD");
    } catch {}

    try {
      run(`git push origin ${branch}`);
    } catch {
      run(`git push -u origin ${branch}`);
    }

    // 📊 GRAPH (last 5 commits)
    const graph = run("git log --oneline -5");

    console.log("━━━━━━━━━━━━━━━━━━");
    console.log("⚡ GOD MODE ACTIVE");
    console.log("📂", process.cwd());
    console.log("📝", message);
    console.log("📊 Recent Commits:");
    console.log(graph);
    console.log("━━━━━━━━━━━━━━━━━━");

  } catch (e) {
    console.log("⚠️", e.message);
  }
})();
