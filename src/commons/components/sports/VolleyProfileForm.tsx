import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { VolleyProfileDTO } from "../../../types/user";

const allVolleyPositions = [
  { id: "Setter", name: "Setter", icon: "🙌", description: "Armador" },
  {
    id: "Opuesto",
    name: "Opuesto",
    icon: "💪",
    description: "Atacante principal",
  },
  { id: "Central", name: "Central", icon: "🚫", description: "Bloqueador" },
  { id: "Punta", name: "Punta", icon: "⚡", description: "Receptor-atacante" },
  {
    id: "Libero",
    name: "Líbero",
    icon: "🛡️",
    description: "Defensa especializada",
  },
];

const serveTypes = [
  {
    id: "float",
    name: "Flotante",
    icon: "🌊",
    description: "Saque sin rotación",
  },
  {
    id: "topspin",
    name: "Con efecto",
    icon: "🌀",
    description: "Saque con topspin",
  },
  {
    id: "jump",
    name: "En suspensión",
    icon: "🚀",
    description: "Saque potente en salto",
  },
  {
    id: "underhand",
    name: "Por abajo",
    icon: "📍",
    description: "Saque básico",
  },
];

const playFrequencies = [
  {
    id: "rarely",
    name: "Ocasional",
    icon: "🏐",
    description: "De vez en cuando",
  },
  {
    id: "often",
    name: "Regular",
    icon: "🏐🏐",
    description: "Varias veces al mes",
  },
  {
    id: "veryOften",
    name: "Frecuente",
    icon: "🏐🏐🏐",
    description: "Varias veces por semana",
  },
];

export const VolleyProfileForm = () => {
  const { control } = useFormContext<VolleyProfileDTO>();

  const favoritePosition = useWatch({
    control,
    name: "favoritePosition",
  }) as string;

  return (
    <>
      {/* Posiciones favoritas */}
      <Controller
        name="positions"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Posiciones favoritas</h3>
            <p className="sport-card-subtitle">
              Selecciona tus posiciones y marca tu favorita con ⭐
            </p>
            <div className="sport-options-list">
              {allVolleyPositions.map((pos) => {
                const isSelected = field.value?.includes(pos.id);
                const isFavorite = favoritePosition === pos.id;

                return (
                  <div
                    key={pos.id}
                    className={`sport-option-item ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        field.onChange(
                          field.value.filter((p: string) => p !== pos.id)
                        );
                      } else {
                        field.onChange([...(field.value || []), pos.id]);
                      }
                    }}
                  >
                    <div className="sport-option-content">
                      <span className="sport-option-icon">{pos.icon}</span>
                      <div className="sport-option-text">
                        <div className="sport-option-name">{pos.name}</div>
                        <div className="sport-option-desc">
                          {pos.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Controller
                        name="favoritePosition"
                        control={control}
                        render={({ field: favField }) => (
                          <button
                            type="button"
                            className={`sport-favorite-btn ${
                              isFavorite ? "favorite" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              favField.onChange(pos.id);
                            }}
                          >
                            {isFavorite ? "⭐" : "☆"}
                          </button>
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      />

      {/* Tipo de saque */}
      <Controller
        name="serveType"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Tipo de saque</h3>
            <p className="sport-card-subtitle">¿Cuál es tu saque preferido?</p>
            <div className="sport-options-list">
              {serveTypes.map((serve) => (
                <div
                  key={serve.id}
                  className={`sport-option-item ${
                    field.value === serve.id ? "selected" : ""
                  }`}
                  onClick={() => field.onChange(serve.id)}
                >
                  <div className="sport-option-content">
                    <span className="sport-option-icon">{serve.icon}</span>
                    <div className="sport-option-text">
                      <div className="sport-option-name">{serve.name}</div>
                      <div className="sport-option-desc">{serve.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      {/* Nivel ofensivo */}
      <Controller
        name="offensiveLevel"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel ofensivo</h3>
            <p className="sport-card-subtitle">¿Qué tan bueno eres atacando?</p>
            <div className="sport-level-container">
              <span className="sport-level-icon">⚡</span>
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
                  className="sport-slider offensive"
                />
                <div className="sport-level-bars">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`sport-bar ${
                        i < (field.value || 5) ? "active offensive" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      />

      {/* Nivel defensivo */}
      <Controller
        name="defensiveLevel"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel defensivo</h3>
            <p className="sport-card-subtitle">
              ¿Qué tan bueno eres defendiendo?
            </p>
            <div className="sport-level-container">
              <span className="sport-level-icon">🛡️</span>
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
                  className="sport-slider defensive"
                />
                <div className="sport-level-bars">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`sport-bar ${
                        i < (field.value || 5) ? "active defensive" : ""
                      }`}
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
          <div className="sport-card sport-card-full">
            <h3 className="sport-card-title">Frecuencia de juego</h3>
            <p className="sport-card-subtitle">
              ¿Con qué frecuencia juegas al voleibol?
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
