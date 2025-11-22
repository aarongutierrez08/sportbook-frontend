import type { TeamColor } from "../../../types/apiTypes";

export const getTeamColorName = (color: TeamColor): string => {
  const nameMap: Record<TeamColor, string> = {
    BLUE: "Azul",
    GREEN: "Verde",
    BLACK: "Negro",
    RED: "Rojo",
    WHITE: "Blanco",
  };
  return nameMap[color] || color;
};

export const getTeamThemeClass = (color: TeamColor): string => {
  const classMap: Record<TeamColor, string> = {
    BLUE: "theme-blue",
    GREEN: "theme-green",
    BLACK: "theme-black",
    RED: "theme-red",
    WHITE: "theme-white",
  };

  return classMap[color] || "theme-blue";
};
