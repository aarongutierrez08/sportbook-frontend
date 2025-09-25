import type { Sport } from "./user";

export type SportEvent = {
  id: number;
  sport: Sport;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;
  location: {
    x: number;
    y: number;
    placeName: string;
  };
  cost: number;
  transferData: {
    cbu: string;
    alias: string;
  };
  players: PlayerInfo[];
  creator: string;
  organizer: string;
};

export type FootballEvent = SportEvent & {
  pitchSize?: string;
  firstTeam: TeamInfo;
  secondTeam: TeamInfo;
}

export interface TeamInfo {
  id: number;
  color: Color;
  players: PlayerInfo[];
}

export interface PlayerInfo {
  id: number;
  name: string;
  user: UserInfo;
}

export interface UserInfo {
  username: string;
}

export type PaddleEvent = SportEvent & {
  teams?: TeamInfo[];
}

export type VolleyEvent = SportEvent & {
  teams?: TeamInfo[];
}

export interface SportEventForm {
  sport: Sport;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;
  location: { x: number; y: number; placeName: string };
  cbu: string;
  alias: string;
  creator: string;
  organizer: string;
  playersText: string;
  cost: number;
  pitchSize?: number;
  firstTeamColor?: string;
  secondTeamColor?: string;
  teams?: string;
  firstTeamPlayers?: string;
  secondTeamPlayers?: string;
}

export interface Lineup {
    id: number,
    positionsByPlayer: Record<Position, PlayerInfo>;
    bench: PlayerInfo[];
    initialLineup: PlayerInfo[];
    event: SportEvent;
}

export type PitchSize = 5 | 6 | 7 | 8 |9 | 11;
export type Position = "GK" | "RB" | "LB" | "CB" | "LIB" | "CM" | "RM" | "LM" | "RW" | "LW" | "CT" | "ST";

export type Color = "Rojo" | "Azul" | "Verde" | "Negro" | "Blanco";

export interface UpdateEventParams {
    cost?: number;
    pitchSize?: number;
    locationPlaceName?: string;
    transferDataCbu?: string;
    transferDataAlias?: string;
    creator?: string;
    organizer?: string;
    locationX?: number;
    locationY?: number;
}

export interface Goal {
    teamId: number;
    playerId: number;
}

export interface FinishEventParams {
    goals?: Goal[];
    mvpId?: number;
    missingPlayerIds?: number[];
    winningTeamId?: number;
}
