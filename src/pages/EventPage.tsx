import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, updateEvent } from "../api/eventsApi";
import type {FootballEvent, PaddleEvent, VolleyEvent, SportEvent, UpdateEventParams} from "../types/events";
import "../styles/eventPage.css";
import toast from "react-hot-toast";
import FootballEventDetails from "../components/events/FootballEventDetails";
import PaddleEventDetails from "../components/events/PaddleEventDetails";
import VolleyEventDetails from "../components/events/VolleyEventDetails";
import FinishEventButton from '../components/FinishEventButton';

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<SportEvent | null>(null);
  const [editForm, setEditForm] = useState<UpdateEventParams>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editingField, setEditingField] = useState<keyof UpdateEventParams | null>(null);

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

  const handleEditClick = (field: keyof UpdateEventParams) => {
    setEditingField(field);
    if (!editForm[field]) {
      let value: string | number = '';
      if (event) {
        switch (field) {
          case 'cost':
            value = event.cost;
            break;
          case 'pitchSize':
            value = 'pitchSize' in event ? (event as any).pitchSize : '';
            break;
          case 'locationPlaceName':
            value = event.location.placeName;
            break;
          case 'transferDataCbu':
            value = event.transferData.cbu;
            break;
          case 'transferDataAlias':
            value = event.transferData.alias;
            break;
          case 'creator':
            value = event.creator;
            break;
          case 'organizer':
            value = event.organizer;
            break;
          case 'locationX':
            value = event.location.x;
            break;
          case 'locationY':
            value = event.location.y;
            break;
        }
      }

      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderEditableField = (label: string, value: string | number, field: keyof UpdateEventParams, type: string = 'text') => (
    <p className="editable-field">
      {label}: {' '}
      {editingField === field ? (
        <input
          type={type}
          value={editForm[field] !== undefined ? editForm[field] : value}
          onChange={(e) => handleInputChange(e, field)}
          onBlur={() => setEditingField(null)}
          className="inline-edit-input"
          autoFocus
        />
      ) : (
        <span>{editForm[field] !== undefined ? editForm[field] : value}</span>
      )}
      <span
        className="edit-icon"
        title="Editar"
        onClick={() => handleEditClick(field)}
        style={{ cursor: 'pointer' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ verticalAlign: 'middle' }}
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </span>
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
        <div className="save-changes-container">
          {hasChanges && (
            <button onClick={handleSave} className="save-changes-button">
              Guardar Cambios
            </button>
          )}
          <FinishEventButton
            eventId={Number(id)}
            onFinish={() => window.location.reload()}
          />
        </div>
      </div>
    </div>
  );
};

export default EventPage;
