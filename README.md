# SkinWise Admin

Standalone web dashboard for the SkinWise mobile app. It talks to the same
SkinWise backend server and database, but uses its own admin-only API
endpoints under `/api/admin/*` with a separate admin session.

## Requirements

- Node.js 20+ and npm
- A running SkinWise backend (separate repository) with the admin API enabled

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set the backend base URL:

   ```sh
   VITE_API_BASE_URL="http://localhost:8000"
   ```

   Never put secrets, API keys, or database credentials in frontend code.
   `VITE_API_BASE_URL` is the only frontend environment variable.

## Scripts

```sh
npm run dev      # start the Vite dev server
npm run build    # typecheck and build for production
npm run preview  # preview the production build
npm run lint     # run eslint
```

## Notes

- Sidebar order is Dashboard, Users, Ingredients. Premium management lives
  inside Users, not on a separate page.
- Palette: background `#FAF5F4`, text `#1E0C08`, accent `#BA867B`,
  soft surface `#F5ECE9`.
- Admin auth is enforced by the backend (`/api/admin/*`). The UI only
  displays what the backend allows.

## Backend pairing

Pair this site with the backend branch `feature/admin-auth` (for now),
which serves the admin API under `/api/admin/*` on `http://localhost:8000`
in local development.

## Environment table

| Variable           | Local development        | Deployed site                          |
| ------------------ | ------------------------ | -------------------------------------- |
| `VITE_API_BASE_URL` | `"http://localhost:8000"` | The public backend base URL, no trailing slash (for example `"https://api.example.com"`) |

## Hosting note

The site uses its own path routing (`/dashboard`, `/users`, `/ingredients`,
`/login`). The host must serve `index.html` for every path: a refresh on
`/users` or `/ingredients` must not return a 404. Configure this as a
rewrite (all paths) or fallback rule on your host, in general terms —
no host-specific setup lives in this repo.

## Security notes

- The admin session is an `httpOnly` cookie set by the backend. The
  frontend never sees the token and keeps nothing sensitive in the browser
  (no tokens, passwords, or session proofs in storage).
- The old demo credential from early development no longer exists in the
  code. Sign-in always calls the backend.
- `VITE_API_BASE_URL` is the only frontend environment variable. Never put
  secrets, API keys, or database credentials in frontend code.

## Backend admin doc

For the admin API, rate limits, and first-admin setup, see the backend
repository's admin documentation (`docs/ADMIN.md` in `SkinWiseB-END`).
