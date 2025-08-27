import React from "react";
import { FormField } from "./FormField";
import type { SportEventForm } from "../types/events";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

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
        <label>Detalles de Fútbol</label>
        <input
          type="number"
          placeholder="Tamaño cancha (ej: 5)"
          {...register("pitchSize", { valueAsNumber: true })}
        />
        <input
          type="text"
          placeholder="Color equipo 1"
          {...register("firstTeamColor")}
        />
        <input
          type="text"
          placeholder="Color equipo 2"
          {...register("secondTeamColor")}
        />
      </div>
    );
  }

  if (sport === "PADDEL" || sport === "VOLLEY") {
    return (
      <FormField label="Equipos (separados por coma o enter)" error={errors.teams} fullWidth>
        <textarea
          rows={3}
          placeholder="RED, GREEN, BLUE"
          {...register("teams")}
        />
      </FormField>
    );
  }

  return null;
};
