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
    hour12: false, // Para usar formato 24hs (19:00)
  }).format(date);
};

export const formatDateFriendly = (dateString: string): string => {
  const date = new Date(dateString);

  // Configuramos el formato en español
  const formatter = new Intl.DateTimeFormat("es-AR", {
    weekday: "long", // "sábado"
    day: "numeric", // "15"
    month: "long", // "junio"
    // year: "numeric", // Descomentar si quieres el año
  });

  const formatted = formatter.format(date);

  // Capitalizamos la primera letra: "sábado" -> "Sábado"
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

// Uso:
// Input: "2025-11-29T19:00:00"
// Output: "Sábado, 29 de noviembre"

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
