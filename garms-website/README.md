# GARMS Official Website
**General Artemio Ricarte Memorial School**
School ID: 107960 | Brgy. Bagumbayan, General Trias City, Cavite | DepEd Region IV-A CALABARZON

---

## 📐 Stack & Services

| Layer    | Technology              | Deployed On  |
|----------|-------------------------|--------------|
| Frontend | React 18 + Vite         | Netlify      |
| Backend  | Node.js + Express       | Render       |
| Database | MySQL (TiDB Cloud)      | TiDB Cloud   |
| Images   | Cloudinary CDN          | Cloudinary   |

---

## 📁 Project Structure

```
garms-website/
├── backend/            ← Express API server
│   ├── config/db.js    ← MySQL/TiDB Cloud connection pool
│   ├── middleware/
│   │   ├── auth.js     ← JWT authentication
│   │   └── upload.js   ← Cloudinary file upload (multer-storage-cloudinary)
│   ├── routes/         ← All API route handlers
│   ├── index.js        ← App entry point
│   ├── package.json
│   └── .env.example    ← Copy to .env and fill in your values
├── frontend/           ← React + Vite web app
│   ├── src/
│   │   ├── components/ ← Header, Footer, Admin layouts
│   │   ├── pages/      ← Public + Admin pages
│   │   ├── utils/      ← API client, helpers
│   │   └── hooks/      ← Custom React hooks
│   ├── public/
│   │   └── _redirects  ← Netlify SPA routing
│   ├── netlify.toml    ← Netlify build configuration
│   ├── vite.config.js
│   └── .env.example
└── database/
    ├── schema.sql      ← Run this first to create all tables
    └── seed.sql        ← Run this second to populate sample data
```

---

## 🔑 Service Setup (Before Deploying)

You need accounts on four services. All free tiers are sufficient to start.

### 1. TiDB Cloud (Database)

1. Sign up at https://tidbcloud.com
2. Create a new **Serverless** cluster (free tier)
3. Once created, click **Connect** → select **General** tab → copy the connection details:
   - Host, Port (4000), Username, Password, Database name
4. In the **Connect** dialog, download or note the **CA certificate** (for SSL)
5. Create the database schema:
   - In TiDB Cloud console → **SQL Editor** → paste and run `database/schema.sql`
   - Then paste and run `database/seed.sql`

### 2. Cloudinary (Image/File Storage)

1. Sign up at https://cloudinary.com (free tier)
2. Go to **Dashboard** → copy:
   - Cloud Name
   - API Key
   - API Secret
3. That's it — the backend will auto-create a `garms-uploads` folder on first upload.

### 3. Render (Backend Hosting)

1. Sign up at https://render.com
2. **New → Web Service** → connect your GitHub repo
3. Set **Root Directory** to `garms-website/backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Set **Node version**: 18 or higher (Environment → NODE_VERSION=18)
7. Add all environment variables (see table below)
8. Deploy — note your Render URL (e.g. `https://garms-api.onrender.com`)

### 4. Netlify (Frontend Hosting)

1. Sign up at https://netlify.com
2. **New site → Import from Git** → connect your GitHub repo
3. Set **Base directory**: `garms-website/frontend`
4. Set **Build command**: `npm run build`
5. Set **Publish directory**: `dist`
6. Add environment variable:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com/api`
7. Deploy — note your Netlify URL (e.g. `https://garms.netlify.app`)
8. Go back to Render → update `FRONTEND_URL` env var to your Netlify URL

---

## ⚙️ Environment Variables

### Backend (Render)

Copy `backend/.env.example` to `backend/.env` for local development. Set these in Render's dashboard for production.

| Variable                | Description                                       | Example                                     |
|-------------------------|---------------------------------------------------|---------------------------------------------|
| `PORT`                  | Port (Render sets this automatically)             | `5000`                                      |
| `DB_HOST`               | TiDB Cloud host                                   | `gateway01.us-east-1.prod.aws.tidbcloud.com`|
| `DB_PORT`               | TiDB Cloud port                                   | `4000`                                      |
| `DB_USER`               | TiDB Cloud username                               | `your_username.root`                        |
| `DB_PASSWORD`           | TiDB Cloud password                               | `your_password`                             |
| `DB_NAME`               | Database name                                     | `garms_db`                                  |
| `DB_SSL`                | Enable SSL for TiDB Cloud                         | `true`                                      |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard                         | `my_cloud`                                  |
| `CLOUDINARY_API_KEY`    | From Cloudinary dashboard                         | `123456789012345`                           |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard                         | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`            |
| `JWT_SECRET`            | Secret for signing JWT tokens (use a long string) | `change_this_to_random_secret_in_prod`      |
| `ADMIN_MAGIC_CODE`      | School ID used as admin login code                | `107960`                                    |
| `FRONTEND_URL`          | Your Netlify URL (for CORS)                       | `https://garms.netlify.app`                 |

### Frontend (Netlify)

Copy `frontend/.env.example` to `frontend/.env` for local development.

| Variable       | Description                          | Example                                    |
|----------------|--------------------------------------|--------------------------------------------|
| `VITE_API_URL` | Your Render backend /api URL         | `https://garms-api.onrender.com/api`       |

---

## 🚀 Local Development Setup

### Requirements
- Node.js v18+ → https://nodejs.org/
- A TiDB Cloud cluster **or** a local MySQL server (XAMPP)

### Step 1 — Clone the repo and set up the database

**Option A — TiDB Cloud (recommended for deployment parity):**
- Paste `database/schema.sql` then `database/seed.sql` into TiDB Cloud SQL Editor

**Option B — Local MySQL / XAMPP:**
```bash
# Start MySQL, then in phpMyAdmin or mysql CLI:
mysql -u root -p < database/schema.sql
mysql -u root -p garms_db < database/seed.sql
```

### Step 2 — Backend

```bash
cd garms-website/backend
cp .env.example .env        # Fill in your DB and Cloudinary credentials
npm install
npm run dev                 # Starts on http://localhost:5000
```

### Step 3 — Frontend

```bash
cd garms-website/frontend
# For local dev, leave .env blank — Vite proxies /api to localhost:5000
npm install
npm run dev                 # Starts on http://localhost:5173
```

### Step 4 — Open the site

| URL                                         | What it opens                          |
|---------------------------------------------|----------------------------------------|
| http://localhost:5173/                       | Public website                         |
| http://localhost:5173/admin/login/107960     | Admin panel (magic link with school ID)|
| http://localhost:5000/api/health             | Backend health check                   |

---

## 📋 Common Commands

```bash
# ── Backend ──────────────────────────────────────────────
cd garms-website/backend
npm install          # Install dependencies
npm run dev          # Start with hot-reload (nodemon)
npm start            # Start for production

# ── Frontend ─────────────────────────────────────────────
cd garms-website/frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview the production build locally
```

---

## 🖼️ After First Deployment — Re-upload Your Images

Because images are now stored on Cloudinary (not local disk), the seed data contains placeholder paths like `/uploads/logo.png` that won't resolve in production.

After deploying, use the **Admin Panel** to re-upload each image:

| Admin Page                  | What to re-upload                     |
|-----------------------------|---------------------------------------|
| Admin → School Info         | School logo, Principal photo          |
| Admin → Banners             | Homepage banner/slider images         |
| Admin → Photos              | School building photos                |
| Admin → Org Chart           | Organizational chart image            |
| Admin → Staff               | Individual staff/faculty photos       |

Login via: `https://your-netlify-url.netlify.app/admin/login/107960`

---

## 🔀 Public Routes

| Route                              | Page                       |
|------------------------------------|----------------------------|
| `/`                                | Home                       |
| `/about`                           | About Us                   |
| `/about/organizational-structure`  | Org Structure              |
| `/about/citizens-charter`          | Citizen's Charter          |
| `/about/committees`                | Committees                 |
| `/admissions`                      | Admissions                 |
| `/ppas`                            | Programs & Activities      |
| `/students-corner`                 | Students' Corner           |
| `/learning-resources`              | Learning Resources         |
| `/issuances`                       | Issuances                  |
| `/faculty-staff`                   | Faculty & Staff Directory  |
| `/school-calendar`                 | School Calendar            |
| `/contact`                         | Contact Us                 |
| `/faq`                             | FAQs                       |

---

## 🛡️ Admin Routes

| Route                              | Admin Page                 |
|------------------------------------|----------------------------|
| `/admin/login/107960`              | Admin Login (magic link)   |
| `/admin`                           | Dashboard                  |
| `/admin/school-info`               | School Information         |
| `/admin/banners`                   | Banner Images              |
| `/admin/content`                   | Page Content Blocks        |
| `/admin/staff`                     | Staff Directory            |
| `/admin/officials`                 | School Officials           |
| `/admin/org-chart`                 | Org Chart                  |
| `/admin/committees`                | Committees                 |
| `/admin/ppas`                      | PPAs                       |
| `/admin/students`                  | Students' Corner           |
| `/admin/resources`                 | Learning Resources         |
| `/admin/issuances`                 | Issuances                  |
| `/admin/internal-forms`            | Internal Forms             |
| `/admin/faqs`                      | FAQs                       |
| `/admin/calendar`                  | School Calendar            |
| `/admin/contact`                   | Contact Messages           |
| `/admin/enrollment`                | Enrollment Info            |
| `/admin/charter`                   | Citizen's Charter          |
| `/admin/photos`                    | School Photos              |
| `/admin/feedback`                  | Feedback Links             |
| `/admin/external-links`            | External Links             |

---

## 🛠️ Troubleshooting

**"CORS error in browser"**
- Make sure `FRONTEND_URL` in Render matches your exact Netlify URL (no trailing slash)
- If you added a custom domain, add it to `FRONTEND_URL` as a comma-separated value

**"Cannot connect to database"**
- Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` are all set correctly in Render
- Make sure `DB_SSL=true` is set for TiDB Cloud
- In TiDB Cloud, check that your cluster is active (not paused)

**"Images not uploading / showing broken"**
- Check that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in Render
- Check Cloudinary dashboard → Media Library → garms-uploads folder for uploaded files

**"Render backend goes to sleep"**
- Free-tier Render services sleep after 15 minutes of inactivity
- Upgrade to Render paid tier, or use a cron service (e.g. cron-job.org) to ping `/api/health` every 14 minutes

**"Admin page shows blank / 404"**
- Confirm the `_redirects` file is in `frontend/public/` and the Netlify build published it
- In Netlify → Site Settings → Deploys, check build logs for errors

**"npm not found"**
- Download Node.js v18+ from https://nodejs.org/ and restart your terminal

---

*Built for General Artemio Ricarte Memorial School — DepEd School ID: 107960*
*General Trias City Division | Region IV-A CALABARZON*
