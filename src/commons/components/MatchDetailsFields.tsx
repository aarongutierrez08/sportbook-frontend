import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "./FormField";
import { ColorSelector } from "./ColorSelector";
import { PlayerSelector } from "./PlayerSelector";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { PITCH_SIZES } from "../../constants/events";
import type { Player } from "../../types/apiTypes";
import type { SportEventForm } from "../../pages/create/CreateEventPage";

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

  if (!sport) return null;

  return (
    <div className="form-group form-full">
      {sport === "FOOTBALL" && (
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
      )}

      <div
        className="form-full form-group flex"
        style={{ gap: "2rem", marginTop: "1rem", flexDirection: "row" }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "1rem" }}>
            <FormField label="Nombre Equipo 1" error={errors.firstTeamName}>
              <input
                type="text"
                placeholder="Ej: Los Rayos"
                {...register("firstTeamName")}
              />
            </FormField>
          </div>

          <label>Color Equipo 1</label>
          <Controller
            name="firstTeamColor"
            control={control}
            rules={{ required: "Debes elegir un color" }}
            render={({ field }) => (
              <ColorSelector
                value={field.value}
                onChange={field.onChange}
                error={!!errors.firstTeamColor}
              />
            )}
          />
          {errors.firstTeamColor && (
            <div className="input-error">{errors.firstTeamColor?.message}</div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "1rem" }}>
            <FormField label="Nombre Equipo 2" error={errors.secondTeamName}>
              <input
                type="text"
                placeholder="Ej: Furia Roja"
                {...register("secondTeamName")}
              />
            </FormField>
          </div>

          <label>Color Equipo 2</label>
          <Controller
            name="secondTeamColor"
            control={control}
            rules={{ required: "Debes elegir un color" }}
            render={({ field }) => (
              <ColorSelector
                value={field.value}
                onChange={field.onChange}
                error={!!errors.secondTeamColor}
              />
            )}
          />
          {errors.secondTeamColor && (
            <div className="input-error">{errors.secondTeamColor?.message}</div>
          )}
        </div>
      </div>

      <div className="form-group form-full">
        <PlayerSelector
          label="Jugadores Equipo 1"
          selectedPlayers={firstTeamPlayers ?? []}
          onChange={(data) => setValue("firstTeamPlayersInput", data)}
          placeholder="Buscar jugadores para el primer equipo..."
          excludePlayers={secondTeamPlayers ?? []}
        />
      </div>

      <div className="form-group form-full">
        <PlayerSelector
          label="Jugadores Equipo 2"
          selectedPlayers={secondTeamPlayers ?? []}
          onChange={(data) => setValue("secondTeamPlayersInput", data)}
          placeholder="Buscar jugadores para el segundo equipo..."
          excludePlayers={firstTeamPlayers ?? []}
        />
      </div>
    </div>
  );
};
