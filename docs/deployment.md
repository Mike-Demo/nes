# Deployment

The public site is **plain static files**. There is no server, no Worker and no
serverless runtime in production.

## Commands

| Step    | Command |
| ------- | ------- |
| Install | `bun install` (or `npm install`) |
| Build   | `bun run build` → `vite build && node scripts/copy-static-output.mjs` |
| Output  | `dist/client` |

`vite build` prerenders every listed public route to `<route>/index.html`.
`scripts/copy-static-output.mjs` then copies the prerender output into
`dist/client`, cleaning it first, and no-ops when the build already wrote there.
It is safe to run repeatedly.

Configure the host with: install `bun install`, build `bun run build`, publish
directory `dist/client`. See [`../SPACEFAST.md`](../SPACEFAST.md) for the
host-specific spec.

## Prerendered pages

30 pages: 10 top-level pages (`/`, `/accessibility`, `/auth`, `/colors`,
`/components`, `/icons`, `/lovable`, `/specs`, `/studio`, `/typography`) plus 20
component spec pages under `/specs/<ComponentName>`.

The list lives in `src/showcase/spec-names.ts` (`STATIC_PAGE_PATHS`) and is
passed to `tanstackStart({ pages, prerender: { enabled: true,
autoStaticPathsDiscovery: false } })` in `vite.config.ts`. Automatic discovery is
off, so the list is authoritative.

### Adding a public page

1. Create the route file under `src/routes/` with its own `head()` metadata.
2. Add the path to `STATIC_PAGE_PATHS` in `src/showcase/spec-names.ts`.
3. Add a `<loc>` entry to `public/sitemap.xml`.
4. Rebuild and confirm `dist/client/<route>/index.html` exists.

## Rewrite & crawler files

- `public/_redirects` — `/*  /index.html  200`, so deep links and client-side
  navigation targets resolve on hosts that would otherwise 404.
- `public/robots.txt` — allows all crawlers, points at `/sitemap.xml`.
- `public/sitemap.xml` — all 30 public routes, base URL
  `https://design.2.MikeDemo.dev`. Update the base URL here if the domain
  changes.

## Domain & DNS

Production domain: **design.2.MikeDemo.dev**. Point it at the static host
according to the host's instructions — typically a `CNAME` for the subdomain to
the host's target, then enable TLS there. Nothing in the codebase needs to
change for a domain move except the base URL in `public/sitemap.xml`.

## Known limitation

AI icon generation in the studio (`src/routes/api/generate-pixel-icon.ts`) needs
a request-time server. On the static site the button shows a plain "runs on a
server" message; drawing, saving, loading, deleting and exporting icons all work
normally because they talk to the hosted backend directly from the browser.
