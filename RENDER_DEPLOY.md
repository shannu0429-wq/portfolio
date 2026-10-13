# Deploying to Render (render.com)

This guide provides the exact steps and deployment links to deploy **Somisetty Shanmukha's Developer Portfolio** on Render as a **Free Web Service**.

---

## ⚡ 1-Click Deploy Link

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shannu0429-wq/portfolio)

Click the link below (replace `portfolio` with your repository name if different):
👉 **[Deploy on Render](https://render.com/deploy?repo=https://github.com/shannu0429-wq/portfolio)**

> **Note:** If you haven't pushed the project to your GitHub account yet, follow **Step 1** below first.

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Push Code to Your GitHub Repository

If you haven't initialized Git or created the repository on GitHub:

1. Open your terminal in `C:\shannu\projects\portfolio`:
   ```bash
   git init
   git add .
   git commit -m "feat: upgrade to cinematic 3D developer portfolio with private admin studio"
   git branch -M main
   ```
2. Create a new repository on your GitHub account ([github.com/new](https://github.com/new)) named **`portfolio`**.
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/shannu0429-wq/portfolio.git
   git push -u origin main
   ```

---

### Step 2: Deploy on Render Dashboard

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** in the top navigation and select **Web Service** (or navigate to [dashboard.render.com/web/new](https://dashboard.render.com/web/new)).
3. Under **Connect a repository**, select your GitHub repository: `shannu0429-wq/portfolio`.
4. Configure the Web Service settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `shanmukha-portfolio` |
| **Region** | `Oregon (US West)` or `Singapore (Southeast Asia)` |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

---

### Step 3: Configure Environment Variables

Scroll down to the **Environment Variables** section and add the following:

| Key | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & static asset serving |
| `HOST` | `0.0.0.0` | Binds server to all network interfaces |
| `PORT` | `10000` | Port listened to by Render's reverse proxy |
| `JWT_SECRET` | *(click Generate or enter a random string)* | Used to sign admin session tokens securely |
| `ADMIN_USERNAME` | `shanmukha_admin` | Secret admin login username |
| `ADMIN_PASSWORD` | `Shanmukha@2026!` | Secret admin password (you can customize this) |

---

### Step 4: Click Deploy & Access Your Live Site

1. Click **Create Web Service**.
2. Render will run `npm install`, compile the Vite production bundle via `npm run build`, and launch the unified server via `npm start`.
3. In ~2 minutes, your live URL will be active:
   👉 **`https://shanmukha-portfolio.onrender.com`**

---

## 🔐 Post-Deployment Admin Studio Access

Once deployed on Render:
1. Visit your live site at `https://shanmukha-portfolio.onrender.com`.
2. Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> (or click the footer lock icon).
3. Log in with your admin credentials:
   * **Username:** `shanmukha_admin`
   * **Password:** Your configured `ADMIN_PASSWORD`
4. You can update your profile photo, project descriptions, skills, and contact settings directly from the cloud dashboard!
