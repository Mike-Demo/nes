import { supabase } from "@/integrations/supabase/client";
import { isPixelIconData, type PixelIconData } from "@/components/pixel-icon";

export interface SavedPixelIcon {
  id: string;
  ownerId: string;
  name: string;
  icon: PixelIconData;
  createdAt: string;
}

interface PixelIconRow {
  id: string;
  owner_id: string;
  name: string;
  size: number;
  pixels: unknown;
  palette: unknown;
  created_at: string;
}

function toSavedIcon(row: PixelIconRow): SavedPixelIcon | null {
  const icon = { size: row.size, pixels: row.pixels, palette: row.palette };
  if (!isPixelIconData(icon)) return null;
  return { id: row.id, ownerId: row.owner_id, name: row.name, icon, createdAt: row.created_at };
}

export async function listPixelIcons(): Promise<SavedPixelIcon[]> {
  const { data, error } = await supabase
    .from("pixel_icons")
    .select("id, owner_id, name, size, pixels, palette, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).flatMap((row) => {
    const icon = toSavedIcon(row);
    return icon ? [icon] : [];
  });
}

export async function savePixelIcon(input: { name: string; icon: PixelIconData; ownerId: string }): Promise<SavedPixelIcon> {
  const { data, error } = await supabase
    .from("pixel_icons")
    .insert({
      owner_id: input.ownerId,
      name: input.name,
      size: input.icon.size,
      pixels: input.icon.pixels as number[][],
      palette: [...input.icon.palette],
    })
    .select("id, owner_id, name, size, pixels, palette, created_at")
    .single();
  if (error) throw new Error(error.message);
  const saved = toSavedIcon(data);
  if (!saved) throw new Error("Saved icon came back malformed");
  return saved;
}

export async function deletePixelIcon(id: string): Promise<void> {
  const { error } = await supabase.from("pixel_icons").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
