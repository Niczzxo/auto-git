const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20
  }).trim();
}

(async () => {
  try {
    console.log("🧠 HUMAN AI COMMIT RUNNING...");

    run("git add -A");

    const diff = run("git diff --cached").slice(0, 1200);
    if (!diff) {
      console.log("No changes");
      return;
    }

    const files = run("git diff --cached --name-only");

    // 🔥 HUMAN STYLE PROMPT
    const prompt = `
You are a senior developer.

Write a human-like git commit message.

Rules:
- short sentence (5–10 words)
- explain what changed
- natural language (like a human)
- no symbols except spaces
- lowercase only
- no generic words like "update code"

Examples:
- add login page layout
- fix navbar alignment on mobile
- improve search performance logic

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
      .replace(/[^a-z ]/gi, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();

    // 🔥 SMART FALLBACK (human-like)
    if (!message || message.length < 5) {
      const firstFile = files.split("\n")[0];

      if (firstFile.includes(".html")) {
        message = "add new page structure";
      } else if (firstFile.includes(".css")) {
        message = "improve ui styling";
      } else if (firstFile.includes(".js")) {
        message = "update application logic";
      } else {
        message = `update ${firstFile}`;
      }
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
