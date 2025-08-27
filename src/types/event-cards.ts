import type {MatchDetails, TeamInfo} from "./events.ts";

export interface SportEventCard {
    id: number,
    sport: string;
    minPlayers: number;
    maxPlayers: number;
    dateTime: string;
    location: { x: number; y: number, placeName: string };
    cost: number;
    cbu: string;
    alias: string;
    players: string[];
    creator: string;
    organizer: string;
    matchDetails: MatchDetails;
}


export interface FootballCardMatchDetails {
    pitchSize: number;
    firstTeam: TeamInfo;
    secondTeam: TeamInfo;
}

export interface PaddelCardMatchDetails {
    teams: TeamInfo[];
}

export interface VolleyCardMatchDetails {
    teams: TeamInfo[];
}

export type CardMatchDetails = FootballCardMatchDetails | PaddelCardMatchDetails | VolleyCardMatchDetails;