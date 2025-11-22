import React from "react";
import type { TeamColor } from "../../../types/apiTypes";
import { getTeamThemeClass } from "./colorUtils";

interface PillProps {
  children: React.ReactNode;
  teamColor?: TeamColor | null;
  variant?: "default" | "solid";
}

export const Pill: React.FC<PillProps> = ({
  children,
  teamColor,
  variant = "default",
}) => {
  const themeClass = teamColor ? getTeamThemeClass(teamColor) : "";
  const variantClass = variant === "solid" ? "pill-solid" : "pill-default";
  return (
    <span className={`esm-pill ${themeClass} ${variantClass}`}>{children}</span>
  );
};
