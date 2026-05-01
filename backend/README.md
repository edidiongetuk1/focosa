# Backend CORS Patch (Express)

The frontend cannot reach `https://focosa.onrender.com/api` from a browser
because the backend does NOT send any `Access-Control-Allow-*` headers and
returns 404 on `OPTIONS` preflight. Browsers therefore block every request
with "Failed to fetch", even though the request itself succeeds when sent
without an Origin header (e.g. from curl).

## Fix — install the cors package and register it before all routes

```bash
npm install cors
```

In your main server file (e.g. `src/server.ts` / `src/index.ts` / `app.js`),
add this BEFORE any `app.use('/api', ...)` route registration:

```js
const cors = require('cors');                    // or: import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  /\.lovable\.app$/,
  /\.lovableproject\.com$/,
  // add your production admin/public domains:
  // 'https://admin.focosa.edu',
  // 'https://focosa.edu',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl / server-to-server
    const ok = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// Explicit preflight handler (Express 5 / path-to-regexp safe)
app.options(/.*/, cors());
```

Redeploy on Render. After deploy, verify with:

```bash
curl -i -X OPTIONS https://focosa.onrender.com/api/auth/login \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST"
```

You should see `access-control-allow-origin: https://example.com` and a
`204` (or `200`) status — not 404.
