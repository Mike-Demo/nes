# Repository hand-off documentation

Goal: make this repo fully understandable, buildable and maintainable outside Lovable. Documentation only — no application code is changed.

## What I found (audit)

- React 19 + TanStack Start/Router (file-based routes in `src/routes/`), Vite 8, package manager Bun.
- Styling: plain CSS — a vendored NES.css stylesheet plus showcase CSS and CSS custom-property tokens with two palettes (retro / fresh).
- Backend: the hosted Lovable Cloud backend (Supabase) is used from the browser only — email sign-in and saving/loading/deleting custom pixel icons. All public pages render the same HTML for everyone.
- One non-static feature: AI icon generation uses a request-time server route, so on the static host it shows a plain "not available" message.
- Build: `bun run build` = `vite build && node scripts/copy-static-output.mjs`; 30 public pages are prerendered; published folder is `dist/client`. Env vars are the Supabase URL / publishable key / project id (public values).
- No `docs/` folder, no `.env.example`, no `check` script (typecheck is `bunx tsgo --noEmit`).

## Step 1 — Rewrite `README.md`

Replace the stub with: project overview and live URL (`https://design.2.MikeDemo.dev`), key features (design-system components, icon gallery, pixel icon studio, theme switcher, component spec pages, accessibility page), attribution (NES.css MIT — `LICENSE-nes-css`; Rune Icons Apache 2.0 — `LICENSE-runeicons`; Press Start 2P font), tech stack, local development (Bun + Node 22, install, `.env`, `bun run dev`), build & deployment summary, and a documentation index linking to the new guides.

## Step 2 — Create `docs/`

- `docs/architecture.md` — folder-by-folder layout (`src/components`, `src/lib`, `src/styles`, `src/showcase`, `src/routes`, `src/integrations`, `scripts`, `.lovable`), the library-vs-showcase split and `.dsignore`, theme store and pre-paint theme script, URL/query-param conventions on the icon gallery and sign-in return path, client vs server boundaries (everything client-side except the one AI route), and a gotchas section: prerender page list must stay in sync with `src/showcase/spec-names.ts`, no Cloudflare Worker entry allowed for the static host, hydration-safe theme handling, accessibility text-colour tokens.
- `docs/deployment.md` — static hosting flow, install/build commands, `dist/client` output, `_redirects` fallback, `sitemap.xml` / `robots.txt`, domain and DNS notes, and how to add a new public page.
- `docs/environment.md` plus `.env.example` — each variable named and described, no real secret values (only public publishable identifiers, described as such).

## Step 3 — Rewrite `roadmap.md`

Consolidate the archived plans in `.lovable/plan/` into one clean list: completed milestones checked off (design system port, rune icons, theme switcher, spec pages, icon studio + Cloud, accessibility pass, static hosting, Cloudflare removal, domain update) and genuine open items (AI generation on the static host, sitemap upkeep when pages change).

## Step 4 — Verify

- Every markdown link in `README.md` and `docs/` resolves to a committed file.
- Grep the docs for secret-shaped strings; confirm only public values appear.
- Run `bunx tsgo --noEmit` to confirm tooling is still clean.

## Notes

- `SPACEFAST.md` stays as the host-specific build spec; `docs/deployment.md` links to it rather than duplicating it.
- `.lovable/plan/` archives are left in place as history.
