import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  joinEvent,
  leaveEvent,
  updateEvent,
  getEvent,
} from "../../api/eventsApi";
import { useAuth } from "../../auth/useAuth";
import EventBasicInfoSection from "../../commons/events/EventBasicInfoSection";
import EventLocationSection from "../../commons/events/EventLocationSection";
import EventPaymentSection from "../../commons/events/EventPaymentSection";
import RenderEventDetails from "../../commons/events/RenderEventDetails";
import FinishEventButton from "./finish-event-modal/FinishEventButton";
import { isLoggedUserInEvent } from "../../utils/events";
import type { Event, PitchSize, Sport } from "../../types/apiTypes";

const SPORT_LABELS: Record<Sport, string> = {
  FOOTBALL: "Fútbol",
  PADDLE: "Pádel",
  VOLLEY: "Vóley",
};

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
  dateTime?: string;
  minPlayers?: number;
  maxPlayers?: number;
}

interface ActiveEventDetailsProps {
  event: Event;
  onEventUpdate: (updatedEvent: Event) => void;
  pictures: Record<number, string>;
}

const ActiveEventDetails: React.FC<ActiveEventDetailsProps> = ({
  event,
  onEventUpdate,
  pictures,
}) => {
  const [editForm, setEditForm] = useState<UpdateEventParams>({});
  const [hasChanges, setHasChanges] = useState(false);
  const { user: loggedUser } = useAuth();

  const canEditEvent =
    loggedUser?.role === "ORGANIZER" && loggedUser?.id === event?.organizer?.id;

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

  const saveEvent = async () => {
    try {
      const updatedEvent = await updateEvent(event.id, editForm);
      onEventUpdate(updatedEvent);
      setEditForm({});
      setHasChanges(false);
      toast.success("¡Evento actualizado exitosamente!");
    } catch {
      toast.error("Error al actualizar el evento");
    }
  };

  const joinOrLeave = async (action: "join" | "leave") => {
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
      apiCall(event.id).then(() => getEvent(event.id).then(onEventUpdate)),
      messages
    );
  };

  const refreshEventData = async () => {
    try {
      const updated = await getEvent(event.id);
      onEventUpdate(updated);
    } catch {
      toast.error("Error al recargar datos");
    }
  };

  return (
    <div className="event-page-root">
      <div className="event-page-container">
        {}
        <div className="active-event-header">
          <h2>{event.name || "Evento Sin Nombre"}</h2>
          <span className="sport-type-badge">
            {SPORT_LABELS[event.sport] || event.sport}
          </span>
        </div>

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
          pictures={pictures}
          onEventUpdate={onEventUpdate}
          onBalanceComplete={refreshEventData}
        />

        <div className="buttons-container">
          {hasChanges && canEditEvent && (
            <button onClick={saveEvent} className="btn" disabled={!hasChanges}>
              Guardar Cambios
            </button>
          )}

          {!isLoggedUserInEvent(event, loggedUser) ? (
            <button onClick={() => joinOrLeave("join")} className="btn btn--lg">
              Unirse al evento
            </button>
          ) : (
            <button
              onClick={() => joinOrLeave("leave")}
              className="btn btn--secondary btn--lg"
            >
              Salir del evento
            </button>
          )}

          {canEditEvent && <FinishEventButton event={event} />}
        </div>
      </div>
    </div>
  );
};

export default ActiveEventDetails;
