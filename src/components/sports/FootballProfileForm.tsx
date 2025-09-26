import { Controller, useFormContext } from "react-hook-form";
import { Slider, FormControlLabel, Checkbox } from "@mui/material";
import { FootballPositionSelector } from "./FootballPositionSelector";
import type { FootballProfileDTO } from "../../types/user";
import "../../styles/footballProfileForm.css";

export const FootballProfileForm = () => {
  const { control } = useFormContext<FootballProfileDTO>();

  return (
    <>
      <div className="form-group">
        <label>Selecciona tus posiciones:</label>
        <FootballPositionSelector />
      </div>

      <div className="profile-controls-container">
        <Controller
          name="ability"
          control={control}
          render={({ field }) => (
            <div className="form-group slider-group">
              <label>Nivel:</label>
              <Slider {...field} min={1} max={10} valueLabelDisplay="auto" />
            </div>
          )}
        />

        <Controller
          name="playsOften"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              className="plays-often-checkbox"
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
      </div>
    </>
  );
};
