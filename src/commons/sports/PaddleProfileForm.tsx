import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ShieldIcon from "@mui/icons-material/Shield";
import BalanceIcon from "@mui/icons-material/Balance";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import type { PaddleProfileDetail } from "../../types/apiTypes";
import { PLAY_FREQUENCIES } from "../../constants/events";

const preferredSides = [
  {
    id: "DRIVE",
    name: "Drive",
    icon: ArrowForwardIcon,
    description: "Lado derecho",
  },
  {
    id: "REVES",
    name: "Revés",
    icon: ArrowBackIcon,
    description: "Lado izquierdo",
  },
];

const playStyles = [
  {
    id: "OFENSIVO",
    name: "Ofensivo",
    icon: FlashOnIcon,
    description: "Juego agresivo",
  },
  {
    id: "DEFENSIVO",
    name: "Defensivo",
    icon: ShieldIcon,
    description: "Juego controlado",
  },
  { id: "MIXTO", name: "Mixto", icon: BalanceIcon, description: "Equilibrado" },
];

export const PaddleProfileForm = () => {
  const { control } = useFormContext<PaddleProfileDetail>();
  const theme = useTheme();

  return (
    <>
      <Controller
        name="preferredSide"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Lado preferido</h3>
            <p className="sport-card-subtitle">¿De qué lado prefieres jugar?</p>
            <div className="sport-options-list">
              {preferredSides.map(({ id, name, icon: Icon, description }) => (
                <div
                  key={id}
                  className={`sport-option-item ${
                    field.value === id ? "selected" : ""
                  }`}
                  onClick={() => field.onChange(id)}
                >
                  <div className="sport-option-content">
                    <Icon
                      sx={{
                        color:
                          field.value === id
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        fontSize: 36,
                      }}
                    />
                    <div className="sport-option-text">
                      <div className="sport-option-name">{name}</div>
                      <div className="sport-option-desc">{description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      <Controller
        name="playStyle"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Estilo de juego</h3>
            <p className="sport-card-subtitle">¿Cómo te gusta jugar?</p>
            <div className="sport-options-list">
              {playStyles.map(({ id, name, icon: Icon, description }) => (
                <div
                  key={id}
                  className={`sport-option-item ${
                    field.value === id ? "selected" : ""
                  }`}
                  onClick={() => field.onChange(id)}
                >
                  <div className="sport-option-content">
                    <Icon
                      sx={{
                        color:
                          field.value === id
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        fontSize: 36,
                      }}
                    />
                    <div className="sport-option-text">
                      <div className="sport-option-name">{name}</div>
                      <div className="sport-option-desc">{description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      <Controller
        name="ability"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel de habilidad</h3>
            <p className="sport-card-subtitle">¿Qué tan bueno eres jugando?</p>
            <div className="sport-level-container">
              <SportsTennisIcon
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
        name="playedTournaments"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Experiencia en torneos</h3>
            <p className="sport-card-subtitle">
              ¿Has participado en competiciones?
            </p>
            <div className="sport-options-list">
              <div
                className={`sport-option-item ${
                  !field.value ? "selected" : ""
                }`}
                onClick={() => field.onChange(false)}
              >
                <div className="sport-option-content">
                  <SportsEsportsIcon
                    sx={{
                      color: !field.value
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      fontSize: 36,
                    }}
                  />
                  <div className="sport-option-text">
                    <div className="sport-option-name">Sin torneos</div>
                    <div className="sport-option-desc">
                      Solo juego recreativo
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`sport-option-item ${field.value ? "selected" : ""}`}
                onClick={() => field.onChange(true)}
              >
                <div className="sport-option-content">
                  <EmojiEventsIcon
                    sx={{
                      color: field.value
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      fontSize: 36,
                    }}
                  />
                  <div className="sport-option-text">
                    <div className="sport-option-name">Con torneos</div>
                    <div className="sport-option-desc">
                      He jugado competiciones
                    </div>
                  </div>
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
              ¿Con qué frecuencia juegas al pádel?
            </p>
            <div className="sport-frequency-options">
              {PLAY_FREQUENCIES.map((freq) => (
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
                          <SportsTennisIcon
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
