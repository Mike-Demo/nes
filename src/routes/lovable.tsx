import { Link, createFileRoute } from "@tanstack/react-router";

import { NesBadge } from "../components/NesBadge";
import { NesBalloon } from "../components/NesBalloon";
import { NesButton } from "../components/NesButton";
import { NesContainer } from "../components/NesContainer";
import { NesField } from "../components/NesField";
import { NesTextarea } from "../components/NesInput";
import { NesList } from "../components/NesList";
import { NesProgress } from "../components/NesProgress";
import { NesSelect } from "../components/NesSelect";
import { NesTable } from "../components/NesTable";
import { NesText } from "../components/NesText";
import { ShowcaseShell } from "../showcase/ShowcaseShell";

export const Route = createFileRoute("/lovable")({
  head: () => ({
    meta: [
      { title: "Lovable Patterns — NES.css Design System" },
      { name: "description", content: "Lovable-oriented AI product patterns built from NES.css React wrappers." },
      { property: "og:title", content: "Lovable Patterns — NES.css Design System" },
      { property: "og:description", content: "Lovable-oriented AI product patterns built from NES.css React wrappers." },
    ],
  }),
  component: LovablePatternsPage,
});

const PRINCIPLES = [
  {
    title: "Visible system status",
    description: "Show active work, waiting states, and completion paths in every major flow.",
  },
  {
    title: "Trust by default",
    description: "Keep confidence, provenance, and safety cues next to every action.",
  },
  {
    title: "Composable surfaces",
    description: "Reuse the same primitives from prompt boxes to multi-step agent workflows.",
  },
  {
    title: "Human override",
    description: "Every automated action needs an obvious stop, retry, or escalation route.",
  },
] as const;

function LovablePatternsPage() {
  return (
    <ShowcaseShell>
      <h1>Lovable AI Patterns</h1>
      <p className="lede">
        This page combines the Lovable-focused NES.css demo patterns from
        Mike-Demo/nes.css into this live React design system.
      </p>

      <div className="showcase-section">
        <h2>Principles</h2>
        <div className="lovable-grid lovable-grid-2">
          {PRINCIPLES.map((principle) => (
            <NesContainer key={principle.title} title={principle.title.toUpperCase()} rounded>
              <p>{principle.description}</p>
            </NesContainer>
          ))}
        </div>
      </div>

      <div className="showcase-section">
        <h2>Prompt composer</h2>
        <NesContainer rounded>
          <div className="lovable-row">
            <NesField label="Model" htmlFor="model" inline>
              <NesSelect id="model" defaultValue="reasoner">
                <option value="reasoner">Lovable Reasoner</option>
                <option value="fast">Lovable Fast</option>
                <option value="vision">Lovable Vision</option>
              </NesSelect>
            </NesField>
            <NesField label="Mode" htmlFor="mode" inline>
              <NesSelect id="mode" defaultValue="build" state="success">
                <option value="build">Build</option>
                <option value="review">Review</option>
                <option value="research">Research</option>
              </NesSelect>
            </NesField>
          </div>
          <NesField label="What should Lovable create?" htmlFor="prompt">
            <NesTextarea
              id="prompt"
              defaultValue="Summarize the support backlog, draft a release note, and flag anything needing approval."
            />
          </NesField>
          <div className="lovable-row">
            <NesText variant="success">Context attached · Product brief · 4 files</NesText>
            <NesText variant="warning">Human review required before publish</NesText>
          </div>
          <div className="lovable-row">
            <NesButton variant="primary">Run prompt</NesButton>
            <NesButton>Save as workflow</NesButton>
          </div>
        </NesContainer>
      </div>

      <div className="showcase-section">
        <h2>Agent activity</h2>
        <div className="lovable-grid lovable-grid-2">
          <NesContainer title="RESEARCH AGENT" rounded>
            <div className="lovable-row">
              <NesBadge variant="success">Running</NesBadge>
              <NesBadge variant="primary">0.94 confidence</NesBadge>
            </div>
            <NesProgress variant="success" value={76} max={100} />
            <p>Scanning customer interviews and clustering feature requests.</p>
          </NesContainer>
          <NesContainer title="SHIPPING AGENT" dark rounded>
            <div className="lovable-row">
              <NesBadge variant="warning">Awaiting approval</NesBadge>
              <NesBadge variant="error">Publish locked</NesBadge>
            </div>
            <NesProgress variant="warning" value={58} max={100} />
            <p>Prepared release notes and waiting for human approval.</p>
          </NesContainer>
        </div>
      </div>

      <div className="showcase-section">
        <h2>Conversation review</h2>
        <NesContainer rounded>
          <div className="lovable-stack">
            <NesBalloon from="left">
              <p>Draft an onboarding checklist for new Lovable workspace admins.</p>
            </NesBalloon>
            <NesBalloon from="right" className="is-dark">
              <p>I prepared setup, permissions, guardrails, and launch readiness steps.</p>
            </NesBalloon>
            <div className="lovable-row">
              <NesButton variant="success">Approve</NesButton>
              <NesButton variant="warning">Request changes</NesButton>
              <NesButton variant="error">Escalate</NesButton>
            </div>
          </div>
        </NesContainer>
      </div>

      <div className="showcase-section">
        <h2>AI operations dashboard</h2>
        <div className="lovable-grid lovable-grid-3">
          <NesContainer title="ASSIST ACCEPTANCE" centered rounded>
            <NesText variant="success">81%</NesText>
            <span className="showcase-caption">last 7 days</span>
          </NesContainer>
          <NesContainer title="HUMAN ESCALATIONS" centered rounded>
            <NesText variant="warning">14</NesText>
            <span className="showcase-caption">needs triage</span>
          </NesContainer>
          <NesContainer title="BROKEN RUNS" centered rounded>
            <NesText variant="error">2</NesText>
            <span className="showcase-caption">rollback required</span>
          </NesContainer>
        </div>
      </div>

      <div className="showcase-section">
        <h2>Launch checklist</h2>
        <NesContainer rounded>
          <div className="lovable-row">
            <NesBadge variant="primary">Beta launch</NesBadge>
            <NesBadge variant="success">3 of 4 checks passed</NesBadge>
          </div>
          <NesTable bordered centered responsive>
            <thead>
              <tr>
                <th>Check</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prompt QA</td>
                <td>Design</td>
                <td><NesText variant="success">Ready</NesText></td>
              </tr>
              <tr>
                <td>Safety review</td>
                <td>Trust</td>
                <td><NesText variant="warning">In review</NesText></td>
              </tr>
              <tr>
                <td>Fallback copy</td>
                <td>Product</td>
                <td><NesText variant="success">Ready</NesText></td>
              </tr>
              <tr>
                <td>Monitoring alerts</td>
                <td>Engineering</td>
                <td><NesText variant="success">Ready</NesText></td>
              </tr>
            </tbody>
          </NesTable>
        </NesContainer>
      </div>

      <div className="showcase-section">
        <h2>Human-in-the-loop handoff</h2>
        <div className="lovable-grid lovable-grid-2">
          <NesContainer title="COMPLETED BY AI" rounded>
            <NesList variant="disc">
              <li>Clustered 48 feedback notes</li>
              <li>Generated launch summary</li>
              <li>Flagged 3 risky claims for review</li>
            </NesList>
          </NesContainer>
          <NesContainer title="NEEDS HUMAN ACTION" dark rounded>
            <NesList variant="disc" dark>
              <li>Approve publish text</li>
              <li>Confirm pricing language</li>
              <li>Choose beta-only or broad release</li>
            </NesList>
            <NesButton variant="primary">Open approval queue</NesButton>
          </NesContainer>
        </div>
      </div>

      <div className="showcase-section">
        <h2>Next</h2>
        <p className="lede">
          Explore low-level component APIs on the Components page, then compose
          them into your own Lovable workflows.
        </p>
        <Link to="/components" className="nes-btn is-primary">
          Open components
        </Link>
      </div>
    </ShowcaseShell>
  );
}
