import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { COMPONENT_SPECS, SPEC_NAMES, type SpecRow } from "../showcase/specs";

export const Route = createFileRoute("/specs/$name")({
  loader: ({ params }) => {
    if (!(params.name in COMPONENT_SPECS)) throw notFound();
    return { name: params.name };
  },
  head: ({ params }) => {
    const spec = COMPONENT_SPECS[params.name];
    const title = spec ? `${spec.name} spec — NES.css Design System` : "Component spec — NES.css Design System";
    const description = spec?.summary ?? "Component specification in the NES.css design system.";
    const path = `/specs/${params.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: path },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: title,
            description,
            url: `https://design.2.MikeDemo.dev${path}`,
            about: spec?.name ?? params.name,
            isPartOf: { "@type": "WebSite", name: "NES.css Design System", url: "https://design.2.MikeDemo.dev/" },
          }),
        },
      ],
    };
  },
  notFoundComponent: SpecNotFound,
  component: SpecPage,
});

function SpecNotFound() {
  return (
    <ShowcaseShell>
      <h1>Unknown component</h1>
      <p className="lede">No spec exists for that name.</p>
      <Link to="/specs" className="spec-link">
        Back to all specs
      </Link>
    </ShowcaseShell>
  );
}

function RowTable({ caption, rows }: { caption: string; rows: SpecRow[] }) {
  return (
    <table className="spec-table">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
          <th>Token</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.label}-${row.value}`}>
            <td>{row.label}</td>
            <td>{row.value}</td>
            <td>
              {row.token ? (
                <>
                  <span className="spec-swatch" style={{ backgroundColor: `var(${row.token})` }} aria-hidden="true" />
                  <code>{row.token}</code>
                </>
              ) : (
                "—"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SpecPage() {
  const { name } = Route.useLoaderData();
  const spec = COMPONENT_SPECS[name];
  const index = SPEC_NAMES.indexOf(name);
  const prev = SPEC_NAMES[index - 1];
  const next = SPEC_NAMES[index + 1];

  return (
    <ShowcaseShell>
      <div className="component-header">
        <h1>{spec.name}</h1>
        <Link to="/components" hash={spec.name} className="spec-link">
          See live examples
        </Link>
      </div>
      <p className="lede">{spec.summary}</p>

      <section className="showcase-section">
        <h2>Anatomy</h2>
        <div className="spec-anatomy">{spec.example()}</div>
        <ul className="spec-metric">
          {spec.anatomy.map((part) => (
            <li key={part}>
              <code>{part}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="showcase-section">
        <h2>Spacing</h2>
        <RowTable caption={`${spec.name} spacing`} rows={spec.spacing} />
      </section>

      <section className="showcase-section">
        <h2>Colors</h2>
        <RowTable caption={`${spec.name} colors`} rows={spec.colors} />
      </section>

      <section className="showcase-section">
        <h2>Typography</h2>
        <RowTable caption={`${spec.name} typography`} rows={spec.typography} />
      </section>

      <section className="showcase-section">
        <h2>States</h2>
        <div className="state-grid">
          {spec.states.map((state) => (
            <div key={state.label} className="state-cell">
              {state.render()}
              <span className="showcase-caption">{state.label}</span>
              {state.note ? <span className="showcase-caption">{state.note}</span> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="showcase-section">
        <h2>Accessibility</h2>
        <ul className="spec-metric">
          {spec.accessibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="showcase-section">
        <h2>Props</h2>
        <table className="spec-table">
          <caption className="sr-only">{spec.name} props</caption>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {spec.props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                </td>
                <td>
                  <code>{prop.type}</code>
                </td>
                <td>{prop.defaultValue}</td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="showcase-section">
        <h2>Usage</h2>
        <pre className="snippet">{spec.snippet}</pre>
      </section>

      <nav className="component-header" aria-label="Spec pagination">
        {prev ? (
          <Link to="/specs/$name" params={{ name: prev }} className="spec-link">
            ← {prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to="/specs/$name" params={{ name: next }} className="spec-link">
            {next} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </ShowcaseShell>
  );
}
