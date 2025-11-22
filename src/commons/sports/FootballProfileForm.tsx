import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { FootballPositionSelector } from "./FootballPositionSelector";
import type { FootballProfileDetail } from "../../types/apiTypes";

const playFrequencies = [
  {
    id: "rarely",
    name: "Ocasional",
    count: 1,
    description: "De vez en cuando",
  },
  {
    id: "often",
    name: "Regular",
    count: 2,
    description: "Varias veces al mes",
  },
  {
    id: "veryOften",
    name: "Frecuente",
    count: 3,
    description: "Varias veces por semana",
  },
];

export const FootballProfileForm = () => {
  const { control } = useFormContext<FootballProfileDetail>();
  const theme = useTheme();

  return (
    <>
      <div className="sport-card sport-card-full">
        <h3 className="sport-card-title">Selecciona tus posiciones</h3>
        <p className="sport-card-subtitle">Elige tus posiciones en el campo</p>
        <FootballPositionSelector />
      </div>

      <Controller
        name="ability"
        control={control}
        render={({ field }) => (
          <div className="sport-card sport-card-full">
            <h3 className="sport-card-title">Nivel de habilidad</h3>
            <p className="sport-card-subtitle">¿Qué tan bueno eres jugando?</p>
            <div className="sport-level-container">
              <SportsSoccerIcon
                sx={{ color: theme.palette.primary.main, fontSize: 36 }}
              />
              <div className="sport-level-slider">
                <div className="sport-level-labels">
                  <span>Principiante</span>
                  <span className="sport-level-value">{field.value || 5}</span>
                  <span>Profesional</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={field.value || 5}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="sport-slider"
                  style={{
                    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  }}
                />
                <div className="sport-level-bars">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`sport-bar ${
                        i < (field.value || 5) ? "active" : ""
                      }`}
                      style={{
                        background:
                          i < (field.value || 5)
                            ? theme.palette.primary.main
                            : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      />

      <Controller
        name="playsOften"
        control={control}
        render={({ field }) => (
          <div className="sport-card sport-card-full">
            <h3 className="sport-card-title">Frecuencia de juego</h3>
            <p className="sport-card-subtitle">
              ¿Con qué frecuencia juegas al fútbol?
            </p>
            <div className="sport-frequency-options">
              {playFrequencies.map((freq) => (
                <label key={freq.id} className="sport-frequency-option">
                  <div
                    className={`sport-frequency-box ${
                      field.value === freq.id ? "selected" : ""
                    }`}
                    onClick={() => field.onChange(freq.id)}
                  >
                    <div className="sport-frequency-icon">
                      <div className="sport-icons-row">
                        {[...Array(freq.count)].map((_, i) => (
                          <SportsSoccerIcon
                            key={i}
                            sx={{
                              color:
                                field.value === freq.id
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary,
                              fontSize: 36,
                              mr: 0.5,
                            }}
                          />
                        ))}
                      </div>
                      <span className="sport-frequency-label">{freq.name}</span>
                    </div>
                    <div
                      className={`sport-radio ${
                        field.value === freq.id ? "checked" : ""
                      }`}
                    >
                      {field.value === freq.id && (
                        <span className="sport-radio-check">✓</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`sport-frequency-text ${
                      field.value === freq.id ? "active" : ""
                    }`}
                    style={{
                      color:
                        field.value === freq.id
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                    }}
                  >
                    {freq.description}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      />
    </>
  );
};
