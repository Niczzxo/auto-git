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

    const diff = run("git diff --cached").slice(0, 1000);
    if (!diff) {
      console.log("No changes");
      return;
    }

    const files = run("git diff --cached --name-only");

    // 🔥 STRICT PROMPT (VERY IMPORTANT)
    const prompt = `
Write a git commit message.

STRICT RULES:
- max 6 words
- single line only
- no explanation
- no names, no links, no numbers
- no symbols except space
- lowercase only
- must describe change clearly

Files:
${files}

Changes:
${diff}
`;

    const ai = execSync(
      `ollama run phi3 "${prompt}"`,
      { encoding: "utf-8" }
    ).trim();

    // 🔥 HARD CLEAN (anti-garbage)
    let message = ai.split("\n")[0]
      .replace(/[^a-z ]/gi, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();

    // 🔥 fallback (SMART)
    if (!message || message.length < 5) {
      const firstFile = files.split("\n")[0];
      message = `update ${firstFile}`;
    }

    // 🚫 duplicate fix
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) {
      message += " " + Date.now().toString().slice(-3);
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
