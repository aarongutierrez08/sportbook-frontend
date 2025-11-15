/** ============================
 * 📘 TYPE LITERALS (en lugar de enums)
 * ============================ */

export type Sport = "FOOTBALL" | "VOLLEY" | "PADDLE";

export type Role = "ORGANIZER" | "PLAYER";

export type Gender = "MAN" | "WOMAN" | "NON_BINARY" | "PREFER_NOT_TO_SAY";

export type TeamColor = "BLUE" | "GREEN" | "BLACK" | "RED" | "WHITE";

export type PitchSize = 5 | 6 | 7 | 8 | 9 | 11;

export type Position =
  | "GK" // Arquero
  | "RB" // Lateral derecho
  | "LB" // Lateral izquierdo
  | "CB" // Defensa central
  | "LIB" // Líbero
  | "CM" // Mediocampista central
  | "RM" // Mediocampista derecho
  | "LM" // Mediocampista izquierdo
  | "ST" // Delantero
  | "CT" // Centro delantero
  | "RW" // Extremo derecho
  | "LW"; // Extremo izquierdo

/** ============================
 * 📦 BASIC ENTITIES
 * ============================ */

export interface Location {
  id: number;
  x: string;
  y: string;
  placeName: string;
}

export interface TransferData {
  id: number;
  cbu?: string;
  alias?: string;
}

/** ============================
 * 🧍 USER & PROFILE ENTITIES
 * ============================ */

export interface AdditionalInfo {
  id: number;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: Gender;
  languages: string[];
}

export interface SportProfileDetail {
  id: number;
  playsOften: boolean;
  ability?: number;
}

export interface FootballProfileDetail extends SportProfileDetail {
  positions: string[];
  favoritePosition?: string;
}

export interface PaddleProfileDetail extends SportProfileDetail {
  preferredSide?: string;
  playStyle?: string;
  playedTournaments?: boolean;
}

export interface VolleyProfileDetail extends SportProfileDetail {
  positions: string[];
  favoritePosition?: string;
  blockHeight?: number;
  rolePreference?: string;
}

export type SportProfileDetails =
  | FootballProfileDetail
  | PaddleProfileDetail
  | VolleyProfileDetail;

export interface SportProfile {
  id?: number;
  user: SportUser;
  sport: Sport;
  details: SportProfileDetails;
}

export interface SportUser {
  id: number;
  username?: string;
  email?: string;
  name?: string;
  lastName?: string;
  password?: string;
  dateOfBirth?: string; // ISO date string
  profiles: SportProfile[];
  players: Player[];
  role: Role;
  additionalInfo?: AdditionalInfo;
}

/** ============================
 * ⚽ TEAM & PLAYER ENTITIES
 * ============================ */

export interface Player {
  id: number;
  name?: string;
  user?: SportUser;
  event?: Event;
  sportUsername?: string;
}

export interface Team {
  id: number;
  players: Player[];
  color: TeamColor;
}

export interface TeamGoal {
  id: number;
  team?: Team;
  player?: Player;
  finishedEventStats?: FinishedEventStats;
}

/** ============================
 * 📊 EVENT BASE ENTITY
 * ============================ */

export interface Event {
  id: number;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string; // ISO date
  location: Location;
  cost?: number;
  transferData?: TransferData;
  unnasignedPlayers: Player[];
  organizer?: SportUser;
  sport: Sport;
  isFinished: boolean;
  finishedStats?: FinishedEventStats;
}

/** ============================
 * ⚽ FOOTBALL EVENT
 * ============================ */

export interface FootballEvent extends Event {
  sport: "FOOTBALL";
  firstTeam?: Team;
  secondTeam?: Team;
  pitchSize: number;
}

/** ============================
 * 🎾 PADDLE EVENT
 * ============================ */

export interface PaddleEvent extends Event {
  sport: "PADDLE";
  teams: Team[];
}

/** ============================
 * 🏐 VOLLEY EVENT
 * ============================ */

export interface VolleyEvent extends Event {
  sport: "VOLLEY";
  teams: Team[];
}

/** ============================
 * 🧩 LINEUP STRUCTURES
 * ============================ */

export interface Lineup {
  id: number;
  event: Event;
  team: Team;
  initialLineup: Player[];
}

export interface FootballLineup extends Lineup {
  positionsByPlayer: Record<Position, Player>;
  bench: Player[];
}

/** ============================
 * 🏁 FINISHED EVENT STATS
 * ============================ */

export interface FinishedEventStats {
  id: number;
  event?: Event;
  goals: TeamGoal[];
  winningTeam?: Team;
  mvp?: Player;
  missingPlayers: Player[];
}

/** ============================
 * 🧩 UNION TYPE FOR EVENTS
 * ============================ */

export type AnyEvent = FootballEvent | PaddleEvent | VolleyEvent;
