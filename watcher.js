const { exec } = require("child_process");

console.log("👀 Watching for changes...");

setInterval(() => {
  exec('node "C:\\auto-git\\auto-commit.js"', () => {});
}, 1000);
