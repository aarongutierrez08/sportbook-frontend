import { Controller, useFormContext } from "react-hook-form";
import { Slider, FormControlLabel, Checkbox } from "@mui/material";
import { FootballPositionSelector } from "./FootballPositionSelector";
import type { FootballProfileDTO } from "../../../types/user";
import "../../../styles/footballProfileForm.css";
import FootballSliderImage from "../../../assets/football_slider.png";
import illustration from "../../../assets/football_sillhouette.png"

export const FootballProfileForm = () => {
  const { control } = useFormContext<FootballProfileDTO>();

  return (
    <>
      <div className="form-group">
        <label>Selecciona tus posiciones:</label>
        <FootballPositionSelector />
      </div>

      <div>
        <Controller
          name="ability"
          control={control}
          render={({ field }) => (
            <div className="form-group slider-group">
              <label>Nivel (1–10):</label>
              <Slider
                {...field}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                sx={{
                  height: 6,
                  ".MuiSlider-thumb": {
                    width: 25,
                    height: 25,
                    backgroundImage: `url(${FootballSliderImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundColor: 'white',
                    border: "none",
                    boxShadow: "none",
                    "&:hover, &.Mui-focusVisible, &.Mui-active": {
                      boxShadow: "none",
                    },
                  },
                }}
              />
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
          <img src={illustration} alt="Football Sillhouete" className="profile-illustration" />
      </div>
    </>
  );
};
