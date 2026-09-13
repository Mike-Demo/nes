import { useEffect, useMemo, useState, type ReactNode } from "react";

import { NesButton } from "@/components/NesButton";
import { NesIcon, type NesIconName } from "@/components/NesIcon";
import { NesInput } from "@/components/NesInput";
import { NesPixelArt, type NesPixelArtName } from "@/components/NesPixelArt";
import { NesPixelIcon } from "@/components/NesPixelIcon";
import { NesRuneIcon } from "@/components/NesRuneIcon";
import { RUNE_ICONS, type RuneIconName } from "@/components/runes";

import { deletePixelIcon, listPixelIcons, type SavedPixelIcon } from "./studio/pixel-icons.service";
import { useAuthUser } from "./studio/useAuthUser";

export type IconSet = "nes" | "sprite" | "rune" | "custom";
type Tab = "all" | IconSet;

export interface GalleryItem {
  key: string;
  set: IconSet;
  name: string;
  category?: string;
  snippet: string;
  render: () => ReactNode;
  savedId?: string;
  ownerId?: string;
}

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "all", label: "All" },
  { id: "nes", label: "NES" },
  { id: "sprite", label: "Sprites" },
  { id: "rune", label: "Runes" },
  { id: "custom", label: "Custom" },
];

const NES_ICONS: NesIconName[] = [
  "heart", "star", "coin", "trophy", "close", "like",
  "twitter", "facebook", "github", "google", "gmail", "medium",
  "linkedin", "instagram", "whatsapp", "youtube", "reddit", "twitch",
];

const SPRITES: NesPixelArtName[] = [
  "mario", "kirby", "ash", "pokeball", "bulbasaur", "charmander",
  "squirtle", "octocat", "bcrikko", "phone", "smartphone", "logo", "jp-logo",
];

const RUNE_NAMES = Object.keys(RUNE_ICONS) as RuneIconName[];

function buildStaticItems(): GalleryItem[] {
  const nes: GalleryItem[] = NES_ICONS.map((name) => ({
    key: `nes:${name}`,
    set: "nes",
    name,
    snippet: `<NesIcon name="${name}" />`,
    render: () => <NesIcon name={name} size="medium" />,
  }));
  const sprites: GalleryItem[] = SPRITES.map((name) => ({
    key: `sprite:${name}`,
    set: "sprite",
    name,
    snippet: `<NesPixelArt name="${name}" />`,
    render: () => <NesPixelArt name={name} />,
  }));
  const runes: GalleryItem[] = RUNE_NAMES.map((name) => ({
    key: `rune:${name}`,
    set: "rune",
    name,
    category: RUNE_ICONS[name].category,
    snippet: `<NesRuneIcon name="${name}" />`,
    render: () => <NesRuneIcon name={name} size="medium" />,
  }));
  return [...nes, ...sprites, ...runes];
}

function customToItem(saved: SavedPixelIcon): GalleryItem {
  return {
    key: `custom:${saved.id}`,
    set: "custom",
    name: saved.name,
    savedId: saved.id,
    ownerId: saved.ownerId,
    snippet: `const ${toIdentifier(saved.name)} = ${JSON.stringify(saved.icon)};\n<NesPixelIcon icon={${toIdentifier(saved.name)}} size="medium" />`,
    render: () => <NesPixelIcon icon={saved.icon} size="medium" />,
  };
}

function toIdentifier(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ");
  const camel = cleaned.map((part, i) => (i === 0 ? part.toLowerCase() : part[0]?.toUpperCase() + part.slice(1).toLowerCase())).join("");
  return /^[a-zA-Z_]/.test(camel) ? `${camel}Icon` : `icon${camel}`;
}

export function IconGallery() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [custom, setCustom] = useState<SavedPixelIcon[]>([]);
  const [customError, setCustomError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { user } = useAuthUser();

  useEffect(() => {
    let cancelled = false;
    listPixelIcons()
      .then((list) => {
        if (!cancelled) setCustom(list);
      })
      .catch((error: unknown) => {
        if (!cancelled) setCustomError(error instanceof Error ? error.message : "Could not load custom icons");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const staticItems = useMemo(buildStaticItems, []);
  const items = useMemo(() => [...staticItems, ...custom.map(customToItem)], [staticItems, custom]);

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (item) => (tab === "all" || item.set === tab) && (q === "" || item.name.toLowerCase().includes(q) || item.category?.includes(q)),
  );
  const counts = TABS.map((t) => ({ ...t, count: t.id === "all" ? items.length : items.filter((i) => i.set === t.id).length }));

  const copy = async (item: GalleryItem) => {
    try {
      await navigator.clipboard.writeText(item.snippet);
      setToast(`Copied ${item.name}`);
    } catch {
      setToast("Clipboard unavailable");
    }
  };

  const remove = async (item: GalleryItem) => {
    if (!item.savedId) return;
    try {
      await deletePixelIcon(item.savedId);
      setCustom((list) => list.filter((c) => c.id !== item.savedId));
      setToast(`Deleted ${item.name}`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="gallery-toolbar">
        <div className="search-field">
          <NesInput aria-label="Filter icons" placeholder="Filter icons..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="gallery-tabs" role="tablist" aria-label="Icon sets">
          {counts.map((t) => (
            <NesButton key={t.id} role="tab" aria-selected={tab === t.id} variant={tab === t.id ? "primary" : "default"} onClick={() => setTab(t.id)}>
              {t.label} ({t.count})
            </NesButton>
          ))}
        </div>
      </div>

      {customError ? <p className="studio-status is-error" role="status">{customError}</p> : null}

      {visible.length === 0 ? (
        <p className="gallery-empty">
          {tab === "custom" && custom.length === 0 ? "No custom icons yet — draw one in the Icon studio." : "Nothing matches that filter."}
        </p>
      ) : (
        <div className="icon-grid">
          {visible.map((item) => (
            <div key={item.key} className="icon-tile-wrap">
              <button type="button" className="icon-tile" title={`Copy ${item.snippet.split("\n").at(-1)}`} onClick={() => void copy(item)}>
                <span className="icon-tile-box">{item.render()}</span>
                <span className="showcase-caption">{item.name}</span>
              </button>
              {item.set === "custom" && user && item.ownerId === user.id ? (
                <button type="button" className="icon-tile-delete" aria-label={`Delete ${item.name}`} onClick={() => void remove(item)}>
                  ×
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {toast ? (
        <div className="showcase-toast nes-balloon from-right" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
