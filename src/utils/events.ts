import { PITCH_SIZE_MAP } from "../constants/events.ts";
import type { PlayerInfo } from "../types/events.ts";

export const stringToPlayerInfoList = (players?: string): PlayerInfo[] => {
  return (
    players
      ?.split(/[\n,]/g)
      .map((s) => ({ name: s.trim(), user: { username: s.trim() } }))
      .filter(Boolean) || []
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export function getPitchSizeLabel(key?: string): number {
  return key ? PITCH_SIZE_MAP[key] : 0;
}
