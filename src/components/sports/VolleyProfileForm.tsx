import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Checkbox, FormControlLabel, RadioGroup, Radio, Slider } from "@mui/material";
import type { VolleyProfileDTO } from "../../types/user";

const allVolleyPositions = ["Setter", "Opuesto", "Central", "Punta", "Libero"];

export const VolleyProfileForm = () => {
  const { control } = useFormContext<VolleyProfileDTO>();
  const selectedPositions = useWatch({
    control,
    name: "positions",
    defaultValue: [],
  }) as string[];

  return (
    <>
      <Controller
        name="positions"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Posiciones en las que suelo jugar:</label>
            {allVolleyPositions.map((pos) => (
              <FormControlLabel
                key={pos}
                control={
                  <Checkbox
                    checked={field.value?.includes(pos)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), pos]);
                      } else {
                        field.onChange(field.value.filter((p: string) => p !== pos));
                      }
                    }}
                  />
                }
                label={pos}
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
              {selectedPositions.map((pos: string) => (
                <FormControlLabel key={pos} value={pos} control={<Radio />} label={pos} />
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
          <div className="form-group">
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Juego seguido"
            />
          </div>
        )}
      />

      <Controller
        name="rolePreference"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Preferencia de rol:</label>
            <RadioGroup {...field} row>
              <FormControlLabel value="OFENSIVO" control={<Radio />} label="Ofensivo" />
              <FormControlLabel value="DEFENSIVO" control={<Radio />} label="Defensivo" />
            </RadioGroup>
          </div>
        )}
      />
    </>
  );
};
