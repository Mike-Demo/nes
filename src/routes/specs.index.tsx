import { Link, createFileRoute } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { COMPONENT_SPECS, SPEC_NAMES } from "../showcase/specs";

export const Route = createFileRoute("/specs/")({
  head: () => ({
    meta: [
      { title: "Component specs — NES.css Design System" },
      { name: "description", content: "Spacing, colors, typography, states and props for every NES.css component." },
      { property: "og:title", content: "Component specs — NES.css Design System" },
      { property: "og:description", content: "Spacing, colors, typography, states and props for every NES.css component." },
    ],
  }),
  component: SpecsIndexPage,
});

function SpecsIndexPage() {
  return (
    <ShowcaseShell>
      <h1>Component specs</h1>
      <p className="lede">
        The measured side of the system: anatomy, spacing, color tokens, typography, accessible
        states and props for each component.
      </p>
      <div className="spec-grid">
        {SPEC_NAMES.map((name) => (
          <Link key={name} to="/specs/$name" params={{ name }} className="spec-metric">
            <strong>{name}</strong>
            <span>{COMPONENT_SPECS[name].summary}</span>
          </Link>
        ))}
      </div>
    </ShowcaseShell>
  );
}
