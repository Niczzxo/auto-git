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
    if (!status) {
      console.log("No changes");
      return;
    }

    const diff = run("git diff --cached").slice(0, 600);
    const files = run("git diff --cached --name-only");

    // 🧠 TYPE DETECT (STRONG)
    let type = "fix";

    if (status.includes("A")) type = "feat"; // new file
    else if (status.includes("D")) type = "remove";
    else if (/\.(css|scss)$/i.test(files)) type = "style";
    else if (/\.(js|ts)$/i.test(files)) type = "feat";
    else if (/\.(html)$/i.test(files)) type = "feat";
    else if (/\.json/i.test(files)) type = "config";

    // 🧠 AI MESSAGE
    const prompt = `
Write a human-like git commit message.

Rules:
- max 6 words
- lowercase
- prefix: ${type}
- meaningful
- based on changes

Files:
${files}

Changes:
${diff}
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

    if (!message || message.length < 5) {
      message = `${type}: update code`;
    }

    // 🚨 FORCE UNIQUE MESSAGE
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) {
      const time = new Date().toLocaleTimeString().replace(/:/g, "");
      message = message + " " + time; // 🔥 make unique
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
