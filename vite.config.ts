import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";
import { STATIC_PAGE_PATHS } from "./src/showcase/spec-names";

export default defineConfig(({ command, mode }) => {
  // The public site is served as static files, so the default build prerenders
  // every page and needs no Workers runtime. Set LOVABLE_WORKER_BUILD=1 to get
  // the Cloudflare Workers output back (the prerender pass can't run with it:
  // the worker entry replaces the server entry the prerender server loads).
  const useCloudflare = command === "build" && process.env["LOVABLE_WORKER_BUILD"] === "1";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      mockupPreviewPlugin(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
      // Every public page is prerendered to a static HTML file so the site can
      // be served from a static host. Discovery is off: `pages` is the whole list.
      tanstackStart({
        pages: STATIC_PAGE_PATHS.map((path) => ({ path })),
        prerender: { enabled: true, autoStaticPathsDiscovery: false },
      }),
      viteReact(),
      ...(mode === "development" ? [componentTagger()] : []),
    ],
  };
});
