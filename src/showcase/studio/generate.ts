import { createParser } from "eventsource-parser";

import type { PixelGridSize } from "@/components/pixel-icon";

import { quantizeImage, type Grid } from "./grid";

interface ImageEventPayload {
  type?: string;
  b64_json?: string;
  error?: { message?: string };
}

const IMAGE_EVENTS = new Set([
  "image_generation.partial_image",
  "image_generation.completed",
  "image_edit.partial_image",
  "image_edit.completed",
]);

/**
 * Streams an AI-generated pixel icon from the app's server route. Every
 * frame is delivered as a data URL; `isFinal` flips on the completed event.
 */
export async function streamPixelIcon(
  prompt: string,
  size: PixelGridSize,
  onFrame: (dataUrl: string, isFinal: boolean) => void,
): Promise<void> {
  const res = await fetch("/api/generate-pixel-icon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, size }),
  });
  if (!res.ok || !res.body) {
    throw new Error(await describeFailure(res));
  }
  // On a static deployment there is no server route: the catch-all rule answers
  // with the app shell instead of a stream. Say so rather than failing obscurely.
  if (res.headers.get("Content-Type")?.includes("text/html")) {
    throw new Error(AI_UNAVAILABLE);
  }

  let sawAnyEvent = false;
  let sawCompleted = false;
  let streamError: string | undefined;

  const parser = createParser({
    onEvent(event) {
      let payload: ImageEventPayload | undefined;
      try {
        payload = JSON.parse(event.data) as ImageEventPayload;
      } catch {
        payload = undefined;
      }
      if (event.event === "error" || payload?.type === "error") {
        sawAnyEvent = true;
        streamError = payload?.error?.message ?? "Image generation failed";
        return;
      }
      if (!event.event || !IMAGE_EVENTS.has(event.event) || !payload?.b64_json) return;
      sawAnyEvent = true;
      const isFinal = event.event.endsWith(".completed");
      onFrame(`data:image/png;base64,${payload.b64_json}`, isFinal);
      if (isFinal) sawCompleted = true;
    },
  });

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.feed(value);
    }
  } finally {
    reader.cancel().catch(() => undefined);
  }

  if (streamError) throw new Error(streamError);
  if (!sawAnyEvent) {
    const replay = await fetch("/api/generate-pixel-icon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, size, stream: false }),
    });
    if (!replay.ok) throw new Error(await describeFailure(replay));
    const json = (await replay.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error("The AI returned no image");
    onFrame(`data:image/png;base64,${b64}`, true);
    return;
  }
  if (!sawCompleted) throw new Error("Image stream ended before the icon finished");
}

const AI_UNAVAILABLE =
  "AI generation runs on a server, so it is only available in the Lovable preview — drawing, saving and loading icons work everywhere.";

async function describeFailure(res: Response): Promise<string> {
  if (res.status === 404 || res.status === 405) return AI_UNAVAILABLE;
  const text = await res.text().catch(() => "");
  if (res.status === 402) return "AI credits are used up — add credits to your workspace to keep generating.";
  if (res.status === 429) return "The AI is busy right now. Wait a moment and try again.";
  if (res.status === 403) return "AI generation is disabled for this workspace.";
  return text || `Generation failed (${res.status})`;
}

/** Draws an image onto a canvas and snaps it onto the pixel grid. */
export async function rasterizeToGrid(
  src: string,
  size: PixelGridSize,
  palette: readonly string[],
  options: { dropWhite?: boolean; sampleScale?: number } = {},
): Promise<Grid> {
  const image = await loadImage(src);
  const sampleScale = options.sampleScale ?? 8;
  const edge = size * sampleScale;
  const canvas = document.createElement("canvas");
  canvas.width = edge;
  canvas.height = edge;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser");
  ctx.imageSmoothingEnabled = false;
  // Square-crop the source before sampling so the icon is not squashed.
  const min = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - min) / 2;
  const sy = (image.naturalHeight - min) / 2;
  ctx.drawImage(image, sx, sy, min, min, 0, 0, edge, edge);
  const { data } = ctx.getImageData(0, 0, edge, edge);
  return quantizeImage(data, edge, edge, size, palette, options.dropWhite ?? true);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the image"));
    image.src = src;
  });
}
