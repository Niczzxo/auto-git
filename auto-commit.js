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

    // 🔥 stage everything (important)
    run("git add -A");

    const diffFull = run("git diff --cached");
    if (!diffFull) {
      console.log("No changes");
      return;
    }

    const diff = diffFull.slice(0, 600);
    const files = run("git diff --cached --name-only");

    // 🧠 SMART TYPE DETECTION
    let type = "fix";

    if (/\.(css|scss|sass)$/i.test(files)) {
      type = "style";
    }
    else if (/\.(js|ts)$/i.test(files)) {
      type = "feat";
    }
    else if (/error|bug|fix/i.test(diff)) {
      type = "fix";
    }
    else if (/\.json/i.test(files)) {
      type = "config";
    }
    else if (/\.md/i.test(files)) {
      type = "docs";
    }

    // 🧠 AI PROMPT (clean + strict)
    const prompt = `
Write a git commit message.

Rules:
- max 6 words
- lowercase
- prefix: ${type}
- no symbols except :
- clean and meaningful

Files:
${files}

Changes:
${diff}
`;

    const ai = execSync(
      `ollama run tinyllama "${prompt}"`,
      { encoding: "utf-8" }
    ).trim();

    // 🔥 CLEAN OUTPUT HARD
    let message = ai.split("\n")[0]
      .replace(/[^a-z0-9: ]/gi, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();

    if (!message || message.length < 5) {
      message = `${type}: update code`;
    }

    // 🚫 avoid duplicate
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) {
      console.log("Skipped duplicate");
      return;
    }

    run(`git commit -m "${message}"`);

    // 🔥 push safe (auto fix)
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
