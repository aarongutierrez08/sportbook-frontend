import { pitchSizeMap } from "../constants";
import type {PitchSize} from "../types/events.ts";

export const stringToList = (players?: string): string[] => {
  return players
    ?.split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean) || []
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getPitchSizeLabel(key?: string): number {
  return key ? pitchSizeMap[key] : 0;
}

export function mapPitchSize(size: number) {
    const mapSize: { [key: number]: PitchSize } = {
        5: "FIVE",
        7: "SEVEN",
        8: "EIGHT",
        9: "NINE",
        11: "ELEVEN"
    }
    return mapSize[size]
}
