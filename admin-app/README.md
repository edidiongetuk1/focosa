# FOCOSA Admin Frontend

Static single-file admin dashboard (`index.html`) with full-screen login gate.

## Login
- Endpoint: `POST {api-base}/auth/login`
- Requires user with role `ADMIN`. Non-admin accounts are rejected client-side.
- Default credentials (change in production): `admin@focosa.edu` / `Admin@2024`

## Configuration
Edit the meta tag in `index.html`:
```html
<meta name="api-base" content="https://focosa.onrender.com/api">
```

## Deploy to Vercel
1. Push this folder to a GitHub repo (e.g. `focosa-admin`).
2. https://vercel.com/new → import repo.
3. Framework Preset: **Other**. Build Command: empty. Output Directory: `.`.
4. Deploy. Add custom subdomain like `admin.focosa.edu`.

## CORS requirement
Your backend on Render MUST allow the Vercel domain in its CORS config, e.g.:
```
https://focosa-admin.vercel.app
https://admin.focosa.edu
```
Otherwise login will fail with "Failed to fetch".
