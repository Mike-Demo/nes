import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import "./showcase.css";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/lovable", label: "Lovable patterns" },
  { to: "/colors", label: "Colors" },
  { to: "/typography", label: "Typography" },
  { to: "/icons", label: "Iconography" },
  { to: "/components", label: "Components" },
  { to: "/specs", label: "Component specs" },
  { to: "/studio", label: "Icon studio" },
  { to: "/accessibility", label: "Accessibility" },
] as const;

export function ShowcaseShell({ children }: { children: ReactNode }) {
  return (
    <div className="showcase-shell">
      <a className="skip-link" href="#showcase-main">
        Skip to content
      </a>
      <nav className="showcase-nav" aria-label="Showcase">
        <Link to="/" className="brand">
          NES.CSS
          <br />
          DESIGN SYSTEM
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="nav-link"
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "nav-link active" }}
          >
            {item.label}
          </Link>
        ))}
        <div className="nav-footer">
          <ThemeToggle />
        </div>
      </nav>
      <main id="showcase-main" className="showcase-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
