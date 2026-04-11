# 🚀 AI-Powered Git Auto Commit & Push System

---

# 🧠 Overview

এই system automatically:

✔ code change detect করে
✔ AI দিয়ে commit message বানায়
✔ auto commit করে
✔ auto push করে

👉 শুধু code লিখো + save = DONE 🔥

---

# 🤖 AI Models (Ollama)

## 🟢 Supported Models

### 🔹 Phi-3 (High Quality)

* 🧠 Best commit messages
* ❌ Requires ~3.5GB+ RAM

```bash
ollama pull phi3
```

---

### 🔹 TinyLlama (Recommended ✅)

* ⚡ Fast & lightweight
* ✅ Works on low-end PC (~1GB RAM)
* 🔥 Best for most users

```bash
ollama pull tinyllama
```

---

### 🔹 Mistral (Advanced)

* 🧠 Better reasoning
* ⚠ Needs 4–6GB RAM

```bash
ollama pull mistral
```

---

### 🔹 LLaMA 3 (High-End)

* 🚀 Very powerful
* ❌ Needs 8GB+ RAM

```bash
ollama pull llama3
```

---

# 🖥️ Which Model Should You Use?

| PC Type         | Recommended Model |
| --------------- | ----------------- |
| 4GB RAM or less | tinyllama ✅       |
| 6–8GB RAM       | phi3              |
| 8GB+ RAM        | mistral / llama3  |

---

# ⚙️ Installation

## 1️⃣ Install Ollama

```bash
irm https://ollama.com/install.ps1 | iex
```

---

## 2️⃣ Install AI Model

```bash
ollama pull tinyllama
```

---

## 3️⃣ Test AI

```bash
ollama run tinyllama
```

Example:

```
write a git commit message for fixing navbar alignment
```

---

## ❌ Remove Model

```bash
ollama rm tinyllama
```

---

# 📁 File Structure

```
C:\auto-git\
  ├── auto-commit.js
  ├── watcher.js
```

---

# ⚡ System Workflow

1. detect changes
2. AI generate message
3. auto commit
4. auto push

---

# ▶️ Run System

## 🔥 Manual

```bash
node C:\auto-git\auto-commit.js
```

---

## 👀 Auto Watch Mode (BEST)

```bash
node C:\auto-git\watcher.js
```

👉 checks every 2 seconds
👉 detects all file changes

---

# 🧩 Required Extension

✔ Run On Save (VS Code)

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

# 📦 Git Setup

## Init Repository

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

# 🔄 Supported Actions

✔ create file
✔ update file
✔ delete file
✔ rename file
✔ copy file
✔ any file type

---

# ✍️ Commit Style

```
add login page layout
fix navbar alignment on mobile
improve search performance logic
```

---

# ⚠️ Important Notes

👉 Save করলে RunOnSave trigger হয়
👉 File copy করলে trigger হয় না

👉 Solution:

```bash
node C:\auto-git\watcher.js
```

---

# 🔥 Best Setup (Recommended)

```bash
ollama pull tinyllama
```

✔ stable
✔ fast
✔ low RAM

---

# 🚀 Advanced (Optional)

Change model in script:

```js
const model = "tinyllama"; // or phi3 / mistral
```

---

# 📤 How Others Can Use

1. Clone or copy project
2. Install Ollama
3. Run:

```bash
ollama pull tinyllama
```

4. Add scripts
5. Setup git

---

# 🚀 Final Workflow

👉 code → save

👉 automatic:

✔ commit
✔ message
✔ push

---

# 😎 Summary

👉 no manual git needed
👉 fully automated
👉 AI powered workflow

---

# 🔥 Command Summary

```bash
# install model
ollama pull tinyllama

# run AI
ollama run tinyllama

# remove model
ollama rm tinyllama

# run commit
node C:\auto-git\auto-commit.js

# run watcher
node C:\auto-git\watcher.js
```

---

# 🎯 Final

👉 You now have:

✔ Local AI
✔ Auto Git system
✔ Zero manual workflow

---

## 🔥 Pro Tip

👉 tinyllama = best for most users
👉 phi3 = only if enough RAM

---

**🔥 Enjoy fully automated coding**
