import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getEvent, updateEvent } from "../api/eventsApi";
import type {
  SportEvent,
  UpdateEventParams,
  FootballEvent,
  PaddleEvent,
  VolleyEvent,
} from "../types/events";

import "../styles/eventPage.css";
import FootballEventDetails from "../components/events/FootballEventDetails";
import PaddleEventDetails from "../components/events/PaddleEventDetails";
import VolleyEventDetails from "../components/events/VolleyEventDetails";
import FinishEventButton from "../components/FinishEventButton";
import EventStatsModal from "../components/events/modals/event-stats/EventStatsModal";

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<SportEvent | null>(null);
  const [editForm, setEditForm] = useState<UpdateEventParams>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editingField, setEditingField] = useState<
    keyof UpdateEventParams | null
  >(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEvent(Number(id))
      .then(setEvent)
      .catch(() => toast.error("Error al cargar el evento"));
  }, [id]);

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
      locationX: lat,
      locationY: lng,
      locationPlaceName: placeName,
    }));
    setHasChanges(true);
    setIsEditingLocation(false);
  };

  const handleSave = async () => {
    if (!id || !event || !hasChanges) return;
    try {
      const updatedEvent = await updateEvent(Number(id), editForm);
      setEvent(updatedEvent);
      setEditForm({});
      setHasChanges(false);
      toast.success("¡Evento actualizado exitosamente!");
    } catch {
      toast.error("Error al actualizar el evento");
    }
  };

  if (!event) return <div>Cargando evento...</div>;

  const renderEventDetails = () => {
    const commonProps = {
      editForm,
      isEditingLocation,
      setIsEditingLocation,
      handleLocationChange,
      editingField,
      setEditingField,
      onFieldChange: handleFieldChange,
    };

    switch (event.sport) {
      case "FOOTBALL":
        return (
          <FootballEventDetails
            event={event as FootballEvent}
            {...commonProps}
          />
        );
      case "PADDLE":
        return (
          <PaddleEventDetails event={event as PaddleEvent} {...commonProps} />
        );
      case "VOLLEY":
        return (
          <VolleyEventDetails event={event as VolleyEvent} {...commonProps} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="event-page-root">
      <div className="event-page-container">
        <h2>{event.sport}</h2>
        {renderEventDetails()}
        <div className="save-changes-container">
          {hasChanges && (
            <button onClick={handleSave} className="save-changes-button">
              Guardar Cambios
            </button>
          )}
          {event.isFinished && (
            <button
              type="button"
              className="save-changes-button"
              onClick={() => setShowStats(true)}
              aria-haspopup="dialog"
              aria-expanded={showStats}
            >
              Ver estadísticas
            </button>
          )}
          <FinishEventButton event={event} />
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
