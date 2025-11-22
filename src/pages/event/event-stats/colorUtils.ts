import type { Event, TeamColor } from "../../../types/apiTypes";

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

export const getColorThemeClass = (colorData: TeamColor): string => {
  const colorName = getTeamColorName(colorData).toLowerCase();
  if (colorName.includes("azul")) return "theme-blue";
  if (colorName.includes("rojo")) return "theme-red";
  if (colorName.includes("verde")) return "theme-green";
  if (colorName.includes("negro")) return "theme-black";
  if (colorName.includes("blanco")) return "theme-white";
  return "theme-blue";
};

export const getTeamDisplayName = (
  event: Event,
  teamId: number,
  colorData: TeamColor
): string => {
  const originalTeam = event.teams.find((t) => t.id === teamId);
  if (originalTeam && originalTeam.name && originalTeam.name.trim() !== "") {
    return originalTeam.name;
  }
  return getTeamColorName(colorData);
};
