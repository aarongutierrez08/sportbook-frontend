import React from "react";
import type {
  VolleyEvent,
  UpdateEventParams,
  SportEvent,
  PlayerInfo,
  FootballEvent,
} from "../../../types/events";
import { formatDate } from "../../../utils/events";
import MiniMap from "../MiniMap";
import LocationPickerMap from "../LocationPickerMap";
import EditableField from "../EditableField";
import AddPlayerButton from "../AddPlayerButton.tsx";
import { PlayerList } from "../../../pages/EventPage/components/PlayerList.tsx";
import EventFairnessRatingComponent from "../../../pages/EventPage/components/EventFairnessRatingComponent.tsx";
import { useAuth } from "../../../auth/useAuth.ts";

interface VolleyEventDetailsProps {
  event: VolleyEvent;
  editForm: UpdateEventParams;
  isEditingLocation: boolean;
  setIsEditingLocation: (value: boolean) => void;
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

const VolleyEventDetails: React.FC<VolleyEventDetailsProps> = ({
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
            {event.teams?.map((team) => (
              <div
                key={team.id}
                className="event-page-team-card"
                data-color={team.color}
              >
                <h4>Equipo {team.color}</h4>
                <AddPlayerButton
                  eventId={event.id}
                  teamId={team.id}
                  onPlayerAdded={onEventUpdate}
                  disabled={isJoinTeamDisabled(
                    event,
                    team.players!,
                    loggedUser
                  )}
                />
                <PlayerList players={team.players!} />
              </div>
            ))}
          </div>
        </div>

        <div className="balance-and-players-column">
          <div className="event-page-section">
            <h3>Balance</h3>
            <EventFairnessRatingComponent
              eventId={event.id}
              teams={event.teams!}
              onBalanceComplete={onBalanceComplete}
            />
          </div>
          <div className="event-page-section no-team-players">
            <h3>Jugadores sin equipo</h3>
            <PlayerList
              players={event.players.filter(
                (player) => !event.teams?.some((team) =>
                    team.players?.some((tp) => tp.id === player.id)
                  )
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VolleyEventDetails;
