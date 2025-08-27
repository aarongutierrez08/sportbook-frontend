import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { SportEvent, SportEventForm } from "../types/events";
import { createEvent } from "../api/eventsApi";
import { format } from "date-fns";
import { stringToList } from "../utils/events";
import { useMatchDetailsBuilder } from "../hooks/useMatchDetailsBuilder";
import { FormField } from "../components/FormField";
import { MatchDetailsFields } from "../components/MatchDetailsFields";
import { PaymentFields } from "../components/PaymentFields";

const REQUIRED = { value: true, message: "Este campo es obligatorio" };

const CreateEvent: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SportEventForm>();

  const sport = watch("sport");
  const buildMatchDetails = useMatchDetailsBuilder();

  const onSubmit: SubmitHandler<SportEventForm> = async (data) => {
    try {
      const payload: SportEvent = {
        ...data,
        dateTime: format(new Date(data.dateTime), "yyyy-MM-dd HH:mm:ss"),
        players: stringToList(data.playersText),
        matchDetails: buildMatchDetails(data),
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
          <FormField label="Deporte" error={errors.sport}>
            <select {...register("sport", { required: REQUIRED })}>
              <option value="">Seleccionar deporte...</option>
              <option value="FOOTBALL">⚽ Fútbol</option>
              <option value="PADDEL">🏓 Pádel</option>
              <option value="VOLLEY">🏐 Vóley</option>
            </select>
          </FormField>

          <FormField label="Fecha y Hora" error={errors.dateTime}>
            <input type="datetime-local" {...register("dateTime", { required: REQUIRED })} />
          </FormField>

          {/* Location */}
          <div className="form-group form-full">
            <label>Ubicación (Coordenadas)</label>
            <div className="location-inputs">
              <input
                type="number"
                placeholder="Latitud (X)"
                step="any"
                {...register("location.x", { valueAsNumber: true })}
              />
              <input
                type="number"
                placeholder="Longitud (Y)"
                step="any"
                {...register("location.y", { valueAsNumber: true })}
              />
            </div>
          </div>

          <FormField label="Creador" error={errors.creator}>
            <input type="text" placeholder="Tu nombre" {...register("creator", { required: REQUIRED })} />
          </FormField>

          <FormField label="Organizador" error={errors.organizer}>
            <input type="text" placeholder="Nombre del organizador" {...register("organizer", { required: REQUIRED })} />
          </FormField>

          <FormField label="Jugadores Mínimos" error={errors.minPlayers}>
            <input
              type="number"
              placeholder="2"
              {...register("minPlayers", { required: REQUIRED, min: 1, valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Jugadores Máximos" error={errors.maxPlayers}>
            <input
              type="number"
              placeholder="10"
              {...register("maxPlayers", {
                required: REQUIRED,
                min: 1,
                valueAsNumber: true,
                validate: (value, f) =>
                  value <= (f.minPlayers ?? 1) ? "El número máximo de jugadores no puede ser menor al mínimo." : true,
              })}
            />
          </FormField>

          <PaymentFields register={register} errors={errors} />

          <FormField label="Jugadores (uno por línea o separados por coma)" fullWidth>
            <textarea rows={4} {...register("playersText")}/>
          </FormField>

          <MatchDetailsFields sport={sport} register={register} errors={errors} />

          <div className="form-full">
            <button type="submit" className="btn" disabled={isSubmitting}>
              🚀 Crear Evento
            </button>
            <button type="button" onClick={() => reset()} className="btn btn-secondary">
              🔄 Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
