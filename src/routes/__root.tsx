import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import nesCss from "../styles/nes.css?url";

const initialRevealStyles = `
  html.app-cloak body {
    opacity: 0;
    visibility: hidden;
  }

  html.app-ready body {
    opacity: 1;
    visibility: visible;
  }

  @media (prefers-reduced-motion: no-preference) {
    html.app-ready body {
      transition: opacity 160ms ease-out;
    }
  }
`;

const initialRevealScript = `
  (() => {
    const root = document.documentElement;
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      root.classList.remove("app-cloak");
      root.classList.add("app-ready");
    };

    const timeout = window.setTimeout(show, 2000);
    const done = () => {
      window.clearTimeout(timeout);
      window.requestAnimationFrame(show);
    };

    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done, { once: true });
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(done, done);
    }
  })();
`;

// Applies the persisted NES theme before first paint so the showcase never
// flashes the wrong palette. The key mirrors src/lib/theme.ts.
const themeBootScript = `
  (() => {
    try {
      const theme = window.localStorage.getItem("nes-theme");
      if (theme === "fresh" || theme === "retro") {
        document.documentElement.setAttribute("data-nes-theme", theme);
      }
    } catch {}
  })();
`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NES.css Design System" },
      { name: "description", content: "Retro 8-bit design system built on NES.css — pixel-perfect React components." },
      { property: "og:title", content: "NES.css Design System" },
      { property: "og:description", content: "Retro 8-bit design system built on NES.css — pixel-perfect React components." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: nesCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="app-cloak" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: initialRevealStyles }} />
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: initialRevealScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Keep this root providers-only: canvas preview routes (/__mockup,
// /__component) render inside it, so any chrome leaks into every frame.
function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
