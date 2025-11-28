import { PITCH_SIZE_MAP } from "../constants/events";
import type { Event, Player, SportUser } from "../types/apiTypes";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatDateFriendly = (dateString: string): string => {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const formatted = formatter.format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export function getPitchSizeLabel(key?: string): number {
  return key ? PITCH_SIZE_MAP[key] : 0;
}

const matchesUser = (player: Player, loggedUser: SportUser | null) =>
  player.user?.id === loggedUser?.id;

export function isLoggedUserInEvent(
  event: Event,
  loggedUser: SportUser | null
): boolean {
  const inGeneralPlayers = event.unnasignedPlayers.some((player) =>
    matchesUser(player, loggedUser)
  );
  const inFootballEvent = event.teams.some((team) =>
    team.players.some((player) => matchesUser(player, loggedUser))
  );
  return inGeneralPlayers || inFootballEvent;
}
