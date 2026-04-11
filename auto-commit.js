const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20
  }).trim();
}

(async () => {
  try {
    console.log("🧠 DEEP AI COMMIT RUNNING...");

    run("git add -A");

    const diff = run("git diff --cached").slice(0, 1200);
    if (!diff) return;

    const files = run("git diff --cached --name-only");

    // 🔥 REAL AI PROMPT
    const prompt = `
You are a senior software engineer.

Analyze the code changes and write a git commit message.

Rules:
- human-like sentence
- max 8 words
- explain what changed AND why
- no generic words like "update code"
- lowercase only

Files:
${files}

Changes:
${diff}
`;

    const ai = execSync(
      `ollama run phi3 "${prompt}"`,
      { encoding: "utf-8" }
    ).trim();

    let message = ai.split("\n")[0]
      .replace(/[^a-z0-9 ]/gi, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();

    if (!message || message.length < 5) {
      message = "improve code logic";
    }

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
