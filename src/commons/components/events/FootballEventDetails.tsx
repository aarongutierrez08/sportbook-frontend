import React, { useMemo } from "react";
import type {
  FootballEvent,
  PlayerInfo,
  SportEvent,
  UpdateEventParams,
} from "../../../types/events";
import { formatDate } from "../../../utils/events";
import MiniMap from "../MiniMap";
import LocationPickerMap from "../LocationPickerMap";
import FootballPitch from "../FootballPitch";
import EditableField from "../EditableField";
import AddPlayerButton from "../AddPlayerButton.tsx";
import { PlayerList } from "../../../pages/EventPage/components/PlayerList.tsx";
import EventFairnessRatingComponent from "../../../pages/EventPage/components/EventFairnessRatingComponent.tsx";
import { useAuth } from "../../../auth/useAuth.ts";

interface FootballEventDetailsProps {
  event: FootballEvent;
  editForm: UpdateEventParams;
  isEditingLocation: boolean;
  setIsEditingLocation: (val: boolean) => void;
  handleLocationChange: (lat: number, lng: number, placeName?: string) => void;
  editingField: keyof UpdateEventParams | null;
  setEditingField: (f: keyof UpdateEventParams | null) => void;
  onFieldChange: (
    field: keyof UpdateEventParams,
    value: string | number
  ) => void;
  onEventUpdate: (updatedEvent: FootballEvent) => void;
  isJoinTeamDisabled: (
    sportEvent: SportEvent,
    teamPlayers: PlayerInfo[],
    loggedUser: any
  ) => boolean;
  onBalanceComplete: () => void;
}

const FootballEventDetails: React.FC<FootballEventDetailsProps> = ({
  event,
  editForm,
  isEditingLocation,
  setIsEditingLocation,
  handleLocationChange,
  editingField,
  setEditingField,
  onFieldChange,
  onEventUpdate,
  isJoinTeamDisabled,
  onBalanceComplete,
}) => {
  const { user: loggedUser } = useAuth();

  const pitchKey = useMemo(() => {
    const firstTeamPlayers = event.firstTeam.players?.map((p) => p.id).join(",") || "";
    const secondTeamPlayers = event.secondTeam.players?.map((p) => p.id).join(",") || "";
    return `${firstTeamPlayers}-${secondTeamPlayers}`;
  }, [event.firstTeam.players, event.secondTeam.players]);

  return (
    <>
      <div className="event-page-details">
        <div className="event-page-section">
          <h3>Detalles del Evento</h3>
          <p>Fecha y hora: {formatDate(event.dateTime)}</p>
          <EditableField
            label="Organizador"
            field="organizer"
            value={event.organizer}
            editForm={editForm}
            editingField={editingField}
            onEditClick={setEditingField}
            onChange={onFieldChange}
            onBlur={() => setEditingField(null)}
          />
          <p>
            Jugadores: {event.players.length} / {event.minPlayers}
          </p>
          <EditableField
            label="Costo"
            field="cost"
            type="number"
            value={event.cost}
            editForm={editForm}
            editingField={editingField}
            onEditClick={setEditingField}
            onChange={onFieldChange}
            onBlur={() => setEditingField(null)}
          />
          {event.pitchSize && (
            <EditableField
              label="Tamaño de cancha"
              field="pitchSize"
              type="number"
              value={event.pitchSize}
              editForm={editForm}
              editingField={editingField}
              onEditClick={setEditingField}
              onChange={onFieldChange}
              onBlur={() => setEditingField(null)}
            />
          )}
        </div>

        <div className="event-page-section">
          <h3>Ubicación</h3>
          <EditableField
            label="Lugar"
            field="locationPlaceName"
            value={event.location.placeName}
            editForm={editForm}
            editingField={editingField}
            onEditClick={setEditingField}
            onChange={onFieldChange}
            onBlur={() => setEditingField(null)}
          />

          {!isEditingLocation ? (
            <div className="event-page-minimap">
              <MiniMap lat={event.location.x} lng={event.location.y} />
              <div className="buttons-container">
                <button
                  className="btn btn--block"
                  onClick={() => setIsEditingLocation(true)}
                >
                  Cambiar ubicación
                </button>
              </div>
            </div>
          ) : (
            <div className="location-picker-container">
              <LocationPickerMap
                lat={editForm.locationX ?? event.location.x}
                lng={editForm.locationY ?? event.location.y}
                onChange={handleLocationChange}
              />
              <button
                className="btn btn--secondary"
                onClick={() => setIsEditingLocation(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="event-page-section">
          <h3>Datos de Pago</h3>
          <EditableField
            label="Alias"
            field="transferDataAlias"
            value={event.transferData.alias}
            editForm={editForm}
            editingField={editingField}
            onEditClick={setEditingField}
            onChange={onFieldChange}
            onBlur={() => setEditingField(null)}
          />
          <EditableField
            label="CBU"
            field="transferDataCbu"
            value={event.transferData.cbu}
            editForm={editForm}
            editingField={editingField}
            onEditClick={setEditingField}
            onChange={onFieldChange}
            onBlur={() => setEditingField(null)}
          />
        </div>
      </div>

      <div className="team-and-stats-section">
        <div className="event-page-section">
          <h3>Equipos</h3>
          <div className="event-page-team-section">
            <div
              className="event-page-team-card"
              data-color={event.firstTeam.color}
            >
              <h4>Equipo {event.firstTeam.color}</h4>
              <AddPlayerButton
                eventId={event.id}
                teamId={event.firstTeam.id}
                onPlayerAdded={onEventUpdate}
                disabled={isJoinTeamDisabled(
                  event,
                  event.firstTeam.players!,
                  loggedUser
                )}
              />
              <PlayerList players={event.firstTeam.players!} />
            </div>
            <div
              className="event-page-team-card"
              data-color={event.secondTeam.color}
            >
              <h4>Equipo {event.secondTeam.color}</h4>
              <AddPlayerButton
                eventId={event.id}
                teamId={event.secondTeam.id}
                onPlayerAdded={onEventUpdate}
                disabled={isJoinTeamDisabled(
                  event,
                  event.secondTeam.players!,
                  loggedUser
                )}
              />
              <PlayerList players={event.secondTeam.players!} />
            </div>
          </div>
        </div>

        <div className="balance-and-players-column">
          <div className="event-page-section">
            <h3>Balance</h3>
            <EventFairnessRatingComponent
              eventId={event.id}
              teams={[event.firstTeam, event.secondTeam]}
              onBalanceComplete={onBalanceComplete}
            />
          </div>
          <div className="event-page-section no-team-players">
            <h3>Jugadores sin equipo</h3>
            <PlayerList
              players={event.players.filter(
                (player) =>
                  !event.firstTeam.players?.some((tp) => tp.id === player.id) &&
                  !event.secondTeam.players?.some((tp) => tp.id === player.id)
              )}
            />
          </div>
        </div>
      </div>

      <div className="event-page-section">
        <h3>Distribución táctica</h3>
        <FootballPitch
          key={pitchKey}
          eventId={Number(event.id)}
          firstTeamColor={event.firstTeam.color}
          secondTeamColor={event.secondTeam.color}
          pitchSize={Number(event.pitchSize)}
        />
      </div>
    </>
  );
};

export default FootballEventDetails;
