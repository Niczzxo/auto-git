const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10
  }).trim();
}

// ⏱ delay (3 sec batching)
const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  try {
    // 🔥 wait (batch multiple saves)
    await delay(3000);

    run("git add .");

    const status = run("git diff --cached --name-status");

    if (!status) {
      console.log("No changes");
      process.exit(0);
    }

    const diff = run("git diff --cached").slice(0, 800);

    // 🔥 detect type
    let type = "fix";
    if (status.includes("A")) type = "feat";
    else if (status.includes("D")) type = "remove";
    else if (status.includes("M")) type = "fix";

    // 🔥 smart prompt
    const prompt = `
You are an expert developer.

Generate a short git commit message.

Rules:
- max 8 words
- lowercase
- use prefix: ${type}
- clear and meaningful
- no symbols

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

    if (!message) message = `${type}: update code`;

    // 🔥 prevent duplicate spam
    let last = "";
    try {
      last = run("git log -1 --pretty=%B");
    } catch {}

    if (message === last) {
      console.log("Skipped duplicate commit");
      process.exit(0);
    }

    run(`git commit -m "${message}"`);
    run("git push");

    console.log("Committed:", message);

  } catch (e) {
    console.error("Error:", e.message);
  }
})();
