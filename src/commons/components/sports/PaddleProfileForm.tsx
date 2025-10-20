import { Controller, useFormContext } from "react-hook-form";
import type { PaddleProfileDTO } from "../../../types/user";

const preferredSides = [
  { id: 'DRIVE', name: 'Drive', icon: '➡️', description: 'Lado derecho' },
  { id: 'REVES', name: 'Revés', icon: '⬅️', description: 'Lado izquierdo' }
];

const playStyles = [
  { id: 'OFENSIVO', name: 'Ofensivo', icon: '⚡', description: 'Juego agresivo' },
  { id: 'DEFENSIVO', name: 'Defensivo', icon: '🛡️', description: 'Juego controlado' },
  { id: 'MIXTO', name: 'Mixto', icon: '⚖️', description: 'Equilibrado' }
];

const playFrequencies = [
  { id: 'rarely', name: 'Ocasional', icon: '🎾', description: 'De vez en cuando' },
  { id: 'often', name: 'Regular', icon: '🎾🎾', description: 'Varias veces al mes' },
  { id: 'veryOften', name: 'Frecuente', icon: '🎾🎾🎾', description: 'Varias veces por semana' }
];

export const PaddleProfileForm = () => {
  const { control } = useFormContext<PaddleProfileDTO>();

  return (
    <>
      {/* Lado preferido */}
      <Controller
        name="preferredSide"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Lado preferido</h3>
            <p className="sport-card-subtitle">¿De qué lado prefieres jugar?</p>
            <div className="sport-options-list">
              {preferredSides.map((side) => (
                <div
                  key={side.id}
                  className={`sport-option-item ${field.value === side.id ? 'selected' : ''}`}
                  onClick={() => field.onChange(side.id)}
                >
                  <div className="sport-option-content">
                    <span className="sport-option-icon">{side.icon}</span>
                    <div className="sport-option-text">
                      <div className="sport-option-name">{side.name}</div>
                      <div className="sport-option-desc">{side.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      {/* Estilo de juego */}
      <Controller
        name="playStyle"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Estilo de juego</h3>
            <p className="sport-card-subtitle">¿Cómo te gusta jugar?</p>
            <div className="sport-options-list">
              {playStyles.map((style) => (
                <div
                  key={style.id}
                  className={`sport-option-item ${field.value === style.id ? 'selected' : ''}`}
                  onClick={() => field.onChange(style.id)}
                >
                  <div className="sport-option-content">
                    <span className="sport-option-icon">{style.icon}</span>
                    <div className="sport-option-text">
                      <div className="sport-option-name">{style.name}</div>
                      <div className="sport-option-desc">{style.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      {/* Nivel */}
      <Controller
        name="ability"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel de habilidad</h3>
            <p className="sport-card-subtitle">¿Qué tan bueno eres jugando?</p>
            <div className="sport-level-container">
              <span className="sport-level-icon">🎾</span>
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
                    background: 'linear-gradient(to right, #fcd34d, #f59e0b)'
                  }}
                />
                <div className="sport-level-bars">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`sport-bar ${i < (field.value || 5) ? 'active' : ''}`}
                      style={{
                        background: i < (field.value || 5) ? '#f59e0b' : undefined
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      />

      {/* Experiencia en torneos */}
      <Controller
        name="playedTournaments"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Experiencia en torneos</h3>
            <p className="sport-card-subtitle">¿Has participado en competiciones?</p>
            <div className="sport-options-list">
              <div
                className={`sport-option-item ${!field.value ? 'selected' : ''}`}
                onClick={() => field.onChange(false)}
              >
                <div className="sport-option-content">
                  <span className="sport-option-icon">🎯</span>
                  <div className="sport-option-text">
                    <div className="sport-option-name">Sin torneos</div>
                    <div className="sport-option-desc">Solo juego recreativo</div>
                  </div>
                </div>
              </div>
              <div
                className={`sport-option-item ${field.value ? 'selected' : ''}`}
                onClick={() => field.onChange(true)}
              >
                <div className="sport-option-content">
                  <span className="sport-option-icon">🏆</span>
                  <div className="sport-option-text">
                    <div className="sport-option-name">Con torneos</div>
                    <div className="sport-option-desc">He jugado competiciones</div>
                  </div>
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
            <p className="sport-card-subtitle">¿Con qué frecuencia juegas al pádel?</p>
            <div className="sport-frequency-options">
              {playFrequencies.map((freq) => (
                <label key={freq.id} className="sport-frequency-option">
                  <div
                    className={`sport-frequency-box ${field.value === freq.id ? 'selected' : ''}`}
                    onClick={() => field.onChange(freq.id)}
                  >
                    <div className="sport-frequency-icon">
                      <div className="sport-icons-row">
                        <span className="sport-icon-single">{freq.icon}</span>
                      </div>
                      <span className="sport-frequency-label">{freq.name}</span>
                    </div>
                    <div className={`sport-radio ${field.value === freq.id ? 'checked' : ''}`}>
                      {field.value === freq.id && <span className="sport-radio-check">✓</span>}
                    </div>
                  </div>
                  <span className={`sport-frequency-text ${field.value === freq.id ? 'active' : ''}`}>
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