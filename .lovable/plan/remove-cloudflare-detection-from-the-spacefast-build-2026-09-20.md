# Remove Cloudflare detection from the Spacefast build

## Confirmed cause

Spacefast checked out commit `4bb2e0e` (`Update plan`). In that exact snapshot, `vite.config.ts` enables the Cloudflare plugin for every production build and `package.json` includes the plugin. Spacefast therefore classifies the project as a Cloudflare Worker site and refuses conversion before the static build command runs.

The current `main` is newer (`e38572a`) and only enables Cloudflare behind an environment variable, but the package and import remain detectable. Since this project is intentionally destined for static Spacefast hosting, keeping an optional Worker build adds risk without helping the requested deployment.

## Changes

1. Remove the Cloudflare plugin import, conditional plugin setup, and Worker-build environment switch from `vite.config.ts`. Keep the explicit 30-page prerender configuration unchanged.
2. Remove `@cloudflare/vite-plugin` from the development dependencies and refresh the lockfile, eliminating its bundled Wrangler/Worker metadata from the repository install graph.
3. Update `SPACEFAST.md` to state that this project produces static output only; remove the obsolete instructions for opting back into a Worker build.
4. Search tracked configuration for any remaining Cloudflare entrypoint or Wrangler declaration that Spacefast could detect. Do not change GitHub, DNS, Spacefast login, or publishing settings.

## Verification

- Run the strict TypeScript check.
- Run the exact Spacefast build command: `vite build && node scripts/copy-static-output.mjs`.
- Confirm all 30 route HTML files and `sitemap.xml`, `robots.txt`, and `_redirects` exist in `dist/client`.
- Confirm the dependency tree and tracked build configuration contain no Cloudflare Worker plugin or entrypoint.
- Browser-check representative built pages and URL-state hydration from the static output.

## Deployment note

The next Spacefast run must resolve a commit containing these changes. The failed run resolved the older `4bb2e0e` snapshot, while the repository currently reports newer `main` content. Repository synchronization and starting the next Spacefast build remain with you, as requested.
