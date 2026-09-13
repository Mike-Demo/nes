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
  { to: "/studio", label: "Icon studio" },
] as const;

export function ShowcaseShell({ children }: { children: ReactNode }) {
  return (
    <div className="showcase-shell">
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
      <main className="showcase-main">{children}</main>
    </div>
  );
}
