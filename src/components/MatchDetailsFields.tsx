import React from "react";
import { FormField } from "./FormField";
import type { SportEventForm } from "../types/events";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { PITCH_SIZES, TEAM_COLORS } from "../constants/events";
interface MatchDetailsFieldsProps {
  sport: SportEventForm["sport"];
  register: UseFormRegister<SportEventForm>;
  errors: FieldErrors<SportEventForm>;
}

export const MatchDetailsFields: React.FC<MatchDetailsFieldsProps> = ({
  sport,
  register,
  errors,
}) => {
  if (sport === "FOOTBALL") {
    return (
      <div className="form-group form-full">
        <FormField label="Tamaño de cancha" error={errors.pitchSize} fullWidth>
          <select {...register("pitchSize", { valueAsNumber: true })}>
            <option value="">Seleccioná un tamaño</option>
            {PITCH_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Color equipo 1"
          error={errors.firstTeamColor}
          fullWidth
        >
          <select {...register("firstTeamColor")}>
            <option value="">Seleccioná un color</option>
            {TEAM_COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Color equipo 2"
          error={errors.secondTeamColor}
          fullWidth
        >
          <select {...register("secondTeamColor")}>
            <option value="">Seleccioná un color</option>
            {TEAM_COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Jugadores equipo 1"
          error={errors.firstTeamPlayers}
          fullWidth
        >
          <textarea
            rows={3}
            placeholder="Ej: Fabi, Aaron, Brian, Margo, Luqui"
            {...register("firstTeamPlayers")}
          />
        </FormField>

        <FormField
          label="Jugadores equipo 2"
          error={errors.secondTeamPlayers}
          fullWidth
        >
          <textarea
            rows={3}
            placeholder="Ej: Franco, Tobi, Fabri, Nico, Ale"
            {...register("secondTeamPlayers")}
          />
        </FormField>
      </div>
    );
  }

  if (sport === "PADDEL" || sport === "VOLLEY") {
    return (
      <div className="form-group form-full">
        <FormField
          label="Jugadores (uno por línea o separados por coma)"
          fullWidth
        >
          <textarea rows={4} {...register("playersText")} />
        </FormField>
        <FormField
          label="Equipos (separados por coma o enter)"
          error={errors.teams}
          fullWidth
        >
          <textarea
            rows={3}
            placeholder="RED, GREEN, BLUE"
            {...register("teams")}
          />
        </FormField>
      </div>
    );
  }

  return null;
};
