const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10
  }).trim();
}

(async () => {
  try {
    // 🔥 detect delete + update সব
    run("git add -A");

    const diffFull = run("git diff --cached");
    if (!diffFull) return;

    const diff = diffFull.slice(0, 600);
    const files = run("git diff --cached --name-only");

    // 🧠 STEP 1: heuristic detect
    let type = "fix";

    if (diff.includes("background") || files.includes(".css")) {
      type = "style";
    }
    else if (diff.includes("function") || files.includes(".js")) {
      type = "feat";
    }
    else if (diff.includes("error") || diff.includes("fix")) {
      type = "fix";
    }
    else if (files.includes(".json")) {
      type = "config";
    }
    else if (files.includes(".md")) {
      type = "docs";
    }

    // 🧠 STEP 2: AI refine message
    const prompt = `
Generate a git commit message.

Rules:
- max 7 words
- lowercase
- prefix: ${type}
- meaningful and specific

Changed files:
${files}

Code diff:
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

    // 🚫 duplicate avoid
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) return;

    run(`git commit -m "${message}"`);

    // 🔥 push safe
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
