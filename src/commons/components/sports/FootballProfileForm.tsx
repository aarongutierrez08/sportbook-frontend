import { Controller, useFormContext } from "react-hook-form";
import { FootballPositionSelector } from "./FootballPositionSelector";
import type { FootballProfileDTO } from "../../../types/user";
import illustration from "../../../assets/football_sillhouette.png";

const playFrequencies = [
  {
    id: "rarely",
    name: "Ocasional",
    icon: "⚽",
    description: "De vez en cuando",
  },
  {
    id: "often",
    name: "Regular",
    icon: "⚽⚽",
    description: "Varias veces al mes",
  },
  {
    id: "veryOften",
    name: "Frecuente",
    icon: "⚽⚽⚽",
    description: "Varias veces por semana",
  },
];

export const FootballProfileForm = () => {
  const { control } = useFormContext<FootballProfileDTO>();

  return (
    <>
      {/* Selector de posiciones */}
      <div className="sport-card sport-card-full">
        <h3 className="sport-card-title">Selecciona tus posiciones</h3>
        <p className="sport-card-subtitle">Elige tus posiciones en el campo</p>
        <FootballPositionSelector />
      </div>

      {/* Ilustración */}

      {/* <img
        src={illustration}
        alt="Football Silhouette"
        className="profile-illustration"
      /> */}

      {/* Nivel */}
      <Controller
        name="ability"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel de habilidad</h3>
            <p className="sport-card-subtitle">¿Qué tan bueno eres jugando?</p>
            <div className="sport-level-container">
              <span className="sport-level-icon">⚽</span>
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
                    background: "linear-gradient(to right, #86efac, #22c55e)",
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
                          i < (field.value || 5) ? "#22c55e" : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      />

      {/* Frecuencia de juego */}
      <Controller
        name="playFrequency"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
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
                        <span className="sport-icon-single">{freq.icon}</span>
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
