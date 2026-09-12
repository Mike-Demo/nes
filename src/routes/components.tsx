import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { NesAvatar } from "../components/NesAvatar";
import { NesBadge } from "../components/NesBadge";
import { NesBalloon } from "../components/NesBalloon";
import { NesButton } from "../components/NesButton";
import { NesCheckbox, NesRadio } from "../components/NesCheckbox";
import { NesContainer } from "../components/NesContainer";
import { NesDialog } from "../components/NesDialog";
import { NesField } from "../components/NesField";
import { NesIcon } from "../components/NesIcon";
import { NesInput, NesTextarea } from "../components/NesInput";
import { NesList } from "../components/NesList";
import { NesPixelArt } from "../components/NesPixelArt";
import { NesProgress } from "../components/NesProgress";
import { NesSelect } from "../components/NesSelect";
import { NesTable } from "../components/NesTable";
import { NesText } from "../components/NesText";

export const Route = createFileRoute("/components")({
  head: () => ({
    meta: [
      { title: "Components — NES.css Design System" },
      { name: "description", content: "Every component in the NES.css design system, live with variants and states." },
      { property: "og:title", content: "Components — NES.css Design System" },
      { property: "og:description", content: "Every component in the NES.css design system, live with variants and states." },
    ],
  }),
  component: ComponentsPage,
});

const SECTIONS = [
  "NesButton", "NesBadge", "NesBalloon", "NesContainer", "NesDialog",
  "NesField", "NesInput", "NesTextarea", "NesCheckbox", "NesRadio",
  "NesSelect", "NesList", "NesProgress", "NesTable", "NesText",
  "NesAvatar", "NesIcon", "NesPixelArt",
] as const;

function Snippet({ code }: { code: string }) {
  return <pre className="snippet">{code}</pre>;
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="showcase-section">
      <h2>{id}</h2>
      {children}
    </section>
  );
}

function ComponentsPage() {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const q = query.trim().toLowerCase();
  const visible = new Set(SECTIONS.filter((s) => s.toLowerCase().includes(q)));
  const show = (s: (typeof SECTIONS)[number]) => visible.has(s);

  return (
    <ShowcaseShell>
      <h1>Components</h1>
      <p className="lede">
        Every exported component, live, with variants and states. Filter the
        list to jump to a section.
      </p>

      <div className="search-field">
        <NesInput
          aria-label="Filter components"
          placeholder="Filter components..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {show("NesButton") && (
        <Section id="NesButton">
          <div className="specimen-row">
            {(["default", "primary", "success", "warning", "error"] as const).map((v) => (
              <div key={v} className="specimen">
                <NesButton variant={v}>{v === "default" ? "Normal" : v}</NesButton>
                <span className="showcase-caption">variant="{v}"</span>
              </div>
            ))}
            <div className="specimen">
              <NesButton disabled>Disabled</NesButton>
              <span className="showcase-caption">disabled</span>
            </div>
          </div>
          <Snippet code={`<NesButton variant="primary">Start</NesButton>`} />
        </Section>
      )}

      {show("NesBadge") && (
        <Section id="NesBadge">
          <div className="specimen-row">
            {(["dark", "primary", "success", "warning", "error"] as const).map((v) => (
              <div key={v} className="specimen">
                <NesBadge variant={v} href="#badge">{v}</NesBadge>
                <span className="showcase-caption">variant="{v}"</span>
              </div>
            ))}
            <div className="specimen">
              <NesBadge href="#badge" icon={<NesIcon name="coin" size="small" />} iconVariant="warning" variant="dark">
                9999
              </NesBadge>
              <span className="showcase-caption">split badge with icon</span>
            </div>
          </div>
          <Snippet code={`<NesBadge variant="success">NEW</NesBadge>`} />
        </Section>
      )}

      {show("NesBalloon") && (
        <Section id="NesBalloon">
          <div className="specimen-row">
            <div className="specimen" style={{ flex: 1, minWidth: 260 }}>
              <NesBalloon from="left">
                <p>It's dangerous to go alone! Take this.</p>
              </NesBalloon>
              <span className="showcase-caption">from="left"</span>
            </div>
            <div className="specimen" style={{ flex: 1, minWidth: 260 }}>
              <NesBalloon from="right">
                <p>Thank you, old man!</p>
              </NesBalloon>
              <span className="showcase-caption">from="right"</span>
            </div>
          </div>
          <Snippet code={`<NesBalloon from="left"><p>Hello!</p></NesBalloon>`} />
        </Section>
      )}

      {show("NesContainer") && (
        <Section id="NesContainer">
          <div className="specimen-row">
            <div className="specimen" style={{ minWidth: 240 }}>
              <NesContainer title="STATUS" centered>
                <p>HP 24/24</p>
              </NesContainer>
              <span className="showcase-caption">title + centered</span>
            </div>
            <div className="specimen" style={{ minWidth: 240 }}>
              <NesContainer rounded>
                <p>Rounded frame</p>
              </NesContainer>
              <span className="showcase-caption">rounded</span>
            </div>
            <div className="specimen" style={{ minWidth: 240 }}>
              <NesContainer dark rounded>
                <p>Dark surface</p>
              </NesContainer>
              <span className="showcase-caption">dark + rounded</span>
            </div>
          </div>
          <Snippet code={`<NesContainer title="STATUS" centered rounded>...</NesContainer>`} />
        </Section>
      )}

      {show("NesDialog") && (
        <Section id="NesDialog">
          <div className="specimen-row">
            <NesButton variant="primary" onClick={() => dialogRef.current?.showModal()}>
              Open dialog
            </NesButton>
          </div>
          <NesDialog ref={dialogRef} rounded>
            <form method="dialog">
              <p>PAUSED</p>
              <p>Take a break, player 1?</p>
              <menu style={{ display: "flex", gap: 16, padding: 0 }}>
                <NesButton>Resume</NesButton>
                <NesButton variant="primary">Confirm</NesButton>
              </menu>
            </form>
          </NesDialog>
          <Snippet code={`const ref = useRef<HTMLDialogElement>(null);\n<NesDialog ref={ref} rounded>...</NesDialog>\nref.current?.showModal()`} />
        </Section>
      )}

      {show("NesField") && (
        <Section id="NesField">
          <div className="specimen-row">
            <div className="specimen" style={{ minWidth: 280 }}>
              <NesField label="Player name" htmlFor="f1">
                <NesInput id="f1" placeholder="ASH KETCHUM" />
              </NesField>
              <span className="showcase-caption">stacked label</span>
            </div>
            <div className="specimen" style={{ minWidth: 280 }}>
              <NesField label="Level" htmlFor="f2" inline>
                <NesInput id="f2" placeholder="5" />
              </NesField>
              <span className="showcase-caption">inline</span>
            </div>
          </div>
          <Snippet code={`<NesField label="Player name" htmlFor="name">\n  <NesInput id="name" />\n</NesField>`} />
        </Section>
      )}

      {show("NesInput") && (
        <Section id="NesInput">
          <div className="specimen-row">
            <div className="specimen">
              <NesInput placeholder="Normal" aria-label="normal input" />
              <span className="showcase-caption">default</span>
            </div>
            {(["success", "warning", "error"] as const).map((s) => (
              <div key={s} className="specimen">
                <NesInput state={s} defaultValue={s} aria-label={`${s} input`} />
                <span className="showcase-caption">state="{s}"</span>
              </div>
            ))}
          </div>
          <Snippet code={`<NesInput state="success" defaultValue="PIKACHU" />`} />
        </Section>
      )}

      {show("NesTextarea") && (
        <Section id="NesTextarea">
          <div className="specimen-row">
            <div className="specimen" style={{ minWidth: 320 }}>
              <NesTextarea placeholder="Tell your story..." aria-label="story" />
              <span className="showcase-caption">default</span>
            </div>
            <div className="specimen" style={{ minWidth: 320 }}>
              <NesTextarea state="error" defaultValue="Missing pages..." aria-label="story error" />
              <span className="showcase-caption">state="error"</span>
            </div>
          </div>
          <Snippet code={`<NesTextarea placeholder="Tell your story..." />`} />
        </Section>
      )}

      {show("NesCheckbox") && (
        <Section id="NesCheckbox">
          <div className="specimen-row">
            <NesCheckbox label="Enable sound" defaultChecked />
            <NesCheckbox label="Enable music" />
            <NesCheckbox label="Hard mode (locked)" disabled />
          </div>
          <Snippet code={`<NesCheckbox label="Enable sound" defaultChecked />`} />
        </Section>
      )}

      {show("NesRadio") && (
        <Section id="NesRadio">
          <div className="specimen-row">
            <NesRadio name="difficulty" label="Easy" defaultChecked />
            <NesRadio name="difficulty" label="Normal" />
            <NesRadio name="difficulty" label="Hard" />
          </div>
          <Snippet code={`<NesRadio name="difficulty" label="Normal" />`} />
        </Section>
      )}

      {show("NesSelect") && (
        <Section id="NesSelect">
          <div className="specimen-row">
            <div className="specimen" style={{ minWidth: 240 }}>
              <NesSelect defaultValue="" aria-label="starter">
                <option value="" disabled hidden>Choose your starter...</option>
                <option value="bulbasaur">Bulbasaur</option>
                <option value="charmander">Charmander</option>
                <option value="squirtle">Squirtle</option>
              </NesSelect>
              <span className="showcase-caption">default</span>
            </div>
          </div>
          <Snippet code={`<NesSelect>\n  <option>Bulbasaur</option>\n</NesSelect>`} />
        </Section>
      )}

      {show("NesList") && (
        <Section id="NesList">
          <div className="specimen-row">
            <NesList variant="disc">
              <li>Pallet Town</li>
              <li>Viridian City</li>
            </NesList>
            <NesList variant="circle">
              <li>Pewter City</li>
              <li>Cerulean City</li>
            </NesList>
          </div>
          <Snippet code={`<NesList variant="disc"><li>Pallet Town</li></NesList>`} />
        </Section>
      )}

      {show("NesProgress") && (
        <Section id="NesProgress">
          <div className="specimen" style={{ maxWidth: 420 }}>
            {(["default", "primary", "success", "warning", "error", "pattern"] as const).map((v, i) => (
              <div key={v} className="specimen" style={{ marginBottom: 16 }}>
                <NesProgress variant={v} value={90 - i * 12} max={100} style={{ width: 420 }} />
                <span className="showcase-caption">variant="{v}"</span>
              </div>
            ))}
          </div>
          <Snippet code={`<NesProgress variant="primary" value={78} max={100} />`} />
        </Section>
      )}

      {show("NesTable") && (
        <Section id="NesTable">
          <NesTable bordered centered responsive>
            <thead>
              <tr>
                <th>Pokemon</th>
                <th>Type</th>
                <th>HP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pikachu</td>
                <td>Electric</td>
                <td>35</td>
              </tr>
              <tr>
                <td>Charizard</td>
                <td>Fire</td>
                <td>78</td>
              </tr>
              <tr>
                <td>Blastoise</td>
                <td>Water</td>
                <td>79</td>
              </tr>
            </tbody>
          </NesTable>
          <Snippet code={`<NesTable bordered centered responsive>...</NesTable>`} />
        </Section>
      )}

      {show("NesText") && (
        <Section id="NesText">
          <div className="specimen-row">
            {(["primary", "success", "warning", "error", "disabled"] as const).map((v) => (
              <NesText key={v} variant={v}>{v.toUpperCase()}</NesText>
            ))}
          </div>
          <Snippet code={`<NesText variant="error">GAME OVER</NesText>`} />
        </Section>
      )}

      {show("NesAvatar") && (
        <Section id="NesAvatar">
          <div className="specimen-row" style={{ alignItems: "center" }}>
            <div className="specimen" style={{ alignItems: "center" }}>
              <NesAvatar src="/favicon.ico" alt="Player avatar" />
              <span className="showcase-caption">default</span>
            </div>
            {(["small", "medium", "large"] as const).map((s) => (
              <div key={s} className="specimen" style={{ alignItems: "center" }}>
                <NesAvatar src="/favicon.ico" alt="Player avatar" size={s} />
                <span className="showcase-caption">size="{s}"</span>
              </div>
            ))}
            <div className="specimen" style={{ alignItems: "center" }}>
              <NesAvatar src="/favicon.ico" alt="Player avatar" size="medium" rounded />
              <span className="showcase-caption">rounded</span>
            </div>
          </div>
          <Snippet code={`<NesAvatar src={avatarUrl} alt="Player" size="medium" rounded />`} />
        </Section>
      )}

      {show("NesIcon") && (
        <Section id="NesIcon">
          <div className="specimen-row" style={{ alignItems: "center" }}>
            <NesIcon name="heart" size="medium" />
            <NesIcon name="star" size="medium" />
            <NesIcon name="coin" size="medium" />
            <NesIcon name="trophy" size="medium" />
            <NesIcon name="like" size="medium" />
            <NesIcon name="heart" size="medium" empty />
          </div>
          <span className="showcase-caption">See the Iconography page for the full set</span>
          <Snippet code={`<NesIcon name="heart" size="medium" />`} />
        </Section>
      )}

      {show("NesPixelArt") && (
        <Section id="NesPixelArt">
          <div className="specimen-row" style={{ alignItems: "flex-end" }}>
            <NesPixelArt name="mario" />
            <NesPixelArt name="kirby" />
            <NesPixelArt name="pokeball" />
            <NesPixelArt name="octocat" />
          </div>
          <span className="showcase-caption">See the Iconography page for the full set</span>
          <Snippet code={`<NesPixelArt name="mario" />`} />
        </Section>
      )}
    </ShowcaseShell>
  );
}
