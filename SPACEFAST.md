# Spacefast build spec

Static hosting spec for this project. Editing and previewing stay in Lovable;
the public site is served from the built static output.

## Commands

| Step    | Command                                             |
| ------- | --------------------------------------------------- |
| Install | `bun install` (or `npm install`)                     |
| Build   | `vite build && node scripts/copy-static-output.mjs`  |

`bun run build` runs exactly that command.

## Output

- Static output directory: **`dist/client`**
- Raw prerender output: `.output/public` when the toolchain writes there. The
  post-build script copies it into `dist/client` and no-ops when the build
  already wrote `dist/client` directly (the current case).

Every public route is prerendered to its own `<route>/index.html`
(30 pages: the 10 top-level pages plus 20 component spec pages). The page list
lives in `src/showcase/spec-names.ts` (`STATIC_PAGE_PATHS`) and is fed to
`tanstackStart({ pages, prerender: { enabled: true, autoStaticPathsDiscovery: false } })`
in `vite.config.ts`. Add a public route there and to `public/sitemap.xml`.

## Static files

- `public/_redirects` — `/*  /index.html  200` so deep links work.
- `public/robots.txt` — points at `/sitemap.xml`.
- `public/sitemap.xml` — lists all 30 public routes. The base URL is already
  set to `https://design.2.MikeDemo.dev`.

## Notes

- The project produces static output only and does not include a Worker
  entrypoint or runtime.
- Everything on the site is client-side: sign-in, saving, loading and deleting
  custom icons talk to the hosted backend directly from the browser.
- One exception: **AI icon generation** in the Icon studio needs a server route
  (`/api/generate-pixel-icon`) that a static host cannot run. On Spacefast the
  button shows a clear message and the rest of the studio (drawing, saving,
  loading, exporting) works normally. It still works in the Lovable preview.
