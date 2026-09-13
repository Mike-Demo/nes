export interface PaletteEntry {
  token: string;
  label: string;
  hex: string;
}

const TOKEN_ENTRIES: ReadonlyArray<{ token: string; label: string; fallback: string }> = [
  { token: "--nes-dark", label: "Ink", fallback: "#212529" },
  { token: "--nes-primary", label: "Primary", fallback: "#209cee" },
  { token: "--nes-primary-shadow", label: "Primary shade", fallback: "#006bb3" },
  { token: "--nes-success", label: "Success", fallback: "#92cc41" },
  { token: "--nes-success-shadow", label: "Success shade", fallback: "#4aa52e" },
  { token: "--nes-warning", label: "Warning", fallback: "#f7d51d" },
  { token: "--nes-warning-shadow", label: "Warning shade", fallback: "#e59400" },
  { token: "--nes-error", label: "Error", fallback: "#e76e55" },
  { token: "--nes-error-shadow", label: "Error shade", fallback: "#8c2022" },
  { token: "--nes-shadow", label: "Shadow", fallback: "#adafbc" },
  { token: "--nes-disabled", label: "Disabled", fallback: "#d3d3d3" },
  { token: "--nes-bg", label: "Background", fallback: "#ffffff" },
];

/** The studio palette: every semantic token of the active theme plus pure black. */
export function readThemePalette(): PaletteEntry[] {
  const styles = typeof window === "undefined" ? null : getComputedStyle(document.documentElement);
  const entries = TOKEN_ENTRIES.map(({ token, label, fallback }) => {
    const value = styles?.getPropertyValue(token).trim();
    return { token, label, hex: value && /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : fallback };
  });
  return [...entries, { token: "black", label: "Black", hex: "#000000" }];
}
