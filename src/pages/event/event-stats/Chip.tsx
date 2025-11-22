import React from "react";
import type { TeamColor } from "../../../types/apiTypes";
import { getTeamThemeClass } from "./colorUtils";

interface ChipProps {
  children?: React.ReactNode;
  teamColor?: TeamColor | null;
}

export const Chip: React.FC<ChipProps> = ({ children, teamColor }) => {
  const themeClass = teamColor ? getTeamThemeClass(teamColor) : "";
  return <span className={`esm-chip ${themeClass}`}>{children}</span>;
};
