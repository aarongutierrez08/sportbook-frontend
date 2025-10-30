import type { Position } from "./events";

export interface SportUser {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  name?: string;
  lastName?: string;
  dateOfBirth?: string;
  role?: Role;
  additionalInfo?: AdditionalInfo;
}
export interface AdditionalInfo {
    phoneNumber?: string;
    city?: string;
    country?: string;
    address?: string;
    gender?: Gender;
    languages?: string[];
}

export type Gender = "MAN" | "WOMAN" | "NON_BINARY" | "PREFER_NOT_TO_SAY"
export type Sport = "FOOTBALL" | "VOLLEY" | "PADDLE";

export type Role = "PLAYER" | "ORGANIZER";

export interface FootballProfileDTO {
  sport: "FOOTBALL";
  positions: Position[];
  favoritePosition: Position;
  ability: number;
  playFrequency?: string;
}

export interface UpdateFootballProfileRequest {
  positions: Position[];
  favoritePosition: Position;
  ability: number;
  playFrequency?: string;
}

export interface VolleyProfileDTO {
  sport: "VOLLEY";
  positions: string[];
  favoritePosition: string;
  ability: number;
  blockHeight?: number;
  offensiveLevel?: number; // Nuevo campo
  defensiveLevel?: number; // Nuevo campo
  serveType?: string; // Agregar esta línea
  playFrequency?: string; // Nuevo campo: 'rarely', 'often', 'veryOften'
}

export type UpdateVolleyProfileRequest = Omit<VolleyProfileDTO, "sport">

export interface PaddleProfileDTO {
  sport: "PADDLE";
  preferredSide: "DRIVE" | "REVES";
  ability: number;
  playsOften: boolean;
  playStyle: "OFENSIVO" | "DEFENSIVO" | "MIXTO";
  playedTournaments: boolean;
  playFrequency?: string;
}

export type UpdatePaddleProfileRequest = Omit<PaddleProfileDTO, "sport">


export interface SportProfileDTO {
  sport: Sport;
  details: any;
}

export type FootballPosition = 'ST' | 'LW' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'LM' | 'RM' | 'LB' | 'RB' | 'CB' | 'LIB' | 'GK';