export type SportEvent = {
  sport: string;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;
  location: { x: number; y: number };
  cost: number;
  cbu: string;
  alias: string;
  players: string[];
  creator: string;
  organizer: string;
  matchDetails: MatchDetails;
};

export type MatchDetails = FootballMatchDetails | PaddelMatchDetails | VolleyMatchDetails | object

export interface FootballMatchDetails {
  pitchSize?: number;
  firstTeamColor?: string;
  secondTeamColor?: string;
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
  location: { x: number; y: number };
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