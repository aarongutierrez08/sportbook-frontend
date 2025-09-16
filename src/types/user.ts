import type { Position } from "./events";

export interface SportUser {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  name?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export type Sport = "FOOTBALL" | "VOLLEY" | "PADDLE";

export interface FootballProfileDTO {
  sport: "FOOTBALL";
  positions: Position[];
  favoritePosition: Position;
  ability: number;
  playsOften: boolean;
}

export interface UpdateFootballProfileRequest {
  positions: Position[];
  favoritePosition: Position;
  ability: number;
  playsOften: boolean;
}

// types/profile.ts
export interface VolleyProfileDTO {
  sport: "VOLLEY";
  positions: string[];
  favoritePosition: string;
  ability: number;
  playsOften: boolean;
  blockHeight?: number;
  rolePreference: "OFENSIVO" | "DEFENSIVO";
}

export type UpdateVolleyProfileRequest = Omit<VolleyProfileDTO, "sport">

export interface PaddleProfileDTO {
  sport: "PADDLE";
  preferredSide: "DRIVE" | "REVES";
  ability: number;
  playsOften: boolean;
  playStyle: "OFENSIVO" | "DEFENSIVO" | "MIXTO";
  playedTournaments: boolean;
}

export type UpdatePaddleProfileRequest = Omit<PaddleProfileDTO, "sport">


export interface SportProfileDTO {
  sport: Sport;
  details: any;
}

