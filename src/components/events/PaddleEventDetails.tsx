import React, {useMemo} from "react";
import type {FootballEvent, PaddleEvent, PlayerInfo, SportEvent, TeamInfo, UpdateEventParams} from "../../types/events";
import { formatDate } from "../../utils/events";
import MiniMap from "../MiniMap";
import LocationPickerMap from "../LocationPickerMap";
import EditableField from "../EditableField";
import AddPlayerButton from "../AddPlayerButton.tsx";

interface PaddleEventDetailsProps {
  event: PaddleEvent;
  editForm: UpdateEventParams;
  isEditingLocation: boolean;
  setIsEditingLocation: (value: boolean) => void;
  handleLocationChange: (lat: number, lng: number, placeName?: string) => void;
  editingField: keyof UpdateEventParams | null;
  setEditingField: (f: keyof UpdateEventParams | null) => void;
  onFieldChange: (field: keyof UpdateEventParams, value: string | number) => void;
  onEventUpdate: (updatedEvent: FootballEvent) => void;
  isJoinTeamDisabled: (sportEvent: SportEvent, teamPlayers: PlayerInfo[], loggedUser: any) => boolean;
  onMapPlayers: (players: PlayerInfo[]) => React.ReactNode;
}

const PaddleEventDetails: React.FC<PaddleEventDetailsProps> = ({
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
  onMapPlayers,
}) => {
  const loggedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);
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
          <p>Jugadores: {event.players.length} / {event.minPlayers}</p>
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
              <button className="btn" onClick={() => setIsEditingLocation(true)}>Cambiar ubicación</button>
            </div>
          ) : (
            <div className="location-picker-container">
              <LocationPickerMap
                lat={editForm.locationX ?? event.location.x}
                lng={editForm.locationY ?? event.location.y}
                onChange={handleLocationChange}
              />
              <button className="btn btn-secondary" onClick={() => setIsEditingLocation(false)}>Cancelar</button>
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

      <div className="event-page-section">
        <h3>Jugadores</h3>
        <ul className="event-page-players-list">
            {onMapPlayers(event.players!)}
        </ul>
      </div>

      {event.teams && event.teams.length > 0 && (
        <div className="event-page-section">
          <h3>Equipos</h3>
          <div className="event-page-team-section">
            {event.teams.map((team: TeamInfo) => (
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
                      disabled={isJoinTeamDisabled(event, team.players!, loggedUser)}
                  />
                <ul className="event-page-players-list">
                  {onMapPlayers(team.players!)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PaddleEventDetails;
