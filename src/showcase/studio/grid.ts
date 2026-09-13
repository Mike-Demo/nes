import {
  TRANSPARENT,
  createEmptyGrid,
  type PixelGridSize,
  type PixelIconData,
} from "@/components/pixel-icon";

export type Grid = number[][];

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function paintCell(grid: Grid, x: number, y: number, value: number): Grid {
  if (grid[y]?.[x] === undefined || grid[y][x] === value) return grid;
  const next = cloneGrid(grid);
  next[y][x] = value;
  return next;
}

/** 4-way flood fill from (x, y), replacing the contiguous region's value. */
export function floodFill(grid: Grid, x: number, y: number, value: number): Grid {
  const target = grid[y]?.[x];
  if (target === undefined || target === value) return grid;
  const next = cloneGrid(grid);
  const size = grid.length;
  const stack: Array<[number, number]> = [[x, y]];
  while (stack.length > 0) {
    const [cx, cy] = stack.pop() as [number, number];
    if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
    if (next[cy][cx] !== target) continue;
    next[cy][cx] = value;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
  return next;
}

/** Resamples a grid to a new size using nearest-neighbour, keeping content top-left aligned when growing. */
export function resizeGrid(grid: Grid, size: PixelGridSize): Grid {
  const from = grid.length;
  const next = createEmptyGrid(size);
  if (from === 0) return next;
  if (size >= from) {
    const scale = Math.floor(size / from);
    for (let y = 0; y < from; y += 1) {
      for (let x = 0; x < from; x += 1) {
        for (let dy = 0; dy < scale; dy += 1) {
          for (let dx = 0; dx < scale; dx += 1) {
            next[y * scale + dy][x * scale + dx] = grid[y][x];
          }
        }
      }
    }
    return next;
  }
  const step = from / size;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      next[y][x] = grid[Math.floor(y * step)][Math.floor(x * step)];
    }
  }
  return next;
}

export function isGridEmpty(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell === TRANSPARENT));
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = Number.parseInt(match[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Parses "rgb(1, 2, 3)" / "rgba(1, 2, 3, 0.5)" / hex into RGB (null when transparent or invalid). */
export function parseCssColor(value: string): Rgb | null {
  const hex = hexToRgb(value);
  if (hex) return hex;
  const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(value);
  if (!match) return null;
  if (match[4] !== undefined && Number.parseFloat(match[4]) < 0.5) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function distance(a: Rgb, b: Rgb): number {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

/** Index of the palette color nearest to `color` (palette entries must be hex). */
export function nearestPaletteIndex(color: Rgb, palette: readonly string[]): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  palette.forEach((entry, index) => {
    const rgb = hexToRgb(entry);
    if (!rgb) return;
    const d = distance(color, rgb);
    if (d < bestDistance) {
      bestDistance = d;
      best = index;
    }
  });
  return best;
}

/**
 * Downsamples RGBA pixel data (width × height) onto a `size × size` grid,
 * snapping every cell to the nearest palette color. Cells that are mostly
 * transparent, or mostly near-white when `dropWhite` is set (AI renders on a
 * white background), stay transparent.
 */
export function quantizeImage(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  size: PixelGridSize,
  palette: readonly string[],
  dropWhite = true,
): Grid {
  const grid = createEmptyGrid(size);
  const cellW = width / size;
  const cellH = height / size;
  for (let gy = 0; gy < size; gy += 1) {
    for (let gx = 0; gx < size; gx += 1) {
      const x0 = Math.floor(gx * cellW);
      const y0 = Math.floor(gy * cellH);
      const x1 = Math.max(x0 + 1, Math.floor((gx + 1) * cellW));
      const y1 = Math.max(y0 + 1, Math.floor((gy + 1) * cellH));
      let r = 0;
      let g = 0;
      let b = 0;
      let opaque = 0;
      let total = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          const i = (y * width + x) * 4;
          total += 1;
          if (data[i + 3] < 128) continue;
          if (dropWhite && data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) continue;
          opaque += 1;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
      }
      if (opaque === 0 || opaque / total < 0.5) continue;
      grid[gy][gx] = nearestPaletteIndex(
        { r: Math.round(r / opaque), g: Math.round(g / opaque), b: Math.round(b / opaque) },
        palette,
      );
    }
  }
  return grid;
}

/**
 * Parses a NES.css pixel-art `box-shadow` list ("rgb(68, 68, 68) 3px 2px 0px 0px, …")
 * into a grid. `unit` is the size of one drawn pixel in CSS px.
 */
export function boxShadowToGrid(
  boxShadow: string,
  unit: number,
  size: PixelGridSize,
  palette: readonly string[],
): Grid {
  const grid = createEmptyGrid(size);
  if (!boxShadow || boxShadow === "none" || unit <= 0) return grid;
  const entries = boxShadow.match(/(rgba?\([^)]*\)|#[0-9a-f]{3,8})\s+(-?[\d.]+)px\s+(-?[\d.]+)px/gi) ?? [];
  for (const entry of entries) {
    const match = /(rgba?\([^)]*\)|#[0-9a-f]{3,8})\s+(-?[\d.]+)px\s+(-?[\d.]+)px/i.exec(entry);
    if (!match) continue;
    const color = parseCssColor(match[1]);
    if (!color) continue;
    const x = Math.round(Number(match[2]) / unit) - 1;
    const y = Math.round(Number(match[3]) / unit) - 1;
    if (x < 0 || y < 0 || x >= size || y >= size) continue;
    grid[y][x] = nearestPaletteIndex(color, palette);
  }
  return grid;
}

/** Palette indexes actually used by a grid, so saved icons only store what they need. */
export function compactPalette(grid: Grid, palette: readonly string[]): Pick<PixelIconData, "palette" | "pixels"> {
  const used = new Map<number, number>();
  const next: string[] = [];
  const pixels = grid.map((row) =>
    row.map((cell) => {
      if (cell === TRANSPARENT || palette[cell] === undefined) return TRANSPARENT;
      let mapped = used.get(cell);
      if (mapped === undefined) {
        mapped = next.length;
        next.push(palette[cell]);
        used.set(cell, mapped);
      }
      return mapped;
    }),
  );
  return { palette: next, pixels };
}
