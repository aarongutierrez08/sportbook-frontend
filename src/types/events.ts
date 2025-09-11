export type SportEvent = {
  id: number;
  sport: string;
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
  color: Color;
  players: PlayerInfo[];
}

export interface PlayerInfo {
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
  sport: string;
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

export type PitchSize = 5 | 6 | 7 | 8 |9 | 11;

export type Color = "Rojo" | "Azul" | "Verde" | "Negro" | "Blanco";
