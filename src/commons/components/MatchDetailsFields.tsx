import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "./FormField";
import { ColorSelector } from "./ColorSelectorProps";
import { PlayerSelector } from "./PlayerSelector";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { PITCH_SIZES } from "../../constants/events";
import type { SportEventForm } from "../../pages/CreateEventPage";
import type { Player } from "../../types/apiTypes";

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
  const { control, setValue, watch } = useFormContext<SportEventForm>();

  const firstTeamPlayers = watch("firstTeamPlayersInput") as
    | Player[]
    | undefined;
  const secondTeamPlayers = watch("secondTeamPlayersInput") as
    | Player[]
    | undefined;
  const allEventPlayers = watch("allEventPlayersInput") as Player[] | undefined;

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

        {(["firstTeamColor", "secondTeamColor"] as const).map(
          (fieldName, index) => (
            <div key={fieldName} className="form-group form-full">
              <label>{`Color equipo ${index + 1}`}</label>
              <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <ColorSelector
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors[fieldName]}
                  />
                )}
              />
              {errors[fieldName] && (
                <div className="input-error">{errors[fieldName]?.message}</div>
              )}
            </div>
          )
        )}

        <div className="form-group form-full">
          <PlayerSelector
            label="Jugadores equipo 1"
            selectedPlayers={firstTeamPlayers ?? []}
            onChange={(data) => setValue("firstTeamPlayersInput", data)}
            placeholder="Buscar jugadores para equipo 1..."
          />
        </div>

        <div className="form-group form-full">
          <PlayerSelector
            label="Jugadores equipo 2"
            selectedPlayers={secondTeamPlayers ?? []}
            onChange={(data) => setValue("secondTeamPlayersInput", data)}
            placeholder="Buscar jugadores para equipo 2..."
          />
        </div>
      </div>
    );
  }

  if (sport === "PADDLE" || sport === "VOLLEY") {
    return (
      <div className="form-group form-full">
        <div className="form-group form-full">
          <PlayerSelector
            label="Jugadores del evento"
            selectedPlayers={allEventPlayers ?? []}
            onChange={(data) => setValue("allEventPlayersInput", data)}
            placeholder="Buscar jugadores por username o agregar invitados..."
          />
        </div>

        <FormField
          label="Nombres de los equipos (separados por coma o enter)"
          error={errors.teams}
          fullWidth
        >
          <textarea
            rows={3}
            placeholder="Ejemplo: Quilmes FC, Los Pibes, Team Rocket"
            {...register("teams", { required: "Este campo es obligatorio" })}
          />
        </FormField>
      </div>
    );
  }

  return null;
};
