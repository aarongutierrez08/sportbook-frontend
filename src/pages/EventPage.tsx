import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, updateEvent } from "../api/eventsApi";
import type {FootballEvent, PaddleEvent, VolleyEvent, SportEvent, UpdateEventParams} from "../types/events";
import "../styles/eventPage.css";
import toast from "react-hot-toast";
import FootballEventDetails from "../components/events/FootballEventDetails";
import PaddleEventDetails from "../components/events/PaddleEventDetails";
import VolleyEventDetails from "../components/events/VolleyEventDetails";

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<SportEvent | null>(null);
  const [editForm, setEditForm] = useState<UpdateEventParams>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        const foundEvent = await getEvent(Number(id));
        setEvent(foundEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UpdateEventParams) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleLocationChange = (lat: number, lng: number, placeName?: string) => {
    setEditForm(prev => ({
      ...prev,
      locationX: lat,
      locationY: lng,
      locationPlaceName: placeName
    }));
    setHasChanges(true);
    setIsEditingLocation(false);
  };

  const handleSave = async () => {
    try {
      if (!id || !event || !hasChanges) return;
      
      const updatedEvent = await updateEvent(Number(id), editForm);
      setEvent(updatedEvent);
      setEditForm({});
      setHasChanges(false);
      toast.success("¡Evento actualizado exitosamente!");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Error al actualizar el evento");
    }
  };

  const renderEditableField = (label: string, value: string | number, field: keyof UpdateEventParams, type: string = 'text') => (
    <p className="editable-field">
      {label}: {' '}
      <input
        type={type}
        value={editForm[field] !== undefined ? editForm[field] : value}
        onChange={(e) => handleInputChange(e, field)}
        className="inline-edit-input"
      />
      <span className="edit-icon" title="Editar">✏️</span>
    </p>
  );

  if (!event) {
    return <div>Cargando evento...</div>;
  }

  const renderEventDetails = () => {
    const commonProps = {
      editForm,
      isEditingLocation,
      setIsEditingLocation,
      handleLocationChange,
      renderEditableField
    };

    switch (event.sport) {
      case "FOOTBALL":
        return <FootballEventDetails event={event as FootballEvent} {...commonProps} />;
      case "PADDLE":
        return <PaddleEventDetails event={event as PaddleEvent} {...commonProps} />;
      case "VOLLEY":
        return <VolleyEventDetails event={event as VolleyEvent} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="event-page-root">
      <div className="event-page-container">
        <h2>{event.sport}</h2>
        {renderEventDetails()}
        {hasChanges && (
          <div className="save-changes-container">
            <button onClick={handleSave} className="save-changes-button">
              Guardar Cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
