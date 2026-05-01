# FOCOSA Public Frontend

Static single-file site (`index.html`).

## Configuration
The backend URL is set in `index.html` via:
```html
<meta name="api-base" content="https://focosa.onrender.com/api">
```
Edit this if your backend URL changes.

## Deploy to Vercel
1. Push this folder to a GitHub repo (e.g. `focosa-public`).
2. Go to https://vercel.com/new → import the repo.
3. Framework Preset: **Other**. Root Directory: `.`. Build Command: leave empty. Output Directory: `.`.
4. Click **Deploy**. Vercel serves `index.html` at the root.
5. (Optional) Add custom domain (e.g. `focosa.edu`) in Project → Settings → Domains.

## Local preview
```bash
npx serve .
```
