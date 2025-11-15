import type { Position, TeamColor } from "../types/apiTypes";

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

export const COLOR_MAPPER: Record<TeamColor, string> = {
  BLUE: "Azul",
  GREEN: "Verde",
  BLACK: "Negro",
  RED: "Rojo",
  WHITE: "Blanco",
};

export const COLOR_KEYS = Object.keys(COLOR_MAPPER) as TeamColor[];
export const COLOR_VALUES = Object.values(COLOR_MAPPER);

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
