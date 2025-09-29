import React from "react";
import type { PaddleEvent, TeamInfo, UpdateEventParams } from "../../types/events";
import { formatDate } from "../../utils/events";
import MiniMap from "../MiniMap";
import LocationPickerMap from "../LocationPickerMap";
import EditableField from "../EditableField";

interface PaddleEventDetailsProps {
  event: PaddleEvent;
  editForm: UpdateEventParams;
  isEditingLocation: boolean;
  setIsEditingLocation: (value: boolean) => void;
  handleLocationChange: (lat: number, lng: number, placeName?: string) => void;
  editingField: keyof UpdateEventParams | null;
  setEditingField: (f: keyof UpdateEventParams | null) => void;
  onFieldChange: (field: keyof UpdateEventParams, value: string | number) => void;
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
}) => {
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
          {event.players.map((player) => (
            <li key={player.user.username}>{player.name}</li>
          ))}
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
                <ul className="event-page-players-list">
                  {team.players.map((player) => (
                    <li key={player.user.username}>{player.name}</li>
                  ))}
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
