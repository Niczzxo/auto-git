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

    let diff = "";
    try {
      diff = run("git diff --cached").slice(0, 1200);
    } catch {
      diff = "";
    }

    const files = run("git diff --cached --name-only");

    let message = "";

    // 🔥 No changes → empty commit
    if (!diff) {
      console.log("⚠ No changes → creating empty commit");

      message = "daily progress update";
      run(`git commit --allow-empty -m "${message}"`);
    } else {
      const prompt = `
You are a senior developer.

Write a git commit message.

Rules:
- 5 to 8 words only
- lowercase only
- no symbols or punctuation
- no words like feat fix chore
- natural human sentence

Files:
${files}

Changes:
${diff}
`;

      let ai = "";

      try {
        const safePrompt = prompt.replace(/"/g, '\\"');

        // ✅ YOUR LINE (tinyllama AI)
        ai = execSync(
          `ollama run tinyllama "${safePrompt}"`,
          { encoding: "utf-8", timeout: 20000 }
        ).trim();

      } catch (e) {
        console.log("⚠ AI failed, using fallback...");
        ai = "";
      }

      message = ai.split("\n")[0]
        .replace(/[^a-z ]/g, "")
        .replace(/\b(feat|fix|chore)\b/g, "")
        .replace(/\s+/g, " ")
        .toLowerCase()
        .trim();

      // 🔥 fallback (smart)
      if (!message || message.length < 5) {
        const firstFile = files.split("\n")[0] || "files";

        if (firstFile.includes(".html")) {
          message = "update page structure";
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

      console.log("📦 committing:", message);
      run(`git commit -m "${message}"`);
    }

    const branch = run("git rev-parse --abbrev-ref HEAD");

    console.log("🚀 pushing to", branch);

    try {
      console.log(run(`git push origin ${branch}`));
    } catch {
      console.log("⚠ retrying with upstream...");
      console.log(run(`git push -u origin ${branch}`));
    }

    console.log("✔ DONE:", message);

  } catch (e) {
    console.log("❌ Error:", e.message);
  }
})();
