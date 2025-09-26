import { Controller, useFormContext } from "react-hook-form";
import { Slider, FormControlLabel, Checkbox } from "@mui/material";
import { FootballPositionSelector } from "./FootballPositionSelector";
import type { FootballProfileDTO } from "../../types/user";

export const FootballProfileForm = () => {
  const { control } = useFormContext<FootballProfileDTO>();

  return (
    <>
      <div className="form-group">
        <label>Selecciona tus posiciones:</label>
        <FootballPositionSelector />
      </div>

      <Controller
        name="ability"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Nivel (1–10):</label>
            <Slider {...field} min={1} max={10} valueLabelDisplay="auto" />
          </div>
        )}
      />

      <Controller
        name="playsOften"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Juego seguido"
          />
        )}
      />
    </>
  );
};
