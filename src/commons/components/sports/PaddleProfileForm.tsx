import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, FormControlLabel, RadioGroup, Radio, Slider } from "@mui/material";
import type { PaddleProfileDTO } from "../../types/user";

export const PaddleProfileForm = () => {
  const { control } = useFormContext<PaddleProfileDTO>();

  return (
    <>
      <Controller
        name="preferredSide"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Lado preferido:</label>
            <RadioGroup {...field} row>
              <FormControlLabel value="DRIVE" control={<Radio />} label="Drive (derecha)" />
              <FormControlLabel value="REVES" control={<Radio />} label="Revés (izquierda)" />
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
        name="playStyle"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <label>Estilo de juego:</label>
            <RadioGroup {...field} row>
              <FormControlLabel value="OFENSIVO" control={<Radio />} label="Ofensivo" />
              <FormControlLabel value="DEFENSIVO" control={<Radio />} label="Defensivo" />
              <FormControlLabel value="MIXTO" control={<Radio />} label="Mixto" />
            </RadioGroup>
          </div>
        )}
      />

      <Controller
        name="playedTournaments"
        control={control}
        render={({ field }) => (
          <div className="form-group">
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label="He jugado torneos"
            />
          </div>
        )}
      />
    </>
  );
};
