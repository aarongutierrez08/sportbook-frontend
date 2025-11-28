import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  joinEvent,
  leaveEvent,
  updateEvent,
  getEvent,
  finishEvent,
} from "../../api/eventsApi";
import { useAuth } from "../../auth/useAuth";

import EventBasicInfoSection from "../../commons/events/EventBasicInfoSection";
import EventLocationSection from "../../commons/events/EventLocationSection";
import EventPaymentSection from "../../commons/events/EventPaymentSection";
import FinishEventButton from "./finish-event-modal/FinishEventButton";

import EventFairnessRatingComponent from "../../pages/event/commons/EventFairnessRatingComponent";
import { PlayerList } from "../../pages/event/commons/PlayerList";

import { isLoggedUserInEvent } from "../../utils/events";
import { COLOR_MAPPER, SPORT_LABELS } from "../../constants/events";
import type {
  Event,
  PitchSize,
  FootballEvent,
  FinishEventRequest,
} from "../../types/apiTypes";
import AddPlayerButton from "../../commons/components/AddPlayerButton";
import FootballPitch from "../../commons/components/FootballPitch";
import FinishEventModal from "./finish-event-modal/FinishEventModal";

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
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user: loggedUser, isOrganizer } = useAuth();

  const handleModalSubmit = async (params: FinishEventRequest) => {
    setIsSubmitting(true);
    try {
      await finishEvent(event.id, params);
      toast.success("Evento finalizado exitosamente");
      setShowModal(false);
      window.location.href = "/events";
    } catch {
      toast.error("Error al finalizar el evento");
    } finally {
      setShowModal(false);
    }
  };

  const canEditEvent = isOrganizer && loggedUser?.id === event?.organizer?.id;

  const isUserInEvent = useMemo(() => {
    if (!loggedUser) return false;
    const inUnassigned = event.unnasignedPlayers.some(
      (player) => player.user?.id === loggedUser.id
    );
    const inTeams = event.teams?.some((team) =>
      team.players.some((player) => player.user?.id === loggedUser.id)
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

    const teamComposition = event.teams
      .map((t) =>
        t.players
          .map((p) => p.id)
          .sort()
          .join(",")
      )
      .join("||");

    return `${event.id}-${teamComposition}-${Date.now()}`;
  }, [event.teams, event.sport, event.id]);

  const totalPlayersJoined =
    event.unnasignedPlayers.length +
    event.teams.reduce((acc, team) => acc + team.players.length, 0);

  const isEventFull = totalPlayersJoined >= event.maxPlayers;

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
                (player) => player.user?.id === loggedUser?.id
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
              // key={pitchKey}
              lastUpdate={pitchKey}
              eventId={event.id}
              firstTeamColor={event.teams[0]?.color}
              secondTeamColor={event.teams[1]?.color}
              pitchSize={Number((event as FootballEvent).pitchSize)}
              canEdit={canEditEvent}
              pictures={pictures}
            />
          </div>
        )}

        <div className="event-dock-spacer" />

        {/* BARRA FLOTANTE */}
        <div className="event-actions-dock">
          <div className="dock-content">
            <div className="dock-info">
              <span className="dock-status">
                {isLoggedUserInEvent(event, loggedUser)
                  ? "Estás participando"
                  : `Cupos: ${
                      event.teams.reduce(
                        (acc, t) => acc + t.players.length,
                        0
                      ) + event.unnasignedPlayers.length
                    }/${event.maxPlayers}`}
              </span>
            </div>

            <div className="dock-buttons">
              {/* 1. Botón GUARDAR CAMBIOS (Naranja sólido) */}
              {hasChanges && canEditEvent && (
                <button
                  onClick={saveEvent}
                  className="btn btn--lg btn--secondary btn--pill btn--shadow"
                  disabled={!hasChanges}
                >
                  Guardar Cambios
                </button>
              )}

              {/* 2. Botón UNIRSE/SALIR */}
              {!isLoggedUserInEvent(event, loggedUser) ? (
                // Caso: NO estoy unido
                isEventFull ? (
                  // Caso: Lleno -> Botón deshabilitado
                  <button
                    disabled
                    className="btn btn--lg btn--disabled btn--pill"
                  >
                    Evento Lleno
                  </button>
                ) : (
                  // Caso: Hay lugar -> Botón Unirse
                  <button
                    onClick={() => joinOrLeave("join")}
                    className="btn btn--lg btn--pill btn--shadow"
                  >
                    Unirse ahora
                  </button>
                )
              ) : (
                // Caso: YA estoy unido -> Botón Salir
                <button
                  onClick={() => joinOrLeave("leave")}
                  className="btn btn--lg btn--danger-outline btn--pill"
                >
                  Salir
                </button>
              )}

              {/* 3. Botón FINALIZAR EVENTO */}
              {/* Nota: Asegúrate de que FinishEventButton acepte className o edítalo internamente para que use: "btn btn--lg btn--primary btn--pill" */}
              {canEditEvent && (
                <FinishEventButton
                  event={event}
                  onClick={() => setShowModal(true)}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <FinishEventModal
          event={event}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default ActiveEventDetails;
