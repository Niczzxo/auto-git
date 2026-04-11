const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20
  }).trim();
}

function detectType(diff, file) {
  const lower = diff.toLowerCase();

  if (lower.includes("fix") || lower.includes("error") || lower.includes("bug")) {
    return "fix";
  }

  if (file.match(/\.(css|scss)$/) || lower.includes("style")) {
    return "style";
  }

  if (lower.includes("refactor") || lower.includes("cleanup")) {
    return "refactor";
  }

  if (file.match(/\.json/) || lower.includes("config")) {
    return "chore";
  }

  return "feat";
}

(async () => {
  try {
    console.log("🧠 TEAM LEVEL COMMIT...");

    run("git add -A");

    const diff = run("git diff --cached").slice(0, 1200);
    if (!diff) return;

    const files = run("git diff --cached --name-only");
    const firstFile = files.split("\n")[0];

    const type = detectType(diff, firstFile);

    // 🔥 TEAM LEVEL PROMPT
    const prompt = `
Write a professional git commit message.

Format:
title line + empty line + bullet points

Rules:
- title: max 7 words
- prefix with ${type}:
- body: 2-3 bullet points
- human readable
- no unnecessary text
- lowercase

Example:
feat: add login validation

- validate email input
- improve form handling
- prevent invalid submission

Files:
${files}

Changes:
${diff}
`;

    const ai = execSync(
      `ollama run phi3 "${prompt}"`,
      { encoding: "utf-8" }
    ).trim();

    let lines = ai.split("\n");

    let title = lines[0]
      .replace(/[^a-z: ]/gi, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();

    // 🔥 fallback title
    if (!title || title.length < 5) {
      const name = firstFile.split("/").pop().replace(/\.[^/.]+$/, "");
      title = `${type}: update ${name}`;
    }

    // 🔥 body (clean bullet lines)
    let body = lines.slice(1)
      .filter(line => line.trim().startsWith("-"))
      .slice(0, 3)
      .join("\n");

    if (!body) {
      body = `- update ${firstFile}`;
    }

    const message = `${title}\n\n${body}`;

    // 🚫 duplicate fix
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    let finalMessage = message;
    if (message === last) {
      finalMessage += `\n- update timestamp ${Date.now().toString().slice(-3)}`;
    }

    run(`git commit -m "${finalMessage}"`);

    const branch = run("git rev-parse --abbrev-ref HEAD");

    try {
      run(`git push origin ${branch}`);
    } catch {
      run(`git push -u origin ${branch}`);
    }

    console.log("✔ COMMITTED:\n", finalMessage);

  } catch (e) {
    console.log("❌ Error:", e.message);
  }
})();
