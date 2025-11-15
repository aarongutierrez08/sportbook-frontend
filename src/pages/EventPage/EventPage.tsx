import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getEvent,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../../api/eventsApi";

import { useAuth } from "../../auth/useAuth";
import "../../styles/eventPage.css";
import EventStatsModal from "./components/event-stats/EventStatsModal";
import RenderEventDetails from "../../commons/components/events/RenderEventDetails";
import EventBasicInfoSection from "../../commons/components/events/EventBasicInfoSection.tsx";
import EventLocationSection from "../../commons/components/events/EventLocationSection";
import EventPaymentSection from "../../commons/components/events/EventPaymentSection";
import type { Event, PitchSize } from "../../types/apiTypes";
import FinishEventButton from "../../commons/components/FinishEventButton";
import { isLoggedUserInEvent } from "../../utils/events.ts";

async function fetchEventData(id: string, setEvent: (ev: Event) => void) {
  try {
    const updatedEvent = await getEvent(Number(id));
    setEvent(updatedEvent);
  } catch {
    toast.error("Error al cargar el evento");
  }
}

async function saveEvent(
  id: string,
  editForm: UpdateEventParams,
  setEvent: (ev: Event) => void,
  setEditForm: (f: UpdateEventParams) => void,
  setHasChanges: (b: boolean) => void
) {
  try {
    const updatedEvent = await updateEvent(Number(id), editForm);
    setEvent(updatedEvent);
    setEditForm({});
    setHasChanges(false);
    toast.success("¡Evento actualizado exitosamente!");
  } catch {
    toast.error("Error al actualizar el evento");
  }
}

async function joinOrLeaveEvent(
  eventId: number,
  action: "join" | "leave",
  setEvent: (ev: Event) => void
) {
  const apiCall = action === "join" ? joinEvent : leaveEvent;
  const messages =
    action === "join"
      ? {
          loading: "Uniéndote al evento...",
          success: "¡Te uniste al evento!",
          error: "Error al unirse al evento",
        }
      : {
          loading: "Saliendo del evento...",
          success: "Has salido del evento",
          error: "Error al salir del evento",
        };

  await toast.promise(
    apiCall(eventId).then(() => getEvent(eventId).then(setEvent)),
    messages
  );
}

export interface UpdateEventParams {
  cost?: number;
  pitchSize?: PitchSize;
  locationPlaceName?: string;
  transferDataCbu?: string;
  transferDataAlias?: string;
  creator?: string;
  organizerId?: number;
  locationX?: string;
  locationY?: string;
}

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState<UpdateEventParams>({});
  const [hasChanges, setHasChanges] = useState(false);

  const [showStats, setShowStats] = useState(false);

  const { user: loggedUser } = useAuth();

  const canEditEvent =
    loggedUser?.role === "ORGANIZER" && loggedUser?.id === event?.organizer?.id;

  useEffect(() => {
    if (id) fetchEventData(id, setEvent);
  }, [id]);

  if (!event) return <div>Cargando evento...</div>;

  const handleFieldChange = (
    field: keyof UpdateEventParams,
    value: string | number
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLocationChange = (
    lat: number,
    lng: number,
    placeName?: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      locationX: String(lat),
      locationY: String(lng),
      locationPlaceName: placeName,
    }));
    setHasChanges(true);
  };

  return (
    <div className="event-page-root">
      <div className="event-page-container">
        <h2>{event.sport}</h2>

        <div className="event-page-details">
          <EventBasicInfoSection
            event={event}
            editForm={editForm}
            onFieldChange={handleFieldChange}
            canEdit={canEditEvent}
          />
          <EventLocationSection
            event={event}
            editForm={editForm}
            onFieldChange={handleFieldChange}
            canEdit={canEditEvent}
            onChangeLocation={handleLocationChange}
          />
          <EventPaymentSection
            event={event}
            editForm={editForm}
            onFieldChange={handleFieldChange}
            canEdit={canEditEvent}
          />
        </div>

        <RenderEventDetails
          event={event}
          onEventUpdate={setEvent}
          onBalanceComplete={() => fetchEventData(id!, setEvent)}
        />

        <div className="buttons-container">
          {hasChanges && canEditEvent && (
            <button
              onClick={() =>
                saveEvent(id!, editForm, setEvent, setEditForm, setHasChanges)
              }
              className="btn"
              disabled={!hasChanges}
            >
              Guardar Cambios
            </button>
          )}
          {event.isFinished && (
            <button
              type="button"
              className="btn"
              onClick={() => setShowStats(true)}
              aria-haspopup="dialog"
              aria-expanded={showStats}
            >
              Ver estadísticas
            </button>
          )}
          {!event.isFinished &&
            (!isLoggedUserInEvent(event, loggedUser) ? (
              <button
                onClick={() => joinOrLeaveEvent(event.id, "join", setEvent)}
                className="btn btn--lg"
              >
                Unirse al evento
              </button>
            ) : (
              <button
                onClick={() => joinOrLeaveEvent(event.id, "leave", setEvent)}
                className="btn btn--secondary btn--lg"
              >
                Salir del evento
              </button>
            ))}
          {canEditEvent && <FinishEventButton event={event} />}
        </div>
      </div>

      {id && (
        <EventStatsModal
          eventId={Number(id)}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
};

export default EventPage;
