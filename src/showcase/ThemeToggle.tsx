import { NesButton } from "@/components/NesButton";

import { NES_THEMES, useNesTheme, type NesTheme } from "./theme";

const LABELS: Record<NesTheme, string> = {
  retro: "NES retro",
  fresh: "Fresh",
};

export function ThemeToggle() {
  const [theme, setTheme] = useNesTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Palette">
      <span className="theme-toggle-label">PALETTE</span>
      {NES_THEMES.map((option) => (
        <NesButton
          key={option}
          type="button"
          variant={theme === option ? "primary" : "default"}
          aria-pressed={theme === option}
          onClick={() => setTheme(option)}
        >
          {LABELS[option]}
        </NesButton>
      ))}
    </div>
  );
}
