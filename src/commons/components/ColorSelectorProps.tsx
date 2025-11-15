import React from "react";
import type { Color } from "../../types/events";
import "../../styles/ColorSelector.css";

interface ColorSelectorProps {
  value?: Color;
  onChange: (color: Color) => void;
  error?: boolean;
}

const COLORS: { value: Color; label: string; cssClass: string }[] = [
  { value: "RED", label: "Rojo", cssClass: "color-red" },
  { value: "BLUE", label: "Azul", cssClass: "color-blue" },
  { value: "GREEN", label: "Verde", cssClass: "color-green" },
  { value: "BLACK", label: "Negro", cssClass: "color-black" },
  { value: "WHITE", label: "Blanco", cssClass: "color-white" },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className={`color-selector ${error ? "error" : ""}`}>
      {COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          className={`color-option ${color.cssClass} ${
            value === color.value ? "selected" : ""
          }`}
          onClick={() => onChange(color.value)}
          title={color.label}
        >
          <div className="color-box">
            {value === color.value && <span className="color-check">✓</span>}
          </div>
          <span className="color-label">{color.label}</span>
        </button>
      ))}
    </div>
  );
};
