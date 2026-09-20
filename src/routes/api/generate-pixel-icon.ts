import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  prompt: z.string().trim().min(2).max(200),
  size: z.union([z.literal(8), z.literal(16), z.literal(32)]),
  stream: z.boolean().optional(),
});

function buildPrompt(subject: string, size: number): string {
  return [
    `Design a single retro 8-bit NES-style pixel art icon of: ${subject}.`,
    `Compose it on a strict ${size}x${size} pixel grid, scaled up so each pixel is a large flat square.`,
    "Use at most 6 flat colors, bold dark outlines, no anti-aliasing, no gradients, no shading, no text.",
    "Center the icon and fill most of the canvas. Plain solid white background, nothing else in frame.",
  ].join(" ");
}

export const Route = createFileRoute("/api/generate-pixel-icon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = BodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return new Response("Invalid request", { status: 400 });
        }
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const { prompt, size, stream = true } = parsed.data;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [{ role: "user", content: buildPrompt(prompt, size) }],
            modalities: ["image", "text"],
            ...(stream ? { stream: true } : {}),
          }),
        });

        if (!upstream.ok || !upstream.body) {
          return new Response(await upstream.text(), { status: upstream.status });
        }
        if (!stream) {
          return new Response(upstream.body, { headers: { "Content-Type": "application/json" } });
        }
        return new Response(upstream.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
