import { Link, createFileRoute } from "@tanstack/react-router";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { NesButton } from "../components/NesButton";
import { NesContainer } from "../components/NesContainer";
import { NesBalloon } from "../components/NesBalloon";
import { NesPixelArt } from "../components/NesPixelArt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NES.css Design System" },
      { name: "description", content: "Retro 8-bit design system: pixel-perfect React components built on NES.css." },
      { property: "og:title", content: "NES.css Design System" },
      { property: "og:description", content: "Retro 8-bit design system: pixel-perfect React components built on NES.css." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "NES.css Design System",
            url: "https://design.2.MikeDemo.dev/",
            description: "Retro 8-bit design system: pixel-perfect React components built on NES.css.",
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: "NES.css Design System",
            description: "Typed React components, two palettes and 215 pixel rune icons in the NES.css style.",
            programmingLanguage: ["TypeScript", "CSS"],
            runtimePlatform: "React 19",
            codeRepository: "https://github.com/Mike-Demo/nes.css",
            license: "https://opensource.org/licenses/MIT",
          },
        ]),
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <ShowcaseShell>
      <h1>NES.css Design System</h1>
      <p className="lede">
        A retro 8-bit design system now combined with the Lovable-focused demo
        work from Mike-Demo/nes.css. Build AI-native interfaces with prompt
        flows, agent status, review states, and human-in-the-loop handoffs.
      </p>

      <div className="showcase-section">
        <NesContainer title="HELLO, PLAYER 1" centered rounded>
          <div className="specimen-row" style={{ alignItems: "center" }}>
            <NesPixelArt name="mario" />
            <NesBalloon from="left">
              <p>Press start to explore the system.</p>
            </NesBalloon>
          </div>
          <div className="specimen-row" style={{ marginTop: 24 }}>
            <NesButton variant="primary">Start</NesButton>
            <NesButton variant="success">Continue</NesButton>
            <NesButton variant="error">Quit</NesButton>
            <Link to="/lovable" className="nes-btn is-warning">
              Lovable patterns
            </Link>
          </div>
        </NesContainer>
      </div>

      <div className="showcase-section">
        <h2>What's inside</h2>
        <div className="specimen-row">
          <div>
            <NesContainer rounded>
              <p>16 COMPONENTS</p>
              <span className="showcase-caption">Buttons, forms, dialogs, tables, sprites and more</span>
            </NesContainer>
          </div>
          <div>
            <NesContainer rounded>
              <p>5 SEMANTIC COLORS</p>
              <span className="showcase-caption">primary, success, warning, error + neutrals</span>
            </NesContainer>
          </div>
          <div>
            <NesContainer rounded>
              <p>1 PIXEL FONT</p>
              <span className="showcase-caption">Press Start 2P everywhere</span>
            </NesContainer>
          </div>
        </div>
      </div>
    </ShowcaseShell>
  );
}
