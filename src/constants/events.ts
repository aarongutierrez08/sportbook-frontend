import type { Color, Position } from "../../types/events";

export const REQUIRED = { value: true, message: "Este campo es obligatorio" };

export const PITCH_SIZE_MAP: Record<string, number> = {
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGTH: 8,
  NINE: 9,
  ELEVEN: 11,
};

export const PITCH_SIZES = [5, 6, 7, 8, 9, 11];
export const TEAM_COLORS: Color[] = [
  "Azul",
  "Verde",
  "Rojo",
  "Negro",
  "Blanco",
];

export const positionLabels: Record<Position, string> = {
  GK: "Arquero",
  RB: "Lateral Derecho",
  LB: "Lateral Izquierdo",
  CB: "Defensor Central",
  LIB: "Líbero",
  CM: "Mediocampista Central",
  RM: "Mediocampista Derecho",
  LM: "Mediocampista Izquierdo",
  RW: "Extremo Derecho",
  LW: "Extremo Izquierdo",
  CT: "Centrodelantero",
  ST: "Segundo Delantero",
};
