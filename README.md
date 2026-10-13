# Somisetty Shanmukha — Developer Portfolio & Private Admin Studio

A modern, high-performance personal portfolio website built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, powered by a secure **Node.js/Express** backend with a persistent, authenticated **Private Admin Studio**.

Designed with a **Cinematic 3D** aesthetic featuring midnight-blue/black backgrounds, electric cyan and violet accents, interactive 3D tilt cards, canvas particles, and glassmorphism.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shannu0429-wq/portfolio)

👉 **1-Click Render Deploy Link:** [Deploy to Render](https://render.com/deploy?repo=https://github.com/shannu0429-wq/portfolio) • [Full Guide in RENDER_DEPLOY.md](RENDER_DEPLOY.md)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Install Dependencies
```bash
cd C:\shannu\projects\portfolio
npm install
```

### 3. Start Development Mode
You can run both the Express backend and the Vite dev server with proxying:
```bash
# Terminal 1: Start the backend API server (runs on http://localhost:5000)
npm run dev:server

# Terminal 2: Start the frontend Vite server (runs on http://localhost:3000)
npm run dev
```

Visit the website at:
👉 **`http://localhost:3000`**

### 4. Production Build & Unified Server
To run the production full-stack server (serves both API & built frontend from port 5000):
```bash
# Build the production bundle
npm run build

# Start the unified production server
npm start
```
Visit the production app at:
👉 **`http://localhost:5000`**

---

## 🔐 Private Portfolio Admin Studio

A secure, private editing dashboard is built directly into the application, allowing you to update your portfolio at any time without touching source code or rebuilding.

### 1. How to Access Admin Mode
The admin entry point is strictly discreet and **not visible** in the main visitor navigation:
1. **Keyboard Shortcut:** Press **`Ctrl + Shift + A`** (or `Cmd + Shift + A` on Mac) anywhere on the website.
2. **Discreet Footer Lock:** Scroll to the footer and click the subtle lock icon next to the copyright text, or double-click the **SS** monogram.

### 2. Default Initial Credentials
* **Username:** `shanmukha_admin`
* **Default Password:** `Shanmukha@2026!`

*(You can change your password at any time inside the Admin Studio under the "Security & Auth" tab, or by updating `.env`.)*

### 3. Security Highlights
* **Zero Client-Side Passwords:** Admin credentials and password hashes are never included in frontend JavaScript bundles or public variables.
* **Bcrypt Password Hashing:** Server-side password verification using 12-round salt hashing.
* **Signed JWT Authentication:** Sessions are verified with cryptographically signed tokens (`HttpOnly` cookie or Bearer token header).
* **Rate Limiting:** Protects `/api/auth/login` against brute-force attacks (5 failed attempts per 15 minutes).
* **Server-Side Validation:** All project edits, skill updates, and file uploads are strictly verified by backend middleware before saving.

---

## 🛠️ Admin Studio Capabilities

Inside the Admin Studio, you can manage:

| Tab | Capabilities |
|---|---|
| **Profile & Bio** | Update your display name, professional title, headline, internship career goal, hero intro, and About Me overview. |
| **Skills & Stack** | Add or remove skills, toggle primary star tags (e.g. Python, Flask), and update your "Currently Learning" list. |
| **Project Management** | Add new projects, edit titles, descriptions, tech stacks, GitHub URLs, and live demos. Reorder projects up/down, and delete projects with confirmation dialogs. |
| **Certifications** | Add verified credentials (title, issuer, issue date, credential URL) as you earn them. |
| **Links & Media** | Upload new profile photographs (up to 5MB, `.jpg`, `.png`, `.webp`) and résumé PDFs (`.pdf`). Update GitHub, LinkedIn, and email URLs. |
| **Security & Auth** | Change your admin password with instant bcrypt updating. |
| **Live Preview Mode** | Toggle between "Live Draft Preview" and public view to review your changes before clicking **Publish Live**. |

---

## 💾 Data Persistence & Storage Architecture

1. **Persistent Data File:**
   All portfolio data is saved persistently inside:
   ```
   server/data/portfolio.json
   ```
2. **Crash & Power-Failure Protection:**
   Updates use atomic writes (writes to a temporary file, creates a `portfolio.backup.json` copy, and renames) ensuring zero file corruption.
3. **Resilient Fallback:**
   If the backend is ever offline or in static preview, the frontend automatically falls back to baseline defaults in `src/data/*`.

---

## ☁️ Deployment Guide

### Option A: Persistent Full-Stack Hosting (Recommended)
Platforms like **Render**, **Railway**, **Fly.io**, **DigitalOcean App Platform**, or a VPS run both the frontend and Express backend together:
1. Connect your GitHub repository.
2. Set Build Command:
   ```bash
   npm install && npm run build
   ```
3. Set Start Command:
   ```bash
   npm start
   ```
4. Add Environment Variables in the hosting dashboard:
   * `ADMIN_USERNAME=shanmukha_admin`
   * `ADMIN_PASSWORD_HASH=<your_bcrypt_hash>`
   * `JWT_SECRET=<your_random_secret_string>`
   * `NODE_ENV=production`
5. *(Optional)* Attach a persistent disk mount to `/server/data` so updates persist across container rebuilds.

### Option B: Serverless Static Hosting (Vercel / Netlify)
If deploying the frontend as a purely static site on Vercel or Netlify:
* Because Vercel serverless disks are read-only and ephemeral, connect the backend API to a free cloud database like **Supabase (PostgreSQL)** or **MongoDB Atlas**.
* The API route handlers in `server/index.ts` can be deployed as serverless functions (e.g. `/api/*`), routing queries directly to your cloud database.

---

## 📁 Project Structure

```
portfolio/
├── server/
│   ├── index.ts           # Express backend API & static server
│   ├── auth.ts            # Bcrypt, JWT & rate limiting security
│   ├── store.ts           # Atomic persistent JSON storage manager
│   ├── types.ts           # Shared data models and interfaces
│   └── data/
│       ├── portfolio.json # Persistent production state
│       └── portfolio.backup.json
├── public/
│   ├── images/
│   │   └── profile.jpg    # Profile photograph
│   └── resume.pdf         # Résumé download file
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLoginModal.tsx # Secure admin login modal
│   │   │   └── AdminDashboard.tsx  # Studio for managing all content
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Education.tsx
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── context/
│   │   └── PortfolioContext.tsx    # Live state & admin draft provider
│   ├── data/                       # Baseline default configuration
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                   # Local credentials (gitignored)
├── .env.example           # Example environment template
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 👤 Author & Contact

* **Name:** Somisetty Shanmukha
* **Title:** Python Developer | AI Enthusiast | Problem Solver
* **College:** Vasireddy Venkatadri Institute of Technology (VVIT)
* **GitHub:** [shannu0429-wq](https://github.com/shannu0429-wq)
* **LinkedIn:** [s-shanmukha](https://www.linkedin.com/in/s-shanmukha-88397432a/)
* **Email:** [shannu0429@gmail.com](mailto:shannu0429@gmail.com)
