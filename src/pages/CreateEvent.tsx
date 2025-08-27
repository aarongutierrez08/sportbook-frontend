import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { MatchDetails, SportEvent, SportEventForm } from "../types/events";
import { createEvent } from "../api/eventsApi";
import { format } from "date-fns";
import {mapPitchSize, stringToList} from "../utils/events";
import LocationPickerMap from "../components/LocationPickerMap.tsx";

const CreateEvent: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<SportEventForm>();

  const sport = watch("sport");

  const onSubmit: SubmitHandler<SportEventForm> = async (data) => {
    try {
      const players = stringToList(data.playersText);

      let matchDetails: MatchDetails = {}
      if (data.sport === "FOOTBALL") {
        matchDetails = {
          pitchSize: mapPitchSize(data.pitchSize ?? 5),
          firstTeam: {
              color: data.firstTeamColor,
              players: []
          },
          secondTeam: {
              color: data.secondTeamColor,
              players: []
          },
        };
      } else if (data.sport === "PADDEL" || data.sport === "VOLLEY") {
        if (stringToList(data.teams).length === 0) {
            matchDetails = {
                teams: [{ color: "Negro", players: [] }, { color: "Blanco", players: [] }],
            }
        } else {
            matchDetails = {
                teams: stringToList(data.teams).map(team => {
                    return {
                        color: team,
                        players: []
                    }
                }),
            };
        }
      }

      const payload: SportEvent = {
        id: 0,
        sport: data.sport,
        minPlayers: Number(data.minPlayers),
        maxPlayers: Number(data.maxPlayers),
        dateTime: format(new Date(data.dateTime), "yyyy-MM-dd HH:mm:ss"),
        location: { x: data.location.x, y: data.location.y, placeName: data.location.placeName },
        transferData: {
          cbu: data.cbu,
          alias: data.alias,
        },
        creator: data.creator,
        organizer: data.organizer,
        players,
        matchDetails,
        cost: data.cost,
      };

      await createEvent(payload);
    } catch (e) {
      console.error("No se pudo crear el evento por:", e);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="page-title">🏆 Crear Evento Deportivo</h2>

        <form className="create-event-form" onSubmit={handleSubmit(onSubmit)}>
          {/* SPORT */}
          <div className="form-group">
            <label>Deporte</label>
            <select {...register("sport", { required: { value: true, message: "Este campo es obligatorio" } })}>
              <option value="">Seleccionar deporte...</option>
              <option value="FOOTBALL">⚽ Fútbol</option>
              <option value="PADDEL">🏓 Pádel</option>
              <option value="VOLLEY">🏐 Vóley</option>
            </select>
            {errors.sport && (
              <div className="input-error">Este campo es obligatorio</div>
            )}
          </div>

          {/* DATE */}
          <div className="form-group">
            <label>Fecha y Hora</label>
            <input
              type="datetime-local"
              {...register("dateTime", { required: { value: true, message: "Este campo es obligatorio" } })}
            />
            {errors.dateTime && (
              <div className="input-error">Este campo es obligatorio</div>
            )}
          </div>

            {/* LOCATION */}
            <div className="form-group form-full">
                <label>Ubicación</label>
                <LocationPickerMap
                    lat={watch("location.x")}
                    lng={watch("location.y")}
                    onChange={(lat, lng, placeName) => {
                        setValue("location.x", lat, { shouldValidate: true });
                        setValue("location.y", lng, { shouldValidate: true });
                        if (placeName) {
                            setValue("location.placeName", placeName);
                        }
                    }}
                />

                <input type="hidden" {...register("location.x", { valueAsNumber: true })} />
                <input type="hidden" {...register("location.y", { valueAsNumber: true })} />

                <div>
                    <input
                        type="text"
                        placeholder="Nombre del lugar"
                        {...register("location.placeName", { required: "Este campo es obligatorio" })}
                    />
                </div>
            </div>


            {/* CREATOR */}
          <div className="form-group">
            <label>Creador</label>
            <input
              type="text"
              placeholder="Tu nombre"
              {...register("creator", { required: { value: true, message: "Este campo es obligatorio" } })}
            />
            {errors.creator && <div className="input-error">Obligatorio</div>}
          </div>

          {/* ORGANIZER */}
          <div className="form-group">
            <label>Organizador</label>
            <input
              type="text"
              placeholder="Nombre del organizador"
              {...register("organizer", { required: { value: true, message: "Este campo es obligatorio" } })}
            />
            {errors.organizer && <div className="input-error">Obligatorio</div>}
          </div>

          {/* MIN/MAX PLAYERS */}
          <div className="form-group">
            <label>Jugadores Mínimos</label>
            <input
              type="number"
              placeholder="2"
              min={1}
              {...register("minPlayers", {
                required: { value: true, message: "Este campo es obligatorio" },
                min: 1,
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="form-group">
            <label>Jugadores Máximos</label>
            <input
              type="number"
              placeholder="10"
              {...register("maxPlayers", {
                required: { value: true, message: "Este campo es obligatorio" },
                min: 1,
                valueAsNumber: true,
                validate: (v, f) => { if (v <= (f.minPlayers ?? 1)) return "El número máximo de jugadores no puede ser menor al mínimo."; },
              })}
            />
            {errors.maxPlayers && (
              <div className="input-error">{errors.maxPlayers.message}</div>
            )}
          </div>

          {/* PAYMENT */}
          <div className="form-group form-full">
            <div className="payment-section">
              <h3>💰 Información de Pago (Opcional)</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label>CBU</label>
                  <input
                    type="number"
                    placeholder="1234567890123456789012"
                    {...register("cbu", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Alias</label>
                  <input
                    type="text"
                    placeholder="deportes.juan"
                    {...register("alias")}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div className="form-group">
                  <label>Costo</label>
                  <input
                    type="number"
                    placeholder="10.000"
                    {...register("cost")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PLAYERS */}
          <div className="form-group form-full">
            <label>Jugadores (uno por línea o separados por coma)</label>
            <textarea rows={4} {...register("playersText")} />
          </div>

          {/* DYNAMIC MATCH DETAILS */}
          {sport === "FOOTBALL" && (
            <div className="form-group form-full">
              <label>Detalles de Fútbol</label>
              <div>
                <input
                  type="number"
                  placeholder="Tamaño cancha (ej: 5)"
                  {...register("pitchSize", { valueAsNumber: true })}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Color equipo 1"
                  {...register("firstTeamColor")}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Color equipo 2"
                  {...register("secondTeamColor")}
                />
              </div>
            </div>
          )}

          {(sport === "PADDEL" || sport === "VOLLEY") && (
            <div className="form-group form-full">
              <label>Equipos (separados por coma o enter)</label>
              <textarea
                rows={3}
                placeholder="RED, GREEN, BLUE"
                {...register("teams")}
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="form-full">
            <button type="submit" className="btn" disabled={isSubmitting}>
              🚀 Crear Evento
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="btn btn-secondary"
            >
              🔄 Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
