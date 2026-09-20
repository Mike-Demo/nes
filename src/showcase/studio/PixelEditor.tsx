import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { NesButton } from "@/components/NesButton";
import { NesContainer } from "@/components/NesContainer";
import { NesField } from "@/components/NesField";
import { NesIcon, type NesIconName } from "@/components/NesIcon";
import { NesInput } from "@/components/NesInput";
import { NesPixelIcon } from "@/components/NesPixelIcon";
import { NesRuneIcon } from "@/components/NesRuneIcon";
import { NesSelect } from "@/components/NesSelect";
import { NesText } from "@/components/NesText";
import { RUNE_ICONS, type RuneIconName } from "@/components/runes";
import {
  TRANSPARENT,
  createEmptyGrid,
  isPixelGridSize,
  pixelIconToSvg,
  type PixelGridSize,
  type PixelIconData,
} from "@/components/pixel-icon";

import { useNesTheme } from "../../lib/theme";
import { rasterizeToGrid, streamPixelIcon } from "./generate";
import { boxShadowToGrid, compactPalette, floodFill, isGridEmpty, paintCell, resizeGrid, type Grid } from "./grid";
import { readThemePalette, type PaletteEntry } from "./palette";
import { savePixelIcon, type SavedPixelIcon } from "./pixel-icons.service";
import { useAuthUser } from "./useAuthUser";

type Tool = "pencil" | "eraser" | "fill";

const TOOLS: ReadonlyArray<{ id: Tool; label: string }> = [
  { id: "pencil", label: "Pencil (P)" },
  { id: "eraser", label: "Eraser (E)" },
  { id: "fill", label: "Fill (F)" },
];

const NES_ICON_SOURCES: NesIconName[] = ["heart", "star", "coin", "trophy", "close", "like", "github", "twitter"];
const RUNE_SOURCES: RuneIconName[] = (Object.keys(RUNE_ICONS) as RuneIconName[]).slice(0, 48);
const MAX_HISTORY = 60;

interface History {
  past: Grid[];
  present: Grid;
  future: Grid[];
}

interface PixelEditorProps {
  onSaved?: (icon: SavedPixelIcon) => void;
}

export function PixelEditor({ onSaved }: PixelEditorProps) {
  const [theme] = useNesTheme();
  const palette = useMemo<PaletteEntry[]>(() => readThemePalette(), [theme]);
  const paletteHex = useMemo(() => palette.map((p) => p.hex), [palette]);

  const [size, setSize] = useState<PixelGridSize>(16);
  const [history, setHistory] = useState<History>({ past: [], present: createEmptyGrid(16), future: [] });
  const [tool, setTool] = useState<Tool>("pencil");
  const [colorIndex, setColorIndex] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiPreview, setAiPreview] = useState<{ src: string; isFinal: boolean } | null>(null);
  const [busy, setBusy] = useState<"idle" | "generating" | "saving">("idle");
  const [status, setStatus] = useState<{ text: string; tone: "info" | "error" } | null>(null);

  const drawing = useRef(false);
  const sampleRef = useRef<HTMLElement>(null);
  const { user, loading: authLoading } = useAuthUser();

  const grid = history.present;

  const commit = useCallback((next: Grid) => {
    setHistory((h) => {
      if (next === h.present) return h;
      return { past: [...h.past.slice(-MAX_HISTORY), h.present], present: next, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      const previous = h.past.at(-1);
      if (!previous) return h;
      return { past: h.past.slice(0, -1), present: previous, future: [h.present, ...h.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      const [next, ...rest] = h.future;
      if (!next) return h;
      return { past: [...h.past, h.present], present: next, future: rest };
    });
  }, []);

  const applyTool = useCallback(
    (x: number, y: number, current: Grid): Grid => {
      if (tool === "fill") return floodFill(current, x, y, colorIndex);
      return paintCell(current, x, y, tool === "eraser" ? TRANSPARENT : colorIndex);
    },
    [tool, colorIndex],
  );

  const cellFromPointer = (event: PointerEvent<HTMLDivElement>): { x: number; y: number } | null => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * size);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * size);
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return { x, y };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const cell = cellFromPointer(event);
    if (!cell) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    setCursor(cell);
    commit(applyTool(cell.x, cell.y, grid));
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drawing.current || tool === "fill") return;
    const cell = cellFromPointer(event);
    if (!cell) return;
    setCursor(cell);
    // Strokes merge into the stroke's first history entry.
    setHistory((h) => ({ ...h, present: applyTool(cell.x, cell.y, h.present) }));
  };

  const endStroke = () => {
    drawing.current = false;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      setCursor((c) => ({
        x: Math.min(size - 1, Math.max(0, c.x + move[0])),
        y: Math.min(size - 1, Math.max(0, c.y + move[1])),
      }));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(applyTool(cursor.x, cursor.y, grid));
      return;
    }
    if (event.key.toLowerCase() === "p") setTool("pencil");
    if (event.key.toLowerCase() === "e") setTool("eraser");
    if (event.key.toLowerCase() === "f") setTool("fill");
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }
  };

  const changeSize = (next: PixelGridSize) => {
    setSize(next);
    setCursor({ x: 0, y: 0 });
    commit(resizeGrid(grid, next));
  };

  const clear = () => commit(createEmptyGrid(size));

  const loadNesIcon = (iconName: NesIconName) => {
    const host = sampleRef.current;
    if (!host) return;
    host.className = `studio-sample nes-icon ${iconName}`;
    const before = getComputedStyle(host, "::before");
    const unit = Number.parseFloat(before.width) || 1;
    const next = boxShadowToGrid(before.boxShadow, unit, 16, paletteHex);
    if (isGridEmpty(next)) {
      setStatus({ text: `Could not read the ${iconName} sprite.`, tone: "error" });
      return;
    }
    if (size !== 16) setSize(16);
    commit(next);
    setStatus({ text: `Loaded NES icon "${iconName}".`, tone: "info" });
  };

  const loadRune = async (runeName: RuneIconName) => {
    const icon = RUNE_ICONS[runeName];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}">${icon.paths
      .map((d) => `<path d="${d}" fill="${paletteHex[0]}"/>`)
      .join("")}</svg>`;
    const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    try {
      const next = await rasterizeToGrid(src, size, paletteHex, { dropWhite: false });
      commit(next);
      setStatus({ text: `Loaded rune "${runeName}".`, tone: "info" });
    } catch (error) {
      setStatus({ text: error instanceof Error ? error.message : "Could not load the rune.", tone: "error" });
    }
  };

  const generate = async () => {
    if (prompt.trim().length < 2) {
      setStatus({ text: "Describe the icon first.", tone: "error" });
      return;
    }
    setBusy("generating");
    setStatus({ text: "Generating… this can take a little while.", tone: "info" });
    setAiPreview(null);
    try {
      let finalSrc: string | null = null;
      await streamPixelIcon(prompt.trim(), size, (src, isFinal) => {
        setAiPreview({ src, isFinal });
        if (isFinal) finalSrc = src;
      });
      if (!finalSrc) throw new Error("The AI returned no image");
      const next = await rasterizeToGrid(finalSrc, size, paletteHex);
      commit(next);
      setStatus({ text: "Snapped the AI image onto the grid. Touch it up and save.", tone: "info" });
    } catch (error) {
      setStatus({ text: error instanceof Error ? error.message : "Generation failed.", tone: "error" });
    } finally {
      setBusy("idle");
    }
  };

  const currentIcon = useMemo<PixelIconData>(() => {
    const compact = compactPalette(grid, paletteHex);
    return { size, palette: compact.palette, pixels: compact.pixels };
  }, [grid, paletteHex, size]);

  const exportSvg = async () => {
    const svg = pixelIconToSvg(currentIcon);
    await navigator.clipboard.writeText(svg);
    setStatus({ text: "SVG copied to the clipboard.", tone: "info" });
  };

  const exportCode = async () => {
    const code = `const icon = ${JSON.stringify(currentIcon)};\n<NesPixelIcon icon={icon} size="medium" />`;
    await navigator.clipboard.writeText(code);
    setStatus({ text: "Component snippet copied to the clipboard.", tone: "info" });
  };

  const save = async () => {
    if (!user) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setStatus({ text: "Give the icon a name before saving.", tone: "error" });
      return;
    }
    if (isGridEmpty(grid)) {
      setStatus({ text: "The canvas is empty.", tone: "error" });
      return;
    }
    setBusy("saving");
    try {
      const saved = await savePixelIcon({ name: trimmed, icon: currentIcon, ownerId: user.id });
      setStatus({ text: `Saved "${saved.name}". It is now on the Iconography page.`, tone: "info" });
      setName("");
      onSaved?.(saved);
    } catch (error) {
      setStatus({ text: error instanceof Error ? error.message : "Saving failed.", tone: "error" });
    } finally {
      setBusy("idle");
    }
  };

  useEffect(() => {
    if (colorIndex >= palette.length) setColorIndex(0);
  }, [palette.length, colorIndex]);

  const cells = useMemo(() => {
    const list: Array<{ x: number; y: number; fill: string | null }> = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = grid[y]?.[x] ?? TRANSPARENT;
        list.push({ x, y, fill: index === TRANSPARENT ? null : (paletteHex[index] ?? null) });
      }
    }
    return list;
  }, [grid, paletteHex, size]);

  return (
    <div className="studio-layout">
      <div>
        <div className="studio-tools" role="toolbar" aria-label="Drawing tools">
          {TOOLS.map((t) => (
            <NesButton key={t.id} variant={tool === t.id ? "primary" : "default"} aria-pressed={tool === t.id} onClick={() => setTool(t.id)}>
              {t.label}
            </NesButton>
          ))}
          <NesButton onClick={undo} disabled={history.past.length === 0}>Undo</NesButton>
          <NesButton onClick={redo} disabled={history.future.length === 0}>Redo</NesButton>
          <NesButton variant="error" onClick={clear}>Clear</NesButton>
        </div>

        <div
          className="studio-canvas"
          role="grid"
          tabIndex={0}
          aria-label={`Pixel canvas, ${size} by ${size}. Arrow keys move, Enter paints.`}
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onKeyDown={onKeyDown}
        >
          {Array.from({ length: size }, (_, y) => (
            <div key={`row-${y}`} role="row" className="studio-row">
              {cells
                .filter((cell) => cell.y === y)
                .map((cell) => (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    role="gridcell"
                    aria-selected={cursor.x === cell.x && cursor.y === cell.y}
                    className="studio-cell"
                    style={{
                      backgroundColor: cell.fill ?? "transparent",
                      outline: cursor.x === cell.x && cursor.y === cell.y ? "2px solid var(--nes-primary)" : undefined,
                    }}
                  />
                ))}
            </div>
          ))}
        </div>
        <span className="showcase-caption">
          Cursor {cursor.x},{cursor.y} · Tool: {tool} · Shortcuts: P / E / F, Ctrl+Z, Ctrl+Shift+Z
        </span>

        <div className="showcase-section mt-8">
          <h3>Preview</h3>
          <div className="studio-preview-row">
            <div className="specimen is-centered">
              <NesPixelIcon icon={currentIcon} size="small" />
              <span className="showcase-caption">small</span>
            </div>
            <div className="specimen is-centered">
              <NesPixelIcon icon={currentIcon} size="medium" />
              <span className="showcase-caption">medium</span>
            </div>
            <div className="specimen is-centered">
              <NesPixelIcon icon={currentIcon} size="large" />
              <span className="showcase-caption">large</span>
            </div>
            <div className="specimen is-centered">
              <NesText variant="primary">
                <NesPixelIcon icon={currentIcon} size="large" monochrome />
              </NesText>
              <span className="showcase-caption">monochrome</span>
            </div>
          </div>
        </div>
      </div>

      <aside className="studio-panel">
        <NesContainer title="Palette">
          <div className="studio-palette" role="radiogroup" aria-label="Palette">
            {palette.map((entry, index) => (
              <button
                key={entry.token}
                type="button"
                role="radio"
                aria-checked={colorIndex === index}
                aria-label={entry.label}
                title={`${entry.label} (${entry.token})`}
                className={`studio-swatch${colorIndex === index ? " is-active" : ""}`}
                style={{ backgroundColor: entry.hex }}
                onClick={() => {
                  setColorIndex(index);
                  if (tool === "eraser") setTool("pencil");
                }}
              />
            ))}
          </div>
          <span className="showcase-caption">{palette[colorIndex]?.label} · follows the active theme</span>
        </NesContainer>

        <NesContainer title="Canvas">
          <NesField label="Grid size" htmlFor="grid-size">
            <NesSelect
              id="grid-size"
              value={size}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (isPixelGridSize(next)) changeSize(next);
              }}
            >
              <option value={8}>8 x 8</option>
              <option value={16}>16 x 16</option>
              <option value={32}>32 x 32</option>
            </NesSelect>
          </NesField>
        </NesContainer>

        <NesContainer title="Start from">
          <span className="showcase-caption">NES icons (16 x 16)</span>
          <div className="studio-source-grid">
            {NES_ICON_SOURCES.map((iconName) => (
              <NesButton key={iconName} aria-label={`Load ${iconName}`} onClick={() => loadNesIcon(iconName)}>
                <NesIcon name={iconName} size="small" />
              </NesButton>
            ))}
          </div>
          <span className="showcase-caption">Rune icons</span>
          <div className="studio-source-grid">
            {RUNE_SOURCES.map((runeName) => (
              <NesButton key={runeName} aria-label={`Load ${runeName}`} onClick={() => void loadRune(runeName)}>
                <NesRuneIcon name={runeName} size="small" />
              </NesButton>
            ))}
          </div>
          <i ref={sampleRef} aria-hidden className="studio-sample" />
        </NesContainer>

        <NesContainer title="AI generate">
          <NesField label="Describe it" htmlFor="ai-prompt">
            <NesInput
              id="ai-prompt"
              placeholder="a red potion bottle"
              value={prompt}
              maxLength={200}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </NesField>
          <div className="studio-preview-row mt-4">
            <NesButton variant="primary" onClick={() => void generate()} disabled={busy !== "idle"}>
              {busy === "generating" ? "Working…" : "Generate"}
            </NesButton>
            {aiPreview ? (
              <img
                src={aiPreview.src}
                alt="AI render before snapping to the grid"
                className={`studio-ai-preview${aiPreview.isFinal ? "" : " is-partial"}`}
              />
            ) : null}
          </div>
        </NesContainer>

        <NesContainer title="Save">
          {authLoading ? (
            <span className="showcase-caption">Checking sign-in…</span>
          ) : user ? (
            <>
              <NesField label="Icon name" htmlFor="icon-name">
                <NesInput id="icon-name" value={name} maxLength={40} placeholder="potion" onChange={(e) => setName(e.target.value)} />
              </NesField>
              <div className="studio-tools mt-4">
                <NesButton variant="success" onClick={() => void save()} disabled={busy !== "idle"}>
                  {busy === "saving" ? "Saving…" : "Save to gallery"}
                </NesButton>
              </div>
            </>
          ) : (
            <p className="studio-status">
              <Link to="/auth" search={{ next: "/studio" }} className="spec-link">Sign in</Link> to save icons to the
              gallery. Exporting works without an account.
            </p>
          )}
          <div className="studio-tools mt-4">
            <NesButton onClick={() => void exportSvg()}>Copy SVG</NesButton>
            <NesButton onClick={() => void exportCode()}>Copy code</NesButton>
          </div>
          {status ? (
            <p className={`studio-status mt-4${status.tone === "error" ? " is-error" : ""}`} role="status">
              {status.text}
            </p>
          ) : null}
        </NesContainer>
      </aside>
    </div>
  );
}
