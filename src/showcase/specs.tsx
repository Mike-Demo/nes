import type { ReactNode } from "react";

import { NesAvatar } from "@/components/NesAvatar";
import { NesBadge } from "@/components/NesBadge";
import { NesBalloon } from "@/components/NesBalloon";
import { NesButton } from "@/components/NesButton";
import { NesCheckbox, NesRadio } from "@/components/NesCheckbox";
import { NesContainer } from "@/components/NesContainer";
import { NesDialog } from "@/components/NesDialog";
import { NesField } from "@/components/NesField";
import { NesIcon } from "@/components/NesIcon";
import { NesInput, NesTextarea } from "@/components/NesInput";
import { NesList } from "@/components/NesList";
import { NesPixelArt } from "@/components/NesPixelArt";
import { NesPixelIcon } from "@/components/NesPixelIcon";
import { NesProgress } from "@/components/NesProgress";
import { NesRuneIcon } from "@/components/NesRuneIcon";
import { NesSelect } from "@/components/NesSelect";
import { NesTable } from "@/components/NesTable";
import { NesText } from "@/components/NesText";
import type { PixelIconData } from "@/components/pixel-icon";

export interface SpecRow {
  label: string;
  value: string;
  token?: string;
}

export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface StateSpec {
  label: string;
  note?: string;
  render: () => ReactNode;
}

export interface ComponentSpec {
  name: string;
  summary: string;
  anatomy: string[];
  spacing: SpecRow[];
  colors: SpecRow[];
  typography: SpecRow[];
  states: StateSpec[];
  accessibility: string[];
  props: PropRow[];
  snippet: string;
  example: () => ReactNode;
}

const FONT_ROWS: SpecRow[] = [
  { label: "Family", value: "Press Start 2P", token: "--nes-font" },
  { label: "Rendering", value: "pixelated, no antialiasing" },
];

const SEMANTIC_VARIANTS = ["primary", "success", "warning", "error"] as const;

const variantColorRows = (prefix: string): SpecRow[] =>
  SEMANTIC_VARIANTS.flatMap((v) => [
    { label: `${prefix} ${v} fill`, value: v, token: `--nes-${v}` },
    { label: `${prefix} ${v} hover`, value: `${v} hover shade`, token: `--nes-${v}-hover` },
    { label: `${prefix} ${v} shadow`, value: `${v} shadow shade`, token: `--nes-${v}-shadow` },
  ]);

const COMMON_PROPS: PropRow[] = [
  { name: "className", type: "string", defaultValue: "—", description: "Merged with the NES classes." },
  { name: "ref", type: "Ref", defaultValue: "—", description: "Forwarded to the underlying element." },
];

const SAMPLE_PIXEL_ICON: PixelIconData = {
  size: 8,
  palette: ["#212529", "#e76e55"],
  pixels: [
    [-1, 0, 0, -1, -1, 0, 0, -1],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, -1, 0, 1, 1, 0, -1, -1],
    [-1, -1, -1, 0, 0, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
  ],
};

export const COMPONENT_SPECS: Record<string, ComponentSpec> = {
  NesButton: {
    name: "NesButton",
    summary: "The primary action control. A native <button> with a 4px pixel border and stepped hover/active shadows.",
    anatomy: ["<button class=\"nes-btn\">", "::after pixel shadow (inset)", "border-image pixel frame", "label text (children)"],
    spacing: [
      { label: "Padding", value: "6px 8px" },
      { label: "Border", value: "4px pixel frame" },
      { label: "Inline gap between buttons", value: "8px (use lovable-row)" },
      { label: "Shadow inset (rest)", value: "-4px -4px", token: "--nes-shadow" },
      { label: "Shadow inset (hover)", value: "-6px -6px" },
      { label: "Shadow inset (active)", value: "4px 4px" },
    ],
    colors: [
      { label: "default fill", value: "surface", token: "--nes-bg" },
      { label: "default hover", value: "hover shade", token: "--nes-hover" },
      { label: "text", value: "ink", token: "--nes-dark" },
      { label: "disabled fill", value: "disabled grey", token: "--nes-disabled" },
      ...variantColorRows("variant"),
    ],
    typography: [...FONT_ROWS, { label: "Size", value: "inherits (10–12px typical)" }, { label: "Transform", value: "none; keep labels short" }],
    states: [
      { label: "default", render: () => <NesButton>Start</NesButton> },
      { label: "hover", render: () => <NesButton className="force-hover">Start</NesButton> },
      { label: "focus-visible", render: () => <NesButton className="force-focus">Start</NesButton> },
      { label: "active", render: () => <NesButton className="force-active">Start</NesButton> },
      { label: "disabled", render: () => <NesButton disabled>Start</NesButton> },
      { label: "primary hover", render: () => <NesButton variant="primary" className="force-hover">Start</NesButton> },
      { label: "error active", render: () => <NesButton variant="error" className="force-active">Delete</NesButton> },
    ],
    accessibility: [
      "Renders a real <button>; keyboard activation with Enter/Space is native.",
      "Focus ring is a 6px halo — never remove the outline.",
      "Disabled uses the disabled attribute, so it leaves the tab order.",
      "Icon-only buttons need aria-label.",
    ],
    props: [
      { name: "variant", type: '"default" | "primary" | "success" | "warning" | "error"', defaultValue: '"default"', description: "Semantic color." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Native disabled state." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesButton variant="primary">Start</NesButton>`,
    example: () => (
      <div className="lovable-row">
        <NesButton variant="primary">Save</NesButton>
        <NesButton>Cancel</NesButton>
      </div>
    ),
  },

  NesBadge: {
    name: "NesBadge",
    summary: "Small pixel label for counts and statuses; optionally split with an icon half.",
    anatomy: ["<a class=\"nes-badge\">", "<span class=\"is-{variant}\"> label", "optional icon half (is-icon)"],
    spacing: [
      { label: "Height", value: "1.5em" },
      { label: "Label padding", value: "0 6px" },
      { label: "Pixel border", value: "box-shadow 0 ±0.5em" },
    ],
    colors: [
      { label: "dark", value: "ink", token: "--nes-dark" },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: v, value: v, token: `--nes-${v}` })),
      { label: "label text", value: "surface", token: "--nes-bg" },
    ],
    typography: [...FONT_ROWS, { label: "Size", value: "0.5em of parent" }],
    states: [
      ...(["dark", ...SEMANTIC_VARIANTS] as const).map((v) => ({ label: v, render: () => <NesBadge variant={v} href="#s">{v}</NesBadge> })),
      { label: "split with icon", render: () => <NesBadge href="#s" variant="dark" icon={<NesIcon name="coin" size="small" />} iconVariant="warning">42</NesBadge> },
    ],
    accessibility: ["Renders an <a> when href is set — give it a meaningful destination.", "Color alone is not status: pair with text."],
    props: [
      { name: "variant", type: '"dark" | "primary" | "success" | "warning" | "error"', defaultValue: '"dark"', description: "Fill color." },
      { name: "href", type: "string", defaultValue: "—", description: "Optional link target." },
      { name: "icon / iconVariant", type: "ReactNode / variant", defaultValue: "—", description: "Splits the badge with an icon half." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesBadge variant="success">NEW</NesBadge>`,
    example: () => <NesBadge variant="success" href="#s">NEW</NesBadge>,
  },

  NesBalloon: {
    name: "NesBalloon",
    summary: "Speech balloon for dialogue text with a pixel tail on the left or right.",
    anatomy: ["<section class=\"nes-balloon from-left|from-right\">", "::before tail", "::after tail shadow", "children"],
    spacing: [
      { label: "Padding", value: "1rem 1.5rem" },
      { label: "Margin", value: "8px, plus 30px bottom for the tail" },
      { label: "Tail offset", value: "2rem from the edge" },
    ],
    colors: [
      { label: "fill", value: "surface", token: "--nes-bg" },
      { label: "border", value: "ink", token: "--nes-dark" },
      { label: "dark fill", value: "ink", token: "--nes-dark" },
    ],
    typography: [...FONT_ROWS, { label: "Line height", value: "1.5" }],
    states: [
      { label: "from left", render: () => <NesBalloon from="left"><p>Hello!</p></NesBalloon> },
      { label: "from right", render: () => <NesBalloon from="right"><p>Hi!</p></NesBalloon> },
    ],
    accessibility: ["Plain content — keep sentences short so Press Start 2P stays legible.", "Never add CSS border-radius; the frame is a pixel border."],
    props: [
      { name: "from", type: '"left" | "right"', defaultValue: '"left"', description: "Tail side." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesBalloon from="left"><p>It's dangerous to go alone!</p></NesBalloon>`,
    example: () => <NesBalloon from="left"><p>It's dangerous to go alone!</p></NesBalloon>,
  },

  NesContainer: {
    name: "NesContainer",
    summary: "Framed panel with an optional title that sits on the border. The main grouping surface.",
    anatomy: ["<section class=\"nes-container\">", "<p class=\"title\"> overlapping the top border", "children"],
    spacing: [
      { label: "Padding", value: "1.5rem 2rem" },
      { label: "Border", value: "4px" },
      { label: "Title offset", value: "-1.8rem above, 1rem inset" },
      { label: "Stack gap inside", value: "16px (lovable-stack)" },
    ],
    colors: [
      { label: "fill", value: "surface", token: "--nes-bg" },
      { label: "border", value: "ink", token: "--nes-dark" },
      { label: "dark fill / text", value: "ink / surface", token: "--nes-dark" },
    ],
    typography: [...FONT_ROWS, { label: "Title", value: "inherits, uppercase by convention" }],
    states: [
      { label: "default", render: () => <NesContainer title="Title">Content</NesContainer> },
      { label: "rounded", render: () => <NesContainer title="Title" rounded>Content</NesContainer> },
      { label: "dark", render: () => <NesContainer title="Title" dark>Content</NesContainer> },
      { label: "centered", render: () => <NesContainer title="Title" centered>Content</NesContainer> },
    ],
    accessibility: ["Renders a <section>; the title is a visual caption, so add a heading inside when the panel is a landmark."],
    props: [
      { name: "title", type: "string", defaultValue: "—", description: "Border caption." },
      { name: "dark / rounded / centered", type: "boolean", defaultValue: "false", description: "Visual modifiers." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesContainer title="LOGIN" rounded>…</NesContainer>`,
    example: () => <NesContainer title="LOGIN" rounded>Press start.</NesContainer>,
  },

  NesDialog: {
    name: "NesDialog",
    summary: "Native <dialog> styled as a pixel panel; buttons inside a method=dialog form close it.",
    anatomy: ["<dialog class=\"nes-dialog\">", "<form method=\"dialog\">", "title, body, menu of NesButtons"],
    spacing: [
      { label: "Padding", value: "1.5rem 2rem" },
      { label: "Border", value: "4px" },
      { label: "Button row gap", value: "8px" },
    ],
    colors: [
      { label: "fill", value: "surface", token: "--nes-bg" },
      { label: "backdrop", value: "ink at 60%", token: "--nes-dark" },
      { label: "dark fill", value: "ink", token: "--nes-dark" },
    ],
    typography: FONT_ROWS,
    states: [
      { label: "closed (inline preview)", note: "Open it from the Components page.", render: () => <NesContainer title="Dialog">Are you sure?</NesContainer> },
    ],
    accessibility: [
      "Uses showModal(): focus is trapped and Escape closes.",
      "Give the dialog aria-labelledby pointing to its title.",
      "Every button inside must submit the dialog form or call close().",
    ],
    props: [
      { name: "open", type: "boolean", defaultValue: "false", description: "Open on mount." },
      { name: "dark / rounded", type: "boolean", defaultValue: "false", description: "Visual modifiers." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesDialog ref={ref} title="Quit?">\n  <NesButton>Cancel</NesButton>\n  <NesButton variant="primary">Confirm</NesButton>\n</NesDialog>`,
    example: () => <NesDialog title="Quit?" className="hidden"><NesButton>Cancel</NesButton></NesDialog>,
  },

  NesField: {
    name: "NesField",
    summary: "Label + control wrapper that keeps the accessible name wired.",
    anatomy: ["<div class=\"nes-field\">", "<label for>", "control (children)"],
    spacing: [
      { label: "Label to control", value: "8px" },
      { label: "Field to next field", value: "16px" },
    ],
    colors: [{ label: "label text", value: "ink", token: "--nes-dark" }],
    typography: FONT_ROWS,
    states: [
      { label: "default", render: () => <NesField label="Name" htmlFor="sf1"><NesInput id="sf1" /></NesField> },
      { label: "inline", render: () => <NesField label="Name" htmlFor="sf2" inline><NesInput id="sf2" /></NesField> },
    ],
    accessibility: ["htmlFor must match the control id — this is the accessible name.", "Add a text message next to error states."],
    props: [
      { name: "label", type: "string", defaultValue: "—", description: "Visible label." },
      { name: "htmlFor", type: "string", defaultValue: "—", description: "Id of the control." },
      { name: "inline", type: "boolean", defaultValue: "false", description: "Label beside the control." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesField label="Player" htmlFor="name"><NesInput id="name" /></NesField>`,
    example: () => <NesField label="Player" htmlFor="sf3"><NesInput id="sf3" placeholder="ASH" /></NesField>,
  },

  NesInput: {
    name: "NesInput",
    summary: "Text input with a pixel frame and semantic validation variants.",
    anatomy: ["<input class=\"nes-input\">", "border-image frame", "focus outline"],
    spacing: [
      { label: "Padding", value: "0.5rem 1rem" },
      { label: "Border", value: "4px" },
      { label: "Focus outline", value: "4px, offset 0", token: "--nes-shadow" },
    ],
    colors: [
      { label: "fill", value: "surface", token: "--nes-bg" },
      { label: "border", value: "ink", token: "--nes-dark" },
      { label: "placeholder", value: "disabled grey", token: "--nes-disabled" },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: `${v} border`, value: v, token: `--nes-${v}` })),
    ],
    typography: FONT_ROWS,
    states: [
      { label: "default", render: () => <NesInput aria-label="d" defaultValue="Text" /> },
      { label: "focus-visible", render: () => <NesInput aria-label="f" className="force-focus" defaultValue="Text" /> },
      { label: "disabled", render: () => <NesInput aria-label="x" disabled defaultValue="Text" /> },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: v, render: () => <NesInput aria-label={v} variant={v} defaultValue="Text" /> })),
      { label: "dark", render: () => <NesInput aria-label="dk" dark defaultValue="Text" /> },
    ],
    accessibility: ["Always label with NesField or aria-label.", "error variant must come with a message; set aria-invalid too."],
    props: [
      { name: "variant", type: '"default" | "success" | "warning" | "error"', defaultValue: '"default"', description: "Validation color." },
      { name: "dark", type: "boolean", defaultValue: "false", description: "Inverted colors." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesInput id="name" variant="error" aria-invalid />`,
    example: () => <NesInput aria-label="Example" placeholder="ASH KETCHUM" />,
  },

  NesTextarea: {
    name: "NesTextarea",
    summary: "Multi-line sibling of NesInput with the same frame and variants.",
    anatomy: ["<textarea class=\"nes-textarea\">"],
    spacing: [
      { label: "Padding", value: "0.5rem 1rem" },
      { label: "Min height", value: "3 rows" },
    ],
    colors: [
      { label: "fill", value: "surface", token: "--nes-bg" },
      { label: "border", value: "ink", token: "--nes-dark" },
    ],
    typography: [...FONT_ROWS, { label: "Line height", value: "1.5" }],
    states: [
      { label: "default", render: () => <NesTextarea aria-label="t" defaultValue="Text" /> },
      { label: "focus-visible", render: () => <NesTextarea aria-label="tf" className="force-focus" defaultValue="Text" /> },
      { label: "disabled", render: () => <NesTextarea aria-label="td" disabled defaultValue="Text" /> },
    ],
    accessibility: ["Label it. Resizing is allowed vertically only."],
    props: [{ name: "dark", type: "boolean", defaultValue: "false", description: "Inverted colors." }, ...COMMON_PROPS],
    snippet: `<NesTextarea id="bio" rows={3} />`,
    example: () => <NesTextarea aria-label="bio" rows={3} placeholder="Say something…" />,
  },

  NesCheckbox: {
    name: "NesCheckbox",
    summary: "Checkbox drawn from pixel box-shadows, with the label baked in.",
    anatomy: ["<label>", "<input type=checkbox class=\"nes-checkbox\">", "<span> label"],
    spacing: [
      { label: "Box", value: "16px" },
      { label: "Label gap", value: "1.5rem left padding" },
    ],
    colors: [
      { label: "box / check", value: "ink", token: "--nes-dark" },
      { label: "dark variant", value: "surface", token: "--nes-bg" },
    ],
    typography: FONT_ROWS,
    states: [
      { label: "unchecked", render: () => <NesCheckbox label="Sound" /> },
      { label: "checked", render: () => <NesCheckbox label="Sound" defaultChecked /> },
      { label: "disabled", render: () => <NesCheckbox label="Sound" disabled /> },
      { label: "dark", render: () => <div className="nes-container is-dark"><NesCheckbox label="Sound" dark defaultChecked /></div> },
    ],
    accessibility: ["Native input inside a label — clicking the text toggles it.", "Focus is visible on the pixel box."],
    props: [{ name: "label", type: "string", defaultValue: "—", description: "Required visible label." }, { name: "dark", type: "boolean", defaultValue: "false", description: "Inverted." }, ...COMMON_PROPS],
    snippet: `<NesCheckbox label="Enable sound" defaultChecked />`,
    example: () => <NesCheckbox label="Enable sound" defaultChecked />,
  },

  NesRadio: {
    name: "NesRadio",
    summary: "Radio button with a pixel dot; group by name.",
    anatomy: ["<label>", "<input type=radio class=\"nes-radio\">", "<span> label"],
    spacing: [{ label: "Dot", value: "12px" }, { label: "Label gap", value: "1.5rem" }],
    colors: [{ label: "dot", value: "ink", token: "--nes-dark" }],
    typography: FONT_ROWS,
    states: [
      { label: "unchecked", render: () => <NesRadio name="s1" label="Easy" /> },
      { label: "checked", render: () => <NesRadio name="s2" label="Hard" defaultChecked /> },
      { label: "disabled", render: () => <NesRadio name="s3" label="Hard" disabled /> },
    ],
    accessibility: ["Wrap a set in a fieldset with a legend.", "Arrow keys move between radios natively."],
    props: [{ name: "label", type: "string", defaultValue: "—", description: "Visible label." }, { name: "name", type: "string", defaultValue: "—", description: "Group name." }, ...COMMON_PROPS],
    snippet: `<NesRadio name="difficulty" label="Hard" />`,
    example: () => <NesRadio name="d" label="Hard" defaultChecked />,
  },

  NesSelect: {
    name: "NesSelect",
    summary: "Native select wrapped in a pixel frame with a drawn arrow.",
    anatomy: ["<div class=\"nes-select\">", "<select>", "::after pixel arrow"],
    spacing: [{ label: "Padding", value: "0.5rem 3rem 0.5rem 1rem" }, { label: "Border", value: "4px" }],
    colors: [
      { label: "border / arrow", value: "ink", token: "--nes-dark" },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: `${v} border`, value: v, token: `--nes-${v}` })),
    ],
    typography: FONT_ROWS,
    states: [
      { label: "default", render: () => <NesSelect aria-label="s"><option>Mario</option></NesSelect> },
      { label: "disabled", render: () => <NesSelect aria-label="sd" disabled><option>Mario</option></NesSelect> },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: v, render: () => <NesSelect aria-label={v} variant={v}><option>Mario</option></NesSelect> })),
    ],
    accessibility: ["Native select: full keyboard and screen-reader support.", "Label with NesField."],
    props: [{ name: "variant", type: '"default" | "success" | "warning" | "error"', defaultValue: '"default"', description: "Border color." }, ...COMMON_PROPS],
    snippet: `<NesSelect id="hero"><option>Mario</option></NesSelect>`,
    example: () => <NesSelect aria-label="hero"><option>Mario</option><option>Luigi</option></NesSelect>,
  },

  NesList: {
    name: "NesList",
    summary: "Unordered list with pixel disc or circle markers.",
    anatomy: ["<ul class=\"nes-list is-disc|is-circle\">", "<li> ::before marker"],
    spacing: [{ label: "Item indent", value: "1.5rem" }, { label: "Item gap", value: "0.5em" }],
    colors: [{ label: "marker", value: "ink", token: "--nes-dark" }],
    typography: FONT_ROWS,
    states: [
      { label: "disc", render: () => <NesList marker="disc" items={["Sword", "Shield"]} /> },
      { label: "circle", render: () => <NesList marker="circle" items={["Sword", "Shield"]} /> },
    ],
    accessibility: ["Semantic <ul>/<li>; markers are decorative."],
    props: [{ name: "marker", type: '"disc" | "circle"', defaultValue: '"disc"', description: "Marker style." }, { name: "items", type: "ReactNode[]", defaultValue: "—", description: "List content." }, ...COMMON_PROPS],
    snippet: `<NesList marker="circle" items={["Sword", "Shield"]} />`,
    example: () => <NesList items={["Sword", "Shield", "Potion"]} />,
  },

  NesProgress: {
    name: "NesProgress",
    summary: "Native <progress> in a pixel frame with semantic fills.",
    anatomy: ["<progress class=\"nes-progress\">", "::-webkit-progress-value fill"],
    spacing: [{ label: "Height", value: "48px" }, { label: "Border", value: "4px" }],
    colors: [
      { label: "track", value: "surface", token: "--nes-bg" },
      { label: "default fill", value: "ink", token: "--nes-dark" },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: `${v} fill`, value: v, token: `--nes-${v}` })),
    ],
    typography: [{ label: "Text", value: "none — pair with a visible label" }],
    states: [
      { label: "default", render: () => <NesProgress value={40} max={100} /> },
      ...SEMANTIC_VARIANTS.map((v) => ({ label: v, render: () => <NesProgress value={70} max={100} variant={v} /> })),
      { label: "pattern", render: () => <NesProgress value={55} max={100} pattern /> },
    ],
    accessibility: ["Native progress exposes value/max.", "Add aria-label describing what is loading."],
    props: [
      { name: "value / max", type: "number", defaultValue: "— / 100", description: "Progress amount." },
      { name: "variant", type: '"default" | "primary" | "success" | "warning" | "error"', defaultValue: '"default"', description: "Fill color." },
      { name: "pattern", type: "boolean", defaultValue: "false", description: "Striped fill." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesProgress value={80} max={100} variant="success" aria-label="HP" />`,
    example: () => <NesProgress value={80} max={100} variant="success" aria-label="HP" />,
  },

  NesTable: {
    name: "NesTable",
    summary: "Bordered data table with pixel cell dividers.",
    anatomy: ["<div class=\"nes-table-responsive\">", "<table class=\"nes-table is-bordered\">", "thead / tbody"],
    spacing: [{ label: "Cell padding", value: "0.5rem" }, { label: "Border", value: "4px outer, 4px cell" }],
    colors: [
      { label: "border", value: "ink", token: "--nes-dark" },
      { label: "dark fill", value: "ink", token: "--nes-dark" },
    ],
    typography: [...FONT_ROWS, { label: "Head", value: "same size; uppercase by convention" }],
    states: [
      { label: "bordered", render: () => <NesTable headers={["Item", "Qty"]} rows={[["Potion", "3"]]} bordered /> },
      { label: "centered", render: () => <NesTable headers={["Item", "Qty"]} rows={[["Potion", "3"]]} bordered centered /> },
      { label: "dark", render: () => <NesTable headers={["Item", "Qty"]} rows={[["Potion", "3"]]} bordered dark /> },
    ],
    accessibility: ["Real <table> with <th> headers.", "Wrapper scrolls horizontally on narrow screens."],
    props: [
      { name: "headers / rows", type: "ReactNode[] / ReactNode[][]", defaultValue: "—", description: "Table data." },
      { name: "bordered / centered / dark", type: "boolean", defaultValue: "false", description: "Visual modifiers." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesTable headers={["Item", "Qty"]} rows={[["Potion", "3"]]} bordered />`,
    example: () => <NesTable headers={["Item", "Qty"]} rows={[["Potion", "3"], ["Ether", "1"]]} bordered />,
  },

  NesText: {
    name: "NesText",
    summary: "Inline text colored with a semantic token.",
    anatomy: ["<span class=\"nes-text is-{variant}\">"],
    spacing: [{ label: "None", value: "inline" }],
    colors: [
      ...SEMANTIC_VARIANTS.map((v) => ({ label: v, value: v, token: `--nes-${v}` })),
      { label: "disabled", value: "disabled grey", token: "--nes-disabled" },
    ],
    typography: FONT_ROWS,
    states: [
      ...SEMANTIC_VARIANTS.map((v) => ({ label: v, render: () => <NesText variant={v}>{v}</NesText> })),
      { label: "disabled", render: () => <NesText variant="disabled">disabled</NesText> },
    ],
    accessibility: ["Color carries no meaning on its own — pair with words or an icon."],
    props: [{ name: "variant", type: '"primary" | "success" | "warning" | "error" | "disabled"', defaultValue: '"primary"', description: "Text color." }, ...COMMON_PROPS],
    snippet: `<NesText variant="error">Game over</NesText>`,
    example: () => <NesText variant="error">Game over</NesText>,
  },

  NesAvatar: {
    name: "NesAvatar",
    summary: "Pixelated avatar image in four fixed sizes.",
    anatomy: ["<img class=\"nes-avatar is-{size}\">"],
    spacing: [
      { label: "small", value: "32px" },
      { label: "medium", value: "64px" },
      { label: "large", value: "96px" },
      { label: "Rounded", value: "pixel border-radius via class" },
    ],
    colors: [{ label: "None", value: "image rendering: pixelated" }],
    typography: [{ label: "None", value: "—" }],
    states: (["small", "medium", "large"] as const).map((s) => ({
      label: s,
      render: () => <NesAvatar src="https://api.dicebear.com/9.x/pixel-art/png?seed=Nes&size=96" alt="" size={s} />,
    })),
    accessibility: ["alt is required — empty only when purely decorative."],
    props: [{ name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', description: "Fixed pixel size." }, { name: "rounded", type: "boolean", defaultValue: "false", description: "Pixel-round crop." }, ...COMMON_PROPS],
    snippet: `<NesAvatar src={url} alt="Player 1" size="large" rounded />`,
    example: () => <NesAvatar src="https://api.dicebear.com/9.x/pixel-art/png?seed=Nes&size=96" alt="Player 1" size="large" rounded />,
  },

  NesIcon: {
    name: "NesIcon",
    summary: "Built-in NES icon set (hearts, stars, coins, social marks) drawn from box-shadows.",
    anatomy: ["<i class=\"nes-icon {name} is-{size}\" aria-hidden>", "::before pixel stack"],
    spacing: [
      { label: "small", value: "16px" },
      { label: "medium", value: "32px" },
      { label: "large", value: "48px" },
      { label: "Inline margin", value: "4px" },
    ],
    colors: [{ label: "Fixed", value: "each icon carries its own drawn palette" }],
    typography: [{ label: "None", value: "—" }],
    states: [
      { label: "small", render: () => <NesIcon name="heart" size="small" /> },
      { label: "medium", render: () => <NesIcon name="heart" size="medium" /> },
      { label: "large", render: () => <NesIcon name="heart" size="large" /> },
      { label: "empty", render: () => <NesIcon name="heart" empty /> },
    ],
    accessibility: ["aria-hidden by default; pass aria-label when the icon is the content."],
    props: [
      { name: "name", type: "NesIconName", defaultValue: "—", description: "Icon id." },
      { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', description: "Fixed size." },
      { name: "empty", type: "boolean", defaultValue: "false", description: "Outline variant (heart/star)." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesIcon name="star" size="small" aria-label="Favourite" />`,
    example: () => <NesIcon name="star" size="large" />,
  },

  NesPixelArt: {
    name: "NesPixelArt",
    summary: "Large pixel sprites (characters, devices, logos) at their drawn size.",
    anatomy: ["<i class=\"nes-{name}\" aria-hidden>", "::before pixel stack"],
    spacing: [{ label: "Size", value: "sprite-specific, 64–128px" }],
    colors: [{ label: "Fixed", value: "each sprite carries its own palette; themes do not recolor it" }],
    typography: [{ label: "None", value: "—" }],
    states: [
      { label: "mario", render: () => <NesPixelArt name="mario" /> },
      { label: "kirby", render: () => <NesPixelArt name="kirby" /> },
      { label: "pokeball", render: () => <NesPixelArt name="pokeball" /> },
    ],
    accessibility: ["Decorative by default; pass aria-label to make it an image."],
    props: [{ name: "name", type: "NesPixelArtName", defaultValue: "—", description: "Sprite id." }, ...COMMON_PROPS],
    snippet: `<NesPixelArt name="kirby" />`,
    example: () => <NesPixelArt name="kirby" />,
  },

  NesRuneIcon: {
    name: "NesRuneIcon",
    summary: "215 monochrome pixel glyphs that fill with currentColor.",
    anatomy: ["<svg class=\"nes-rune-icon\" shape-rendering=\"crispEdges\">", "<path fill=\"currentColor\">"],
    spacing: [
      { label: "small", value: "24px" },
      { label: "medium", value: "40px" },
      { label: "large", value: "64px" },
    ],
    colors: [{ label: "fill", value: "currentColor — color via NesText or a text class" }],
    typography: [{ label: "None", value: "—" }],
    states: [
      { label: "small", render: () => <NesRuneIcon name="star" size="small" /> },
      { label: "medium", render: () => <NesRuneIcon name="star" size="medium" /> },
      { label: "large", render: () => <NesRuneIcon name="star" size="large" /> },
      { label: "colored", render: () => <NesText variant="primary"><NesRuneIcon name="star" size="large" /></NesText> },
    ],
    accessibility: ["aria-hidden by default; pass aria-label when meaningful."],
    props: [
      { name: "name", type: "RuneIconName", defaultValue: "—", description: "Glyph id (see RUNE_ICONS)." },
      { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', description: "Fixed size." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesRuneIcon name="battery" size="small" />`,
    example: () => <NesRuneIcon name="battery" size="large" />,
  },

  NesPixelIcon: {
    name: "NesPixelIcon",
    summary: "Renders icons drawn in the Icon studio from grid data; palette colors or monochrome currentColor.",
    anatomy: ["<svg class=\"nes-pixel-icon\" shape-rendering=\"crispEdges\">", "<rect> per horizontal run"],
    spacing: [
      { label: "small", value: "24px" },
      { label: "medium", value: "40px" },
      { label: "large", value: "64px" },
    ],
    colors: [
      { label: "palette", value: "the theme tokens active when the icon was drawn" },
      { label: "monochrome", value: "currentColor" },
    ],
    typography: [{ label: "None", value: "—" }],
    states: [
      { label: "small", render: () => <NesPixelIcon icon={SAMPLE_PIXEL_ICON} size="small" /> },
      { label: "medium", render: () => <NesPixelIcon icon={SAMPLE_PIXEL_ICON} size="medium" /> },
      { label: "large", render: () => <NesPixelIcon icon={SAMPLE_PIXEL_ICON} size="large" /> },
      { label: "monochrome", render: () => <NesText variant="primary"><NesPixelIcon icon={SAMPLE_PIXEL_ICON} size="large" monochrome /></NesText> },
    ],
    accessibility: ["aria-hidden by default; pass aria-label when meaningful."],
    props: [
      { name: "icon", type: "PixelIconData", defaultValue: "—", description: "Grid + palette from the studio export." },
      { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', description: "Fixed size." },
      { name: "monochrome", type: "boolean", defaultValue: "false", description: "Ignore the palette and use currentColor." },
      ...COMMON_PROPS,
    ],
    snippet: `<NesPixelIcon icon={potionIcon} size="medium" />`,
    example: () => <NesPixelIcon icon={SAMPLE_PIXEL_ICON} size="large" />,
  },
};

export const SPEC_NAMES = Object.keys(COMPONENT_SPECS);
