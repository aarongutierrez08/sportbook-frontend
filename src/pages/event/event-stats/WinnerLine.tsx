import React from "react";
import type { TeamColor } from "../../../types/apiTypes";
import { Chip } from "./Chip";

interface WinnerLineProps {
  textLabel?: string;
  teamColor?: TeamColor | null;
}

export const WinnerLine: React.FC<WinnerLineProps> = ({
  textLabel,
  teamColor,
}) => (
  <div className="esm-winnerLine">
    <Chip teamColor={teamColor}>{textLabel}</Chip>
  </div>
);
