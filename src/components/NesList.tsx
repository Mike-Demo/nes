import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../lib/utils";

export interface NesListProps extends HTMLAttributes<HTMLUListElement> {
  /** Bullet shape. */
  variant?: "disc" | "circle";
}

/** Retro bulleted list; pass <li> elements as children. */
export const NesList = forwardRef<HTMLUListElement, NesListProps>(function NesList(
  { variant = "disc", className, ...props },
  ref,
) {
  return <ul ref={ref} className={cn("nes-list", `is-${variant}`, className)} {...props} />;
});
