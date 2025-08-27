import type { Color } from "./color";

export type SportEvent = {
  id: number,
  sport: string;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;
  location: { x: number; y: number, placeName: string };
  cost: number;
  transferData: {
    cbu: string;
    alias: string;
  }
  players: PlayerInfo[];
  creator: string;
  organizer: string;
  matchDetails: MatchDetails;
};

export type MatchDetails = FootballMatchDetails | PaddelMatchDetails | VolleyMatchDetails | object

export interface FootballMatchDetails {
  pitchSize?: string;
  firstTeam: TeamInfo;
  secondTeam: TeamInfo;
}

export interface TeamInfo {
  color: Color,
  players: PlayerInfo[]
}

export interface PlayerInfo {
  name: string,
  user: UserInfo,
}

export interface UserInfo {
  userName: string,
}

export interface PaddelMatchDetails {
  teams?: string[];
}

export interface VolleyMatchDetails {
  teams?: string[];
}


export interface SportEventForm {
  sport: string;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;
  location: { x: number; y: number, placeName: string };
  cbu: string;
  alias: string;
  creator: string;
  organizer: string;
  playersText: string;
  cost: number;
  // matchDetails será dinámico según deporte
  pitchSize?: number;
  firstTeamColor?: string;
  secondTeamColor?: string;
  teams?: string;
}