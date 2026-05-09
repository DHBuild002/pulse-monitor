# Pulse — Global Intelligence Dashboard

A clean, dark-mode intelligence dashboard tracking geopolitics, technology, public health, and science & space. Built as a static site — no server required.

---

## File structure

```
pulse/
├── index.html       ← Main dashboard
├── live.html        ← Live video feeds page
├── css/
│   └── style.css    ← All styles
├── js/
│   └── app.js       ← Data, map, rendering, reader logic
├── netlify.toml     ← Netlify config
└── README.md
```

---

## Deploying to Netlify (manual)

1. Go to [netlify.com](https://netlify.com) and sign in
2. From your dashboard, drag and drop the entire `pulse/` folder onto the deploy area
3. Netlify will assign a URL (e.g. `https://sparkly-fox-123.netlify.app`)
4. To set a custom domain: Site settings → Domain management → Add custom domain

---

## Setting up GitHub + Netlify (continuous deployment)

This lets Claude or anyone push code changes to GitHub, and Netlify automatically redeploys within seconds.

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `pulse-dashboard` (or anything you prefer)
3. Set it to **Private** if desired
4. Click **Create repository**

### Step 2 — Push the project files

Open a terminal in the `pulse/` folder and run:

```bash
git init
git add .
git commit -m "Initial Pulse dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pulse-dashboard.git
git push -u origin main
```

### Step 3 — Connect Netlify to GitHub

1. In Netlify, go to **Add new site → Import an existing project**
2. Choose **GitHub** and authorise Netlify
3. Select your `pulse-dashboard` repository
4. Build settings:
   - **Base directory**: *(leave blank)*
   - **Build command**: *(leave blank — it's a static site)*
   - **Publish directory**: `.` (just a dot)
5. Click **Deploy site**

From this point, every `git push` to the `main` branch triggers an automatic redeploy.

---

## Giving Claude push access (GitHub MCP)

To allow Claude to push code changes directly to your repository via the Claude GitHub connector:

1. In GitHub, go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token**
3. Set the token name to `Pulse Claude Access`
4. Under **Repository access**, select your `pulse-dashboard` repo
5. Under **Permissions**, enable:
   - **Contents**: Read and write
   - **Metadata**: Read-only
6. Copy the generated token (you only see it once)
7. In Claude.ai, go to **Settings → Integrations** and connect the GitHub connector
8. Paste the token when prompted

Once connected, you can ask Claude to "push an update to the Pulse dashboard" and Claude can commit and push changes to your repository directly — which Netlify will then automatically deploy.

---

## Customising stories and data

All stories, social posts, markets, regions, and alerts live in `js/app.js` at the top of the file as plain JavaScript arrays. Edit them directly, or in future phases Claude can connect to live APIs to populate them automatically.

---

## Planned next phases

- [ ] Live API integration (NewsAPI, RSS, commodity feeds)
- [ ] AI-powered story summarisation via Anthropic API
- [ ] Persisted user preferences (localStorage)
- [ ] Notification / alert system
- [ ] Full live video embeds page
