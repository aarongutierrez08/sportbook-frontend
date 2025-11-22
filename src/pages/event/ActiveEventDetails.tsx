import React, { useState, useMemo } from "react";
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
import FinishEventButton from "./finish-event-modal/FinishEventButton";

import EventFairnessRatingComponent from "../../pages/event/commons/EventFairnessRatingComponent";
import { PlayerList } from "../../pages/event/commons/PlayerList";

import { isLoggedUserInEvent } from "../../utils/events";
import { COLOR_MAPPER } from "../../constants/events";
import type {
  Event,
  PitchSize,
  Sport,
  FootballEvent,
} from "../../types/apiTypes";
import "../../pages/event/EventPage.css";
import AddPlayerButton from "../../commons/components/AddPlayerButton";
import FootballPitch from "../../commons/components/FootballPitch";

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

  const isUserInEvent = useMemo(() => {
    if (!loggedUser) return false;
    const inUnassigned = event.unnasignedPlayers.some(
      (p) => p.user?.id === loggedUser.id
    );
    const inTeams = event.teams?.some((t) =>
      t.players.some((p) => p.user?.id === loggedUser.id)
    );
    return inUnassigned || inTeams;
  }, [event, loggedUser]);

  const hasUnassignedPlayers = event.unnasignedPlayers.length > 0;

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

  const pitchKey = useMemo(() => {
    if (event.sport !== "FOOTBALL") return "";
    const ids = event.teams.map((p) => p.id);
    return ids.join("-");
  }, [event.teams, event.sport]);

  return (
    <div className="event-page-root">
      <div className="event-page-container">
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

        <div className="event-page-section full-width-teams-section">
          <h3>Equipos</h3>
          <div className="event-page-team-section">
            {event.teams?.map((team) => {
              const isUserInThisTeam = team.players.some(
                (p) => p.user?.id === loggedUser?.id
              );
              const maxPerTeam = Math.ceil(event.maxPlayers / 2);
              const isTeamFull = team.players.length >= maxPerTeam;

              const isDisabled =
                isUserInThisTeam || !isUserInEvent || isTeamFull;

              return (
                <div
                  key={team.id}
                  className="event-page-team-card"
                  data-color={team.color}
                >
                  <h4>{team.name || `Equipo ${COLOR_MAPPER[team.color]}`}</h4>

                  <AddPlayerButton
                    eventId={event.id}
                    teamId={team.id}
                    onPlayerAdded={onEventUpdate}
                    disabled={isDisabled}
                  />

                  <div className="team-players-scroll-container">
                    <PlayerList players={team.players!} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="secondary-details-grid"
          style={{
            gridTemplateColumns: hasUnassignedPlayers ? "1fr 1fr" : "1fr",
          }}
        >
          <div className="event-page-section">
            <h3>Balance</h3>
            <EventFairnessRatingComponent
              eventId={event.id}
              teams={event.teams!}
              onBalanceComplete={refreshEventData}
              canBalance={canEditEvent}
            />
          </div>

          {hasUnassignedPlayers && (
            <div className="event-page-section no-team-players">
              <h3>Jugadores sin equipo</h3>
              <div className="unassigned-players-scroll-container">
                <PlayerList players={event.unnasignedPlayers} />
              </div>
            </div>
          )}
        </div>

        {event.sport === "FOOTBALL" && (
          <div className="event-page-section" style={{ marginTop: "2rem" }}>
            <h3>Distribución táctica</h3>
            <FootballPitch
              key={pitchKey}
              eventId={event.id}
              firstTeamColor={event.teams[0]?.color}
              secondTeamColor={event.teams[1]?.color}
              pitchSize={Number((event as FootballEvent).pitchSize)}
              canEdit={canEditEvent}
              pictures={pictures}
            />
          </div>
        )}

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
