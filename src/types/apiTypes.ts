/** ============================
 * 📘 TYPE LITERALS (en lugar de enums)
 * ============================ */

export type Sport = "FOOTBALL" | "VOLLEY" | "PADDLE";

export type Role = "ORGANIZER" | "PLAYER";

export type Gender = "MAN" | "WOMAN" | "NON_BINARY" | "PREFER_NOT_TO_SAY";

export type TeamColor = "BLUE" | "GREEN" | "BLACK" | "RED" | "WHITE";

export type PitchSize = 5 | 6 | 7 | 8 | 9 | 11;

export type Position =
  | "GK"
  | "RB"
  | "LB"
  | "CB"
  | "LIB"
  | "CM"
  | "RM"
  | "LM"
  | "ST"
  | "CT"
  | "RW"
  | "LW";

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
  dateOfBirth?: string;
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
}

export interface Team {
  id: number;
  players: Player[];
  color: TeamColor;
  name: string;
}

export interface TeamGoal {
  id: number;
  team: Team;
  player: Player;
  finishedEventStats?: FinishedEventStats;
}

export interface PartialTeamGoal {
  team: Partial<Team>;
  player: Partial<Player>;
}

/** ============================
 * 📊 EVENT BASE ENTITY
 * ============================ */

export interface Event {
  id: number;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;
  location: Location;
  cost?: number;
  transferData?: TransferData;
  unnasignedPlayers: Player[];
  organizer?: SportUser;
  sport: Sport;
  isFinished: boolean;
  finishedStats?: FinishedEventStats;
  teams: Team[];
}

/** ============================
 * ⚽ FOOTBALL EVENT
 * ============================ */

export interface FootballEvent extends Event {
  sport: "FOOTBALL";
  pitchSize: number;
}

/** ============================
 * 🎾 PADDLE EVENT
 * ============================ */

export interface PaddleEvent extends Event {
  sport: "PADDLE";
}

/** ============================
 * 🏐 VOLLEY EVENT
 * ============================ */

export interface VolleyEvent extends Event {
  sport: "VOLLEY";
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

export interface TeamGoalRequest {
  teamId: number;
  playerId: number;
}

export interface SetResult {
  team1Score: number;
  team2Score: number;
}

export interface FinishEventRequest {
  winningTeamId: number | null;
  goals: TeamGoalRequest[];
  missingPlayerIds: number[];
  mvpId?: number;

  sets?: SetResult[];
}

export interface FinishedEventStats {
  id: number;
  event?: Event;
  goals: TeamGoal[];
  winningTeam?: Team;
  mvp?: Player;
  missingPlayers: Player[];

  sets?: SetResult[];
}

export interface EventStatsResponse {
  eventId: number;
  sport: Sport;
  dateTime: string;
  finished: boolean;

  totalRegisteredPlayers: number;
  presentPlayers: number;
  absentPlayers: number;
  attendanceRate: number;

  totalGoals: number;
  scores: TeamScoreDTO[];
  scorersRanking: PlayerGoalsDTO[];

  winningTeam?: TeamSummary;
  mvp?: PlayerSummary;
  missingPlayers: PlayerSummary[];

  sets?: SetResult[];
}

export interface TeamScoreDTO {
  teamId: number;
  color: TeamColor;
  goals: number;
  isWinner: boolean;
  name: string;
}

export interface PlayerGoalsDTO {
  player: PlayerSummary;
  teamId: number;
  goals: number;
}

export interface PlayerSummary {
  id: number;
  name: string;
  teamId: number | null;
  teamColor: TeamColor | null;
}

export interface TeamSummary {
  id: number;
  color: TeamColor;
  name: string;
}

/** ============================
 * 🧩 UNION TYPE FOR EVENTS
 * ============================ */

export type AnyEvent = FootballEvent | PaddleEvent | VolleyEvent;
