import React, {useEffect, useMemo, useState} from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {getEvent, joinEvent, leaveEvent, updateEvent} from "../../api/eventsApi";
import type {
    SportEvent,
    UpdateEventParams,
    FootballEvent,
    PaddleEvent,
    VolleyEvent, PlayerInfo,
} from "../../types/events";

import "../../styles/eventPage.css";
import FootballEventDetails from "../../commons/components/events/FootballEventDetails";
import PaddleEventDetails from "../../commons/components/events/PaddleEventDetails";
import VolleyEventDetails from "../../commons/components/events/VolleyEventDetails";
import FinishEventButton from "../../commons/components/FinishEventButton";
import EventStatsModal from "./components/event-stats/EventStatsModal";

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
  const loggedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);
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
      onEventUpdate: setEvent,
      isJoinTeamDisabled,
      onMapPlayers,
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

  const onMapPlayers = (players: PlayerInfo[])=> {
    return players.map((player) => (
      <li key={player?.user?.username}>{player.name}</li>
    ))
  }

  const isJoinTeamDisabled = (sportEvent: SportEvent, teamPlayers: PlayerInfo[], loggedUser: any) => {
      return sportEvent.isFinished || playerIsNotInEvent(sportEvent, loggedUser) || isPlayerInTeam(teamPlayers, loggedUser);
  }

  const playerIsNotInEvent = (sportEvent: SportEvent, loggedUser: any) => {
    return !sportEvent.players?.some((playerInfo) => playerInfo.user?.username === loggedUser.username);
  }

  const isPlayerInTeam = (teamPlayers: PlayerInfo[], loggedUser: any) => {
    return teamPlayers?.some((playerInfo) => playerInfo.user?.username === loggedUser.username);
  }

    const handleJoin = async (eventId: number) => {
        await toast.promise(
            joinEvent(eventId).then(() => {
                return getEvent(eventId).then(setEvent);
            }),
            {
                loading: "Uniéndote al evento...",
                success: "¡Te uniste al evento!",
                error: (err) => err?.response?.data?.message || "Error al unirse al evento"
            }
        );
    };

    const handleLeave = async (eventId: number) => {
        await toast.promise(
            leaveEvent(eventId).then(() => {
                return getEvent(eventId).then(setEvent);
            }),
            {
                loading: "Saliendo del evento...",
                success: "Has salido del evento",
                error: "Error al salir del evento"
            }
        );
    };

  const renderJoinLeaveButton = () => {
      if (playerIsNotInEvent(event, loggedUser)) {
         return <button onClick={() => handleJoin(event.id)} className="btn btn--lg">
              Unirse al evento
          </button>
      } else {
         return <button onClick={() => handleLeave(event.id)} className="btn btn--lg">
              Salir del evento
          </button>
        }
  }
  return (
    <div className="event-page-root">
      <div className="event-page-container">
        <h2>{event.sport}</h2>
        {renderEventDetails()}
        <div className="buttons-container">
          {hasChanges && (
            <button onClick={handleSave} className="btn">
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
          {!event.isFinished && (renderJoinLeaveButton())}
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
