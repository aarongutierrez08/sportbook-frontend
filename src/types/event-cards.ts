import type {MatchDetails} from "./events.ts";
import type {Color} from "./color.ts";

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

export interface Team {
    color: Color,
    players: string[],
}


export interface FootballCardMatchDetails {
    pitchSize: number;
    firstTeam: Team;
    secondTeam: Team;
}

export interface PaddelCardMatchDetails {
    teams: Team[];
}

export interface VolleyCardMatchDetails {
    teams: Team[];
}

export type CardMatchDetails = FootballCardMatchDetails | PaddelCardMatchDetails | VolleyCardMatchDetails;