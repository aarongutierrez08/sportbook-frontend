import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, updateEvent } from "../api/eventsApi";
import type {FootballEvent, PlayerInfo, SportEvent, TeamInfo, UpdateEventParams} from "../types/events";
import MiniMap from "../components/MiniMap";
import FootballPitch from "../components/FootballPitch";
import { formatDate } from "../utils/events";
import "../styles/eventPage.css";
import { toast } from "react-toastify";

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<SportEvent | null>(null);
  const [editForm, setEditForm] = useState<UpdateEventParams>({});
  const [hasChanges, setHasChanges] = useState(false);

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

  function getPitchSize() {
    if (event && 'pitchSize' in event && event.pitchSize) {
      return renderEditableField('Tamaño de cancha', (event as FootballEvent).pitchSize, 'pitchSize', 'number');
    }
    return null;
  }

  return (
    <div className="event-page-root">
      <div className="event-page-container">
        <h2>{event.sport}</h2>
        <div className="event-page-details">
          <div className="event-page-section">
            <h3>Detalles del Evento</h3>
            <p>Fecha y hora: {formatDate(event.dateTime)}</p>
            {renderEditableField('Organizador', event.organizer, 'organizer')}
            <p>Jugadores: {event.players.length} / {event.minPlayers}</p>
            {renderEditableField('Costo', event.cost, 'cost', 'number')}
            {getPitchSize()}
          </div>

          <div className="event-page-section">
            <h3>Ubicación</h3>
            {renderEditableField('Lugar', event.location.placeName, 'locationPlaceName')}
            <div className="event-page-minimap">
              {event.location && (
                <MiniMap lat={event.location.x} lng={event.location.y} />
              )}
            </div>
          </div>

          <div className="event-page-section">
            <h3>Datos de Pago</h3>
            <div className="event-page-payment-info">
              {renderEditableField('Alias', event.transferData.alias, 'transferDataAlias')}
              {renderEditableField('CBU', event.transferData.cbu, 'transferDataCbu')}
            </div>
          </div>
        </div>

        <div className="event-page-section">
          <h3>Jugadores</h3>
          <ul className="event-page-players-list">
            {event.players.map(player => (
              <li key={player.user.username}>{player.name}</li>
            ))}
          </ul>
        </div>

        {'teams' in event ? (
          <div className="event-page-section">
            <h3>Equipos</h3>
            <div className="event-page-team-section">
              {(event.teams as TeamInfo[]).map((team: TeamInfo) => (
                <div
                  key={team.id}
                  className="event-page-team-card"
                  data-color={team.color}
                >
                  <h4>Equipo {team.color}</h4>
                  <ul className="event-page-players-list">
                    {team.players.map((player: PlayerInfo) => (
                      <li key={player.user.username}>{player.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : 'firstTeam' in event && 'secondTeam' in event? (
          <div className="event-page-section">
            <h3>Equipos</h3>
            <div className="event-page-team-section">
              <div
                className="event-page-team-card"
                data-color={(event as FootballEvent).firstTeam.color}
              >
                <h4>Equipo {(event as FootballEvent).firstTeam.color}</h4>
                <ul className="event-page-players-list">
                  {(event as FootballEvent).firstTeam.players.map(player => (
                    <li key={player.user.username}>{player.name}</li>
                  ))}
                </ul>
              </div>
              <div
                className="event-page-team-card"
                data-color={(event as FootballEvent).secondTeam.color}
              >
                <h4>Equipo {(event as FootballEvent).secondTeam.color}</h4>
                <ul className="event-page-players-list">
                  {(event as FootballEvent).secondTeam.players.map(player => (
                    <li key={player.user.username}>{player.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="event-page-pitch-container">
              <h3>Distribución táctica</h3>
              <FootballPitch
                eventId={Number(event.id)}
                firstTeamColor={(event as FootballEvent).firstTeam.color}
                secondTeamColor={(event as FootballEvent).secondTeam.color}
                pitchSize={Number((event as FootballEvent).pitchSize)}
              />
            </div>
          </div>
        ) : null}
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
