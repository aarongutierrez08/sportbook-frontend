import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { VolleyProfileDTO } from "../../../types/user";
import { useTheme } from "@mui/material/styles";

import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import BlockIcon from "@mui/icons-material/Block";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ShieldIcon from "@mui/icons-material/Shield";
import WavesIcon from "@mui/icons-material/Waves";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const allVolleyPositions = [
  {
    id: "Setter",
    name: "Setter",
    icon: EmojiPeopleIcon,
    description: "Armador",
  },
  {
    id: "Opuesto",
    name: "Opuesto",
    icon: FlashOnIcon,
    description: "Atacante principal",
  },
  {
    id: "Central",
    name: "Central",
    icon: BlockIcon,
    description: "Bloqueador",
  },
  {
    id: "Punta",
    name: "Punta",
    icon: SportsVolleyballIcon,
    description: "Receptor-atacante",
  },
  {
    id: "Libero",
    name: "Líbero",
    icon: ShieldIcon,
    description: "Defensa especializada",
  },
];

const serveTypes = [
  {
    id: "float",
    name: "Flotante",
    icon: WavesIcon,
    description: "Saque sin rotación",
  },
  {
    id: "topspin",
    name: "Con efecto",
    icon: AutorenewIcon,
    description: "Saque con topspin",
  },
  {
    id: "jump",
    name: "En suspensión",
    icon: RocketLaunchIcon,
    description: "Saque potente en salto",
  },
  {
    id: "underhand",
    name: "Por abajo",
    icon: ArrowDownwardIcon,
    description: "Saque básico",
  },
];

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

export const VolleyProfileForm = () => {
  const { control } = useFormContext<VolleyProfileDTO>();
  const theme = useTheme();

  const favoritePosition = useWatch({
    control,
    name: "favoritePosition",
  }) as string;

  return (
    <>
      <Controller
        name="positions"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Posiciones favoritas</h3>
            <p className="sport-card-subtitle">
              Selecciona tus posiciones y marca tu favorita con una estrella
            </p>
            <div className="sport-options-list">
              {allVolleyPositions.map(
                ({ id, name, icon: Icon, description }) => {
                  const isSelected = field.value?.includes(id);
                  const isFavorite = favoritePosition === id;

                  return (
                    <div
                      key={id}
                      className={`sport-option-item ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          field.onChange(
                            field.value.filter((p: string) => p !== id)
                          );
                        } else {
                          field.onChange([...(field.value || []), id]);
                        }
                      }}
                    >
                      <div className="sport-option-content">
                        <Icon
                          sx={{
                            color: isSelected
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
                                favField.onChange(id);
                              }}
                            >
                              {isFavorite ? (
                                <StarIcon
                                  sx={{
                                    color: theme.palette.secondary.main,
                                    fontSize: 36,
                                  }}
                                />
                              ) : (
                                <StarBorderIcon
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: 36,
                                  }}
                                />
                              )}
                            </button>
                          )}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      />

      <Controller
        name="serveType"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Tipo de saque</h3>
            <p className="sport-card-subtitle">¿Cuál es tu saque preferido?</p>
            <div className="sport-options-list">
              {serveTypes.map(({ id, name, icon: Icon, description }) => (
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
        name="offensiveLevel"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel ofensivo</h3>
            <p className="sport-card-subtitle">¿Qué tan bueno eres atacando?</p>
            <div className="sport-level-container">
              <FlashOnIcon
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
                  className="sport-slider offensive"
                  style={{
                    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  }}
                />
                <div className="sport-level-bars">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`sport-bar ${
                        i < (field.value || 5) ? "active offensive" : ""
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
        name="defensiveLevel"
        control={control}
        render={({ field }) => (
          <div className="sport-card">
            <h3 className="sport-card-title">Nivel defensivo</h3>
            <p className="sport-card-subtitle">
              ¿Qué tan bueno eres defendiendo?
            </p>
            <div className="sport-level-container">
              <ShieldIcon
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
                  className="sport-slider defensive"
                  style={{
                    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  }}
                />
                <div className="sport-level-bars">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`sport-bar ${
                        i < (field.value || 5) ? "active defensive" : ""
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
                        {[...Array(freq.count)].map((_, i) => (
                          <SportsVolleyballIcon
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
