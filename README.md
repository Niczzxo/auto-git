# 🚀 AI-Powered Git Auto Commit & Push System (Full Guide)

## 🧠 Overview

এই system একটা **fully automated Git workflow**, যেখানে:

👉 তুমি শুধু code লিখবা
👉 save দিবা
👉 automatically:

* changes detect হবে
* AI commit message generate করবে
* commit হবে
* GitHub এ push হয়ে যাবে

✔ কোনো manual git command লাগবে না

---

# 🤖 AI Used

এই project এ ব্যবহার করা হয়েছে:

### 🟢 Primary AI

* **phi3 (Ollama model)**
  👉 human-like commit message generate করে

### 🟡 Optional (backup)

* tinyllama (low quality, recommend না)

---

# ⚙️ INSTALLATION (A to Z)

## 1️⃣ Install Ollama

PowerShell এ run করো:

```bash
irm https://ollama.com/install.ps1 | iex
```

---

## 2️⃣ Install AI Model

```bash
ollama pull phi3
```

✔ এইটাই main AI model

---

## 3️⃣ Test AI

```bash
ollama run phi3
```

type করো:

```
write a git commit message for fixing navbar alignment
```

✔ যদি output আসে → সব ঠিক

---

# 📁 PROJECT STRUCTURE

```text
C:\auto-git\
  └── auto-commit.js   (main script)
```

---

# ⚡ SCRIPT কী করে?

1. সব file detect করে:

```bash
git add -A
```

2. diff নেয়:

```bash
git diff --cached
```

3. AI কে দেয়

4. AI commit message বানায়

5. auto:

```bash
git commit
git push
```

---

# ▶️ RUN SYSTEM

## Manual Run

```bash
node C:\auto-git\auto-commit.js
```

---

## 🔥 Auto Run (BEST)

VS Code → settings.json এ add করো:

```json
"emeraldwalk.runonsave": {
  "commands": [
    {
      "match": ".*",
      "cmd": "node \"C:\\auto-git\\auto-commit.js\""
    }
  ]
}
```

✔ এখন save দিলেই auto commit + push

---

# 🧩 REQUIRED EXTENSIONS

VS Code এ install করো:

### ✅ Required

* **Run On Save (emeraldwalk.runonsave)**

---

### ❌ REMOVE THESE (conflict avoid)

* git-auto-commit
* commitizen
* অন্য auto git extension

---

# ⚙️ settings.json FULL CONFIG

```json
{
  "git.autofetch": true,
  "git.enableSmartCommit": true,
  "git.confirmSync": false,

  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": ".*",
        "cmd": "node \"C:\\auto-git\\auto-commit.js\""
      }
    ]
  }
}
```

---

# 📦 SOURCE CONTROL (Git) USE

## 🔓 Open Source Control

👉 VS Code shortcut:

```
Ctrl + Shift + G
```

👉 বা sidebar এ Git icon

---

## 🟢 Enable Git (if needed)

```bash
git init
```

---

## 🔗 Connect GitHub

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

👉 একবার করলেই future auto push হবে

---

# 🔄 WHAT SYSTEM SUPPORTS

✔ file create
✔ file update
✔ file delete
✔ file rename
✔ folder change
✔ ANY file type

👉 সব automatically commit + push হবে

---

# ✍️ COMMIT STYLE

## 🟢 Example:

```
add login page layout
fix navbar alignment on mobile
improve search result performance
update api request handling logic
```

✔ human-like
✔ meaningful
✔ short

---

# 🧠 FEATURES

✔ AI commit message
✔ auto commit
✔ auto push
✔ duplicate prevent
✔ fallback system
✔ future-proof

---

# ⚠️ IMPORTANT NOTES

👉 file copy করলে VS Code save trigger হয় না
👉 তাই মাঝে মাঝে manual run দরকার:

```bash
node C:\auto-git\auto-commit.js
```

---

# 📤 HOW OTHERS CAN USE THIS

## Steps:

1. এই project copy করো
2. install:

   ```bash
   ollama pull phi3
   ```
3. script place করো:

   ```
   C:\auto-git\auto-commit.js
   ```
4. VS Code setting add করো
5. Git setup করো:

```bash
git init
git remote add origin <repo>
git push -u origin main
```

---

# 🚀 FINAL WORKFLOW

👉 তুমি যা করবা:

1. code লিখবা
2. save দিবা

👉 বাকিটা automatic:

✔ commit ✔
✔ message ✔
✔ push ✔

---

# 😎 SUMMARY

এই system basically:

👉 **"write code → save → done"**

---

# 🔥 FUTURE UPGRADE (OPTIONAL)

* CI/CD
* auto deploy
* PR automation
* branch protection
* team workflow

---

## 👨‍💻 Built System

👉 custom AI Git automation
👉 local AI powered
👉 no API needed

---

**Enjoy automated development 🚀**
