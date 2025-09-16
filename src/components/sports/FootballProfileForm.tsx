import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Slider, Checkbox, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import type { Position } from "../../types/events";
import { positionLabels } from "../../constants/events";
import type { FootballProfileDTO } from "../../types/user";
const allPositions = Object.keys(positionLabels) as Position[];

export const FootballProfileForm = () => {
  const { control } = useFormContext<FootballProfileDTO>();
  const selectedPositions = useWatch({
    control,
    name: "positions",
    defaultValue: []
  }) as Position[];

  return (
    <>
      <Controller
        name="positions"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Posiciones en las que suelo jugar:</label>
            {allPositions.map((pos) => (
              <FormControlLabel
                key={pos}
                control={
                  <Checkbox
                    checked={field.value?.includes(pos)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), pos]);
                      } else {
                        field.onChange(field.value.filter((p: Position) => p !== pos));
                      }
                    }}
                  />
                }
                label={positionLabels[pos]}
              />
            ))}
          </div>
        )}
      />

      <Controller
        name="favoritePosition"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Posición favorita:</label>
            <RadioGroup {...field}>
              {selectedPositions.map((pos) => (
                <FormControlLabel
                  key={pos}
                  value={pos}
                  control={<Radio />}
                  label={positionLabels[pos]}
                />
              ))}
            </RadioGroup>
          </div>
        )}
      />

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
