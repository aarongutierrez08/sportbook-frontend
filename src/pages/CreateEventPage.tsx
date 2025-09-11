import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { SportEvent, SportEventForm } from "../types/events.ts";
import { createEvent } from "../api/eventsApi.ts";
import { format } from "date-fns";
import { matchDetailsBuilder } from "../utils/matchDetailsBuilder.ts";
import { FormField } from "../components/FormField.tsx";
import { MatchDetailsFields } from "../components/MatchDetailsFields.tsx";
import { PaymentFields } from "../components/PaymentFields.tsx";
import LocationPickerMap from "../components/LocationPickerMap.tsx";
import toast from "react-hot-toast";
import { REQUIRED } from "../constants/events.ts";

const CreateEventPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SportEventForm>();

  const sport = watch("sport");

  const onSubmit: SubmitHandler<SportEventForm> = async (data) => {
    const payload: SportEvent = {
      id: 0,
      ...data,
      dateTime: format(new Date(data.dateTime), "yyyy-MM-dd HH:mm:ss"),
      transferData: {
        cbu: data.cbu,
        alias: data.alias,
      },
      players: [],
      ...matchDetailsBuilder(data),
    };

    toast.promise(
      async () => {
        await createEvent(payload);
      },
      {
        loading: "Intentando crear evento...",
        success: "Evento creado exitosamente",
        error: (err: Error) => `No se pudo crear el evento: ${err.message}`,
      }
    );
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
              <option value="PADDLE">🏓 Pádel</option>
              <option value="VOLLEY">🏐 Vóley</option>
            </select>
          </FormField>

          <FormField label="Fecha y Hora" error={errors.dateTime}>
            <input
              type="datetime-local"
              {...register("dateTime", { required: REQUIRED })}
            />
          </FormField>

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

            <input
              type="hidden"
              {...register("location.x", { valueAsNumber: true })}
            />
            <input
              type="hidden"
              {...register("location.y", { valueAsNumber: true })}
            />

            <div>
              <input
                type="text"
                placeholder="Nombre del lugar"
                {...register("location.placeName", {
                  required: "Este campo es obligatorio",
                })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Creador</label>
            <input
              type="text"
              placeholder="Tu nombre"
              {...register("creator", {
                required: { value: true, message: "Este campo es obligatorio" },
              })}
            />
            {errors.creator && <div className="input-error">Obligatorio</div>}
          </div>

          <FormField label="Organizador" error={errors.organizer}>
            <input
              type="text"
              placeholder="Nombre del organizador"
              {...register("organizer", { required: REQUIRED })}
            />
          </FormField>

          <FormField label="Jugadores Mínimos" error={errors.minPlayers}>
            <input
              type="number"
              placeholder="2"
              {...register("minPlayers", {
                required: REQUIRED,
                min: 1,
                valueAsNumber: true,
              })}
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
                  value < (f.minPlayers ?? 1)
                    ? "El número máximo de jugadores no puede ser menor al mínimo."
                    : true,
              })}
            />
          </FormField>

          <PaymentFields register={register} errors={errors} />

          <MatchDetailsFields
            sport={sport}
            register={register}
            errors={errors}
          />

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

export default CreateEventPage;
