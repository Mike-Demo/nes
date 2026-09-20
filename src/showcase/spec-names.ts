/**
 * Single source of truth for the component spec pages. The showcase renders
 * from this list and the build prerenders one HTML file per entry, so both
 * stay in step.
 */
export const SPEC_PAGE_NAMES = [
  "NesButton",
  "NesBadge",
  "NesBalloon",
  "NesContainer",
  "NesDialog",
  "NesField",
  "NesInput",
  "NesTextarea",
  "NesCheckbox",
  "NesRadio",
  "NesSelect",
  "NesList",
  "NesProgress",
  "NesTable",
  "NesText",
  "NesAvatar",
  "NesIcon",
  "NesPixelArt",
  "NesRuneIcon",
  "NesPixelIcon",
] as const;

/** Every public, non-parameterized page of the showcase. */
export const STATIC_PAGE_PATHS: readonly string[] = [
  "/",
  "/accessibility",
  "/auth",
  "/colors",
  "/components",
  "/icons",
  "/lovable",
  "/specs",
  "/studio",
  "/typography",
  ...SPEC_PAGE_NAMES.map((name) => `/specs/${name}`),
];
