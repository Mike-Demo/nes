# Environment variables

Copy [`../.env.example`](../.env.example) to `.env` and fill in the values from
your own backend project. **No secret keys are required or used** — everything
below is a public, browser-visible identifier protected by row-level security on
the database.

| Variable | Used by | Description |
| -------- | ------- | ----------- |
| `VITE_SUPABASE_URL` | Browser | Base URL of the backend project. Required for sign-in and for saving/loading custom icons. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser | Public publishable API key. Safe to ship in client code; access is enforced by row-level security. |
| `VITE_SUPABASE_PROJECT_ID` | Browser | Backend project reference; used by generated client code. |
| `SUPABASE_URL` | Build / dev server | Same URL, read by server-side code during development and prerender. |
| `SUPABASE_PUBLISHABLE_KEY` | Build / dev server | Same publishable key for the server side. |
| `SUPABASE_PROJECT_ID` | Build / dev server | Same project reference. |

Notes:

- The site builds and renders without any of these. Only the sign-in page and
  the custom-icon features need them; without a backend those degrade to a
  signed-out state.
- Never commit a service-role key or database password. Nothing in this
  repository reads one.
- `VITE_`-prefixed variables are inlined into the client bundle at build time;
  treat them as public by definition.
