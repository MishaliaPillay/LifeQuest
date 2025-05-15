# 🌱 Life Quest – Gamified Self-Improvement App

**Life Quest** is a gamified self-improvement platform where users choose between a **Fitness** or **Health** path and grow through AI-powered guidance, progress tracking, and avatar upgrades.

Built with:

- **Frontend**: Next.js, React, TypeScript, Ant Design (Hosted on **Vercel**)
- **Backend**: ABP Framework (ASP.NET Core) (Hosted on **Render**)
- **Database**: Azure SQL

---

## ✨ Features

### 🏋️‍♀️ Fitness Path

-  **AI-Powered Exercise Plans** using OpenRouter’s DeepSeeker
-  **XP & Leveling System** for completing workouts
-  **Step & Weight Tracking**
-  **Motivational Chat** powered by AI

### 🥗 Health Path

-  **AI-Generated Meal Plans**
-  **Meal Scanning** with Gemini for nutrition analysis

### 🧍 Avatar System

-  **Level-Based Progression** — unlock customization from Level 2
-  **Flash AI for Avatar Descriptions**
-  **Imagen for Visual Avatar Generation**

---

##  Project Structure

```
LifeQuest/
├── frontend/ (Next.js + React)
└── backend/ (ABP ASP.NET Core)
```

---

## 🛠 Prerequisites

- [Node.js & npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio 2022+](https://visualstudio.microsoft.com/) with ASP.NET & EF Core
- [Visual Studio Code](https://code.visualstudio.com/)

---

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MishaliaPillay/LifeQuest.git
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 3. Backend Setup

1. Open `backend/LifeQuest.sln` in Visual Studio
2. Set `LifeQuest.Web.Host` as the startup project
3. Open Package Manager Console:

```powershell
Add-Migration InitialCreate
Update-Database
```

4. Press **F5** or click **Run**

---

##  Authentication

- JWT-based auth
- Session storage for secure token handling

---

##  AI & Tools Used

| Feature                  | Tech Used               |
|--------------------------|-------------------------|
| Exercise Plans           | DeepSeeker (OpenRouter) |
| Meal Analysis            | Gemini + Flask          |
| Avatar Description       | Flash AI                |
| Avatar Rendering         | Imagen                  |
| Emotion Support Chat     | DeepSeeker              |

---

##  Notes

- All API routes secured via backend auth
- Avatar upgrades restricted until Level 2
- Fully responsive and styled with a pink/purple aesthetic

---

