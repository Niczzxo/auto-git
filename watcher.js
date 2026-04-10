const { exec } = require("child_process");

setInterval(() => {
  exec('node "C:\\auto-git\\auto-commit.js"', (err) => {});
}, 2000); // every 2 sec
