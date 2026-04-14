const { execSync } = require("child_process");
const axios = require("axios");

// ✅ কনফিগারেশন
const OPENROUTER_API_KEY = "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";
const MODEL_NAME = "nvidia/nemotron-3-super-120b-a12b:free";

function run(cmd) {
    try {
        return execSync(cmd, { encoding: "utf-8", stdio: 'pipe' }).trim();
    } catch (e) {
        return "";
    }
}

(async () => {
    try {
        console.log("🔍 Checking for changes...");
        run("git add -A");

        const rawDiff = run("git diff --cached");
        const files = run("git diff --cached --name-only");

        if (!rawDiff || rawDiff.length < 5) {
            console.log("ℹ No meaningful changes to commit.");
            return;
        }

        console.log(`🤖 Requesting AI Commit Message...`);

        // সরাসরি API কল (এটি সবথেকে স্ট্যাবল পদ্ধতি)
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: MODEL_NAME,
            messages: [
                {
                    role: "user",
                    content: `Write a professional conventional commit message for these changes:\nFiles: ${files}\nDiff: ${rawDiff.slice(0, 3000)}`
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/Niczzxo/auto-git", // ঐচ্ছিক
                "X-Title": "Auto Commit Script" // ঐচ্ছিক
            }
        });

        const commitMessage = response.data.choices[0].message.content.trim();

        console.log("📦 Committing...");
        // মেসেজে ডাবল কোট থাকলে তা হ্যান্ডেল করা
        const safeMessage = commitMessage.replace(/"/g, '\\"');
        run(`git commit -m "${safeMessage}"`);

        const branch = run("git rev-parse --abbrev-ref HEAD") || "main";
        console.log(`🚀 Pushing to ${branch}...`);
        run(`git push origin ${branch}`);

        console.log("✅ SUCCESS: " + commitMessage.split('\n')[0]);

    } catch (error) {
        if (error.response) {
            console.error("❌ API Error:", error.response.data);
        } else {
            console.error("❌ Script Error:", error.message);
        }
    }
})();
