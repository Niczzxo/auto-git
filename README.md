# 🚀 AI-Powered Git Auto Commit & Push System (Full Guide)

---

# 🧠 Overview

এই system automatically:

✔ code change detect করে
✔ AI দিয়ে commit message বানায়
✔ auto commit করে
✔ auto push করে

👉 শুধু code লিখো + save দাও = DONE

---

# 🤖 AI Used

### 🟢 Main AI

* **phi3 (Ollama)** → human-like commit message

---

# ⚙️ INSTALLATION

## 1️⃣ Install Ollama

```bash
irm https://ollama.com/install.ps1 | iex
```

---

## 2️⃣ Install AI Model

```bash
ollama pull phi3
```

---

## 3️⃣ Run AI (Test)

```bash
ollama run phi3
```

👉 তারপর লিখো:

```text
write a git commit message for fixing navbar alignment
```

✔ output আসলে AI ready

---

## ❌ Remove Model (optional)

```bash
ollama rm phi3
```

---

# 📁 FILE STRUCTURE

```text
C:\auto-git\
  ├── auto-commit.js
  └── watcher.js
```

---

# ⚡ SYSTEM WORKFLOW

1. detect changes
2. AI generate message
3. auto commit
4. auto push

---

# ▶️ RUN SYSTEM

## 🔥 Manual Run

```bash
node C:\auto-git\auto-commit.js
```

---

## 👀 Auto Watch Mode (BEST)

👉 run this:

```bash
node C:\auto-git\watcher.js
```

👉 এটা প্রতি 2 second এ check করবে
👉 file copy / delete / change সব detect করবে

---

# 🧩 REQUIRED EXTENSIONS

✔ Run On Save

---

# ⚙️ settings.json

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

# 📦 SOURCE CONTROL (Git)

## Open Source Control

```text
Ctrl + Shift + G
```

---

## Init Repo

```bash
git init
```

---

## Connect GitHub

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

---

# 🔄 WHAT IT SUPPORTS

✔ create file
✔ update file
✔ delete file
✔ rename
✔ copy file
✔ any file type

---

# ✍️ COMMIT STYLE

```text
add login page layout
fix navbar alignment on mobile
improve search performance logic
```

---

# ⚠️ IMPORTANT

👉 save দিলে RunOnSave কাজ করে
👉 কিন্তু file copy করলে trigger হয় না

👉 তাই watcher ব্যবহার করো:

```bash
node C:\auto-git\watcher.js
```

---

# 📤 HOW OTHERS CAN USE

1. project copy করো
2. install ollama
3. run:

```bash
ollama pull phi3
```

4. script place করো
5. settings add করো
6. git setup করো

---

# 🚀 FINAL WORKFLOW

👉 code → save

👉 auto:

✔ commit
✔ message
✔ push

---

# 😎 SUMMARY

👉 manual git দরকার নাই

👉 everything automated

---

# 🔥 COMMAND SUMMARY

```bash
# install AI
ollama pull phi3

# run AI
ollama run phi3

# remove AI
ollama rm phi3

# manual commit run
node C:\auto-git\auto-commit.js

# auto watcher
node C:\auto-git\watcher.js
```

---

# 🎯 FINAL

👉 তুমি এখন use করতেছো:

✔ local AI
✔ auto git system
✔ zero manual workflow

---

**🔥 enjoy fully automated coding**
