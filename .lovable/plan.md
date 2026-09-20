# Static hosting on Spacefast

## Step 0 result: it can be static, with one change

I inspected every page. All of them render the same HTML for every visitor — sign-in, saving icons, loading the gallery and deleting icons all happen in the browser talking directly to the hosted backend, which keeps working from a static site.

One thing does not: the "generate an icon from a prompt" button in the Icon studio runs on a server at request time. Per your answer, it moves to a hosted backend function that the static site calls.

## What I'll do

### 1. Move the AI icon generator off the site

- Create a backend function `generate-pixel-icon` that does exactly what the current server route does: validates the prompt and grid size, calls the image model, and streams frames back.
- Point the studio's generator at that function instead of `/api/generate-pixel-icon`.
- Delete the old server route so nothing server-side remains in the site build.

### 2. Prerender every public page

Pages baked to HTML: home, Colors, Typography, Iconography, Components, Component specs index, all 57 individual spec pages, Icon studio, Sign in, Lovable Patterns, Accessibility.

The two internal canvas-preview addresses stay out — they are editor-only.

Prerendering is switched on with automatic route discovery off, so the list is explicit. I'll confirm the build actually produced a file for each of the ~68 pages, and if the build finishes writing but then hangs, track down the timer keeping it alive (page-data cache timers, any timer started at load) and fix it so it exits.

### 3. Build output in the right place

Keep the normal build (no static preset — it breaks the build). Add a small, re-runnable script that copies the built site into `dist/client`, and change the build command to run it right after the build.

### 4. Static files

- `public/sitemap.xml` listing every public page.
- `public/robots.txt` allowing crawlers and pointing at the sitemap.
- `public/_redirects` with `/*  /index.html  200` so deep links work.
- Every page already sets its own title and description, so nothing has to move; I'll re-check each one and fill any gap.

### 5. Build spec

`SPACEFAST.md` with the install command, the build command, and that the published folder is `dist/client` (raw output `.output/public`).

### 6. Verification before I call it done

Typecheck, full build, check `dist/client` has a page file for every route plus sitemap, robots and redirects, then open the built pages in a browser and confirm they render and that address-bar state (filters, tabs) still restores after load. I'll report anything that only works in the Lovable preview and not in the built site.

## Technical notes

- `tanstackStart()` in `vite.config.ts` gets `pages: [...]` and `prerender: { enabled: true, autoStaticPathsDiscovery: false }`. The project does not currently use `@lovable.dev/vite-tanstack-config`; if the plugin's own prerender pass writes nothing, I'll adopt that wrapper at 2.20.0+ rather than leave a silently empty prerender.
- Spec paths come from `SPEC_NAMES` in `src/showcase/specs.tsx`; I'll generate the 57 `pages` entries and the sitemap entries from that same list so they can't drift.
- Post-build script: `scripts/copy-static-output.mjs`, idempotent, cleans `dist/client`, no-ops if output is already there. Build command becomes `vite build && node scripts/copy-static-output.mjs`.
- The generator function is called with the project's backend key from the browser; the AI key stays server-side inside the function. Streaming SSE parsing in `src/showcase/studio/generate.ts` is unchanged apart from the URL.
- I won't touch GitHub, DNS or publishing.
