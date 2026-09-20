# Fix the Spacefast build and restore the full site

## What happened

Spacefast cloned commit `2926f09` ("Publish design system NES v1.1.0", Sep 12) — an old library-publish snapshot. It predates the icon studio, spec pages, theme switcher, accessibility pass, sign-in, and the entire static-hosting setup. That old code builds a Cloudflare Worker at build time, which Spacefast refuses to convert — hence the failure.

The complete, current state of the project survives in the project's history at commit `6f2c0e5` ("Updated sitemap entries", Sep 20). It contains everything, including the static build config and the sitemap pointing at `https://design.2.MikeDemo.dev`.

## Plan

### 1. Restore the full site
- Extract the complete file tree of commit `6f2c0e5` over the current working tree (restores all routes, the studio, specs, accessibility page, auth, rune icons, static-build script, sitemap, robots, redirects, SPACEFAST.md).
- The publish configuration (`.lovable/`, `src/index.ts` barrel, `.dsignore`) in that commit already matches v1.1.0 plus later fixes, so the library stays publishable.

### 2. Remove the Worker footprint that Spacefast flags
- Delete `wrangler.jsonc` (the Worker entry config). The static build never uses it; the Vite config already only loads the Cloudflare plugin when `LOVABLE_WORKER_BUILD=1` is set, so nothing worker-related ships in a normal build.
- Keep the rest of the build setup as-is: `vite build && node scripts/copy-static-output.mjs` producing `dist/client`.

### 3. Verify
- Run the typecheck, then the full build.
- Confirm `dist/client` contains an `index.html` for every one of the 30 public pages, plus `sitemap.xml` (with the design.2.MikeDemo.dev URLs), `robots.txt`, and `_redirects`.
- Spot-check prerendered pages in a browser.

## What you'll need to do on your side
- Push the restored code to your GitHub repo's `main` branch so Spacefast builds the right commit.
- In Spacefast, if output auto-detection doesn't pick it up, set the output directory to `dist/client` (documented in SPACEFAST.md).
