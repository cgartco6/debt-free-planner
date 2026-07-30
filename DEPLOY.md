# 🚀 Deployment Guide

Four platforms covered. Pick one. Each section is fully self-contained.

---

## Quick decision guide

| Platform | Best for | Cost | Custom domain | Auto-deploy |
|---|---|---|---|---|
| **Vercel** | Fastest setup, great DX | Free | ✅ | ✅ |
| **Netlify** | Free tier + form handling | Free | ✅ | ✅ |
| **Render** | If you already use Render | Free | ✅ | ✅ |
| **Streamlit** | Python/data science audience | Free | ❌ (paid) | ✅ |
| **GitHub Pages** | Zero config if on GitHub | Free | ✅ | ✅ via Actions |

---

## Prerequisites (all platforms)

```bash
# 1. Make sure Python 3.8+ is installed
python3 --version

# 2. Build the standalone dist/index.html (required for all platforms)
python scripts/bundle.py --no-chartjs
# Output: dist/index.html (~164 KB, fully self-contained)

# 3. Verify it works locally
python -m http.server 3000 --directory dist/
# → Open http://localhost:3000
```

---

## Platform 1 — Vercel  ⚡ (Recommended — 2 minutes)

Vercel auto-runs `scripts/bundle.py` on every push. Zero config once wired.

### Install CLI
```bash
npm install -g vercel
```

### First deploy
```bash
cd debt-free-planner

# Login (opens browser)
vercel login

# Deploy (Vercel reads vercel.json automatically)
vercel

# Output:
# ✅ Deployed to https://debt-free-planner-xyz.vercel.app
```

### Production deploy (custom domain + optimised)
```bash
vercel --prod
# → https://debt-free-planner.vercel.app (or your custom domain)
```

### Auto-deploy from Git
```bash
# Link repo to Vercel (one-time)
vercel link

# After this, every git push to main auto-deploys.
# Pull requests get preview URLs automatically.
git add . && git commit -m "update plan" && git push
```

### Set custom domain
```bash
vercel domains add yourdomain.com
# Then add the CNAME/A records Vercel shows you to your DNS provider
```

### Environment check
`vercel.json` in the repo root is all Vercel needs. Build command is:
```
python scripts/bundle.py --no-chartjs
```
Output dir: `dist`

---

## Platform 2 — Netlify  🟢

### Option A: Drag & drop (30 seconds, no account needed for preview)

```bash
# Build first
python scripts/bundle.py --no-chartjs

# Then go to: https://app.netlify.com/drop
# Drag the dist/ folder onto the page.
# You get a live URL immediately. No account needed.
```

### Option B: CLI deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# One-time site setup
netlify init
# Choose: "Create & configure a new site"
# Build command: python scripts/bundle.py --no-chartjs
# Publish directory: dist

# Deploy preview (doesn't affect production)
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Option C: Git-connected (recommended for ongoing work)

```bash
# 1. Push repo to GitHub/GitLab
git remote add origin https://github.com/yourname/debt-free-planner.git
git push -u origin main

# 2. Go to https://app.netlify.com → "Add new site" → "Import from Git"
# 3. Connect GitHub, select your repo
# 4. Netlify reads netlify.toml automatically:
#    Build command: python scripts/bundle.py --no-chartjs
#    Publish dir:   dist
# 5. Click Deploy

# Every push to main after this auto-deploys.
```

### Custom domain (Netlify)
```bash
netlify domains:create yourdomain.com
# Follow the DNS instructions Netlify provides
```

---

## Platform 3 — Render  🟣

### Via Dashboard (easiest)

```
1. Go to https://dashboard.render.com/
2. Click "New +" → "Static Site"
3. Connect your GitHub repo
4. Settings:
     Name:          debt-free-planner
     Build Command: python scripts/bundle.py --no-chartjs
     Publish Dir:   dist
5. Click "Create Static Site"

Render reads render.yaml from the repo for all settings.
Auto-deploys on every push to main.
```

### Via CLI (render-cli)

```bash
# Install Render CLI
npm install -g @render-oss/render-cli

# Authenticate
render login

# Deploy (reads render.yaml)
render deploy

# List your services
render services list
```

### Manual trigger (if auto-deploy is disabled)

```bash
# Trigger a deploy via Render API
curl -X POST "https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Get your `SERVICE_ID` from Render dashboard URL: `dashboard.render.com/static/srv-XXXXXX`

---

## Platform 4 — Streamlit Community Cloud  🔴

The app is served as a full-screen iframe inside Streamlit. Data persists
within the session; use Export JSON (Settings tab) to save plans across sessions.

### Setup

```bash
# Install Streamlit locally
pip install streamlit

# Build the bundle first
python scripts/bundle.py --no-chartjs

# Run locally
streamlit run streamlit_app.py
# → Opens http://localhost:8501
```

### Deploy to Streamlit Community Cloud (free)

```bash
# 1. Commit EVERYTHING including dist/ to GitHub
git add dist/ streamlit_app.py requirements.txt scripts/
git commit -m "add streamlit deployment"
git push

# 2. Go to https://share.streamlit.io
# 3. Sign in with GitHub
# 4. Click "New app"
#    Repository:  yourname/debt-free-planner
#    Branch:      main
#    Main file:   streamlit_app.py
# 5. Click "Deploy!"

# URL format: https://yourname-debt-free-planner-streamlit-app-XXXXX.streamlit.app
```

### Important: commit dist/ to the repo

Unlike Vercel/Netlify/Render, Streamlit Cloud does NOT run build commands.
You must commit `dist/index.html` to your repo.

```bash
# After running bundle.py, always commit dist/
python scripts/bundle.py --no-chartjs
git add dist/index.html
git commit -m "rebuild bundle"
git push
```

### Automate this with a pre-push hook

```bash
# .git/hooks/pre-push (create this file, chmod +x)
cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh
echo "🔧 Rebuilding bundle before push..."
python scripts/bundle.py --no-chartjs
git add dist/index.html
git commit --amend --no-edit --allow-empty
EOF
chmod +x .git/hooks/pre-push
```

---

## Platform 5 — GitHub Pages  (bonus)

The GitHub Actions workflow at `.github/workflows/deploy.yml` handles this automatically.

### Enable GitHub Pages

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to repo → Settings → Pages
# 3. Source: "GitHub Actions"
# 4. The workflow runs automatically, builds dist/, deploys it

# URL: https://yourname.github.io/debt-free-planner/
```

### Manual trigger

```bash
# Via GitHub CLI
gh workflow run deploy.yml

# Or via web: repo → Actions → "Build & Deploy" → "Run workflow"
```

---

## Local development

```bash
# Serve the source files (ES modules — needs a server, not file://)
npm install && npm start
# → http://localhost:3000 (live source, no bundle step needed)

# OR serve the built bundle
python scripts/bundle.py --no-chartjs
python -m http.server 3000 --directory dist/
# → http://localhost:3000 (bundled single-file version)
```

---

## Rebuilding after code changes

Whenever you edit any `src/` or `styles/` file:

```bash
# Rebuild bundle
python scripts/bundle.py --no-chartjs

# Test it
python -m http.server 3000 --directory dist/

# Commit and push (triggers auto-deploy on Vercel/Netlify/Render)
git add . && git commit -m "update" && git push
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `python: command not found` | Use `python3 scripts/bundle.py` |
| `dist/index.html` not updating | Delete `dist/` and re-run bundle script |
| Charts not showing on Streamlit | Chart.js loads from CDN — check internet connection |
| `localStorage` errors on Streamlit | Expected in iframe — use Export/Import JSON for persistence |
| Vercel build fails | Check Python version: Vercel uses Python 3.9 by default |
| Netlify `exit code 1` | Check build log — usually a Python path issue |
| Render "no matching service" | Make sure `render.yaml` is in root, not a subfolder |
| White screen after deploy | Check browser console — likely a path issue in HTML |

---

## Custom domain checklist (all platforms)

```
□ Buy domain from Namecheap / Cloudflare / Google Domains
□ Add domain in platform dashboard
□ Platform gives you: A record IP or CNAME target
□ Update DNS at your registrar (TTL: allow 24-48hrs to propagate)
□ Platform issues free SSL automatically (Let's Encrypt)
□ Test: https://yourdomain.com
```
