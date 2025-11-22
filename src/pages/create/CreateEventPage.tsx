import React from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { createEvent, type CreateEventRequest } from "../../api/eventsApi.ts";
import { format } from "date-fns";
import { FormField } from "../../commons/components/FormField.tsx";
import { MatchDetailsFields } from "../../commons/components/MatchDetailsFields.tsx";
import { PaymentFields } from "../../commons/components/PaymentFields.tsx";
import LocationPickerMap from "../../commons/components/LocationPickerMap.tsx";
import toast from "react-hot-toast";
import { REQUIRED } from "../../constants/events.ts";
import type {
  PitchSize,
  Player,
  Sport,
  TeamColor,
} from "../../types/apiTypes.ts";

export interface SportEventForm {
  sport: Sport;
  cost: number;
  cbu?: string;
  alias?: string;
  location: {
    x: number;
    y: number;
    placeName: string;
  };
  pitchSize: PitchSize;
  minPlayers: number;
  maxPlayers: number;
  dateTime: string;

  firstTeamColor: TeamColor;
  secondTeamColor: TeamColor;
  firstTeamPlayersInput: Array<Player>;
  secondTeamPlayersInput: Array<Player>;

  allEventPlayersInput: Array<Player>;
}

const CreateEventPage: React.FC = () => {
  const methods = useForm<SportEventForm>({
    defaultValues: {
      sport: undefined,
      cost: 0,
      location: { x: 0, y: 0, placeName: "" },
      minPlayers: 2,
      maxPlayers: 10,
      dateTime: "",
      firstTeamPlayersInput: [],
      secondTeamPlayersInput: [],
      allEventPlayersInput: [],

      firstTeamColor: "BLUE",
      secondTeamColor: "RED",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<SportEventForm> = async (data) => {
    const simplifyUser = (u?: { id?: number }) =>
      u?.id ? { id: u.id } : undefined;

    const simplifyPlayers = (players?: Player[]) =>
      (players ?? []).map((p) => ({
        name: p.name,
        user: simplifyUser(p.user),
      }));

    const generalPlayers = simplifyPlayers(data.allEventPlayersInput);

    const payload: CreateEventRequest = {
      sport: data.sport as Sport,
      minPlayers: data.minPlayers,
      maxPlayers: data.maxPlayers,
      cost: data.cost,
      dateTime: format(new Date(data.dateTime), "yyyy-MM-dd HH:mm:ss"),
      location: {
        x: String(data.location.x),
        y: String(data.location.y),
        placeName: data.location.placeName,
      },
      transferData: {
        cbu: data.cbu?.toString(),
        alias: data.alias,
      },
      pitchSize: data.pitchSize,
      players: generalPlayers,
      teams: [
        { color: data.firstTeamColor, players: data.firstTeamPlayersInput },
        { color: data.secondTeamColor, players: data.secondTeamPlayersInput },
      ],
    };

    await toast.promise(createEvent(payload), {
      loading: "Creando evento...",
      success: "Evento creado exitosamente 🎉",
      error: (err: Error) => `No se pudo crear el evento: ${err.message}`,
    });

    reset();
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className="card">
          <h2 className="page-title">Nuevo evento</h2>

          <FormProvider {...methods}>
            <form
              className="create-event-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {}
              <FormField label="Deporte" error={errors.sport}>
                <select {...register("sport", { required: REQUIRED })}>
                  <option value="">Seleccionar deporte...</option>
                  <option value="FOOTBALL">⚽ Fútbol</option>
                  <option value="PADDLE">🏓 Pádel</option>
                  <option value="VOLLEY">🏐 Vóley</option>
                </select>
              </FormField>

              {}
              <FormField label="Fecha y Hora" error={errors.dateTime}>
                <input
                  type="datetime-local"
                  {...register("dateTime", { required: REQUIRED })}
                />
              </FormField>

              {}
              <div className="form-group form-full">
                <label>Ubicación</label>
                <LocationPickerMap
                  lat={watch("location.x")}
                  lng={watch("location.y")}
                  onChange={(lat, lng, placeName) => {
                    setValue("location.x", lat, { shouldValidate: true });
                    setValue("location.y", lng, { shouldValidate: true });
                    if (placeName) setValue("location.placeName", placeName);
                  }}
                />
                <input type="hidden" {...register("location.x")} />
                <input type="hidden" {...register("location.y")} />
                <input
                  type="text"
                  placeholder="Nombre del lugar"
                  {...register("location.placeName", {
                    required: "Obligatorio",
                  })}
                />
              </div>

              {}
              <FormField label="Jugadores Mínimos" error={errors.minPlayers}>
                <input
                  type="number"
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
                  {...register("maxPlayers", {
                    required: REQUIRED,
                    min: 1,
                    valueAsNumber: true,
                    validate: (value, f) =>
                      value < (f.minPlayers ?? 1)
                        ? "El número máximo no puede ser menor al mínimo."
                        : true,
                  })}
                />
              </FormField>

              {}
              <PaymentFields register={register} errors={errors} />

              {}
              <MatchDetailsFields
                sport={watch("sport")}
                register={register}
                errors={errors}
              />

              {}
              <div className="buttons-container form-full">
                <button
                  type="submit"
                  className="btn btn--lg"
                  disabled={isSubmitting}
                >
                  Crear
                </button>
                <button
                  type="button"
                  className="btn btn--lg btn--secondary"
                  onClick={() => reset()}
                >
                  Limpiar
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
