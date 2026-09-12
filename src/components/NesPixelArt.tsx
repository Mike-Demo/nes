import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../lib/utils";

export type NesPixelArtName =
  | "mario"
  | "kirby"
  | "ash"
  | "pokeball"
  | "bulbasaur"
  | "charmander"
  | "squirtle"
  | "octocat"
  | "bcrikko"
  | "phone"
  | "smartphone"
  | "nes-icon"
  | "jp-icon"
  | "logo"
  | "jp-logo";

export interface NesPixelArtProps extends HTMLAttributes<HTMLElement> {
  /** Which sprite to render. */
  name: NesPixelArtName;
}

/**
 * Pre-drawn pixel-art sprite. Decorative by default — pass aria-label when
 * the sprite carries meaning.
 */
export const NesPixelArt = forwardRef<HTMLElement, NesPixelArtProps>(function NesPixelArt(
  { name, className, ...props },
  ref,
) {
  const cls = name === "nes-icon" || name === "jp-icon" || name === "logo" || name === "jp-logo" ? `nes-${name}` : `nes-${name}`;
  return (
    <i
      ref={ref}
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn(cls, className)}
      {...props}
    />
  );
});
