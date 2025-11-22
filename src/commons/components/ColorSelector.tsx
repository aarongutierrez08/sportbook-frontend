import React from "react";
import type { TeamColor } from "../../types/apiTypes";
import { COLORS } from "../../theme/theme";
import "../../styles/ColorSelector.css";

interface ColorSelectorProps {
  value?: TeamColor;
  onChange: (color: TeamColor) => void;
  error?: boolean;
}

const TEAM_COLORS: {
  value: TeamColor;
  label: string;
  bg: string;
  border: string;
  text: string;
}[] = [
  {
    value: "RED",
    label: "Rojo",
    bg: COLORS.TEAM_RED,
    border: COLORS.TEAM_RED_DARK,
    text: "#ffffff",
  },
  {
    value: "BLUE",
    label: "Azul",
    bg: COLORS.TEAM_BLUE,
    border: COLORS.TEAM_BLUE_DARK,
    text: "#ffffff",
  },
  {
    value: "GREEN",
    label: "Verde",
    bg: COLORS.TEAM_GREEN,
    border: COLORS.TEAM_GREEN_DARK,
    text: "#ffffff",
  },
  {
    value: "BLACK",
    label: "Negro",
    bg: COLORS.TEAM_BLACK,
    border: COLORS.TEAM_BLACK_DARK,
    text: "#ffffff",
  },
  {
    value: "WHITE",
    label: "Blanco",
    bg: COLORS.TEAM_WHITE,
    border: COLORS.TEAM_WHITE_DARK,
    text: COLORS.TEAM_BLACK,
  },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className={`color-selector ${error ? "error" : ""}`}>
      {TEAM_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          className={`color-option ${value === color.value ? "selected" : ""}`}
          onClick={() => onChange(color.value)}
          title={color.label}
        >
          <div
            className="color-box"
            style={{
              background: color.bg,
              borderColor:
                value === color.value ? COLORS.PRIMARY : color.border,
            }}
          >
            {value === color.value && (
              <span className="color-check" style={{ color: color.text }}>
                ✓
              </span>
            )}
          </div>
          <span className="color-label">{color.label}</span>
        </button>
      ))}
    </div>
  );
};
