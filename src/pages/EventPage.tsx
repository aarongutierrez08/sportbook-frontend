import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "../api/eventsApi";
import type {FootballEvent, PlayerInfo, SportEvent, TeamInfo} from "../types/events";
import MiniMap from "../components/MiniMap";
import FootballPitch from "../components/FootballPitch";
import { formatDate } from "../utils/events";
import "../styles/eventPage.css";

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<SportEvent | null>(null);

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

  if (!event) {
    return <div>Cargando evento...</div>;
  }

    function getPitchSize()  {
        if (event && 'pitchSize' in event && event.pitchSize) {
          return (<>
              <p>Tamaño de cancha: {(event as FootballEvent).pitchSize}</p>
          </>);
        }
        return <></>
    }

    return (
    <div className="event-page-root">
      <div className="event-page-container">
        <h2>{event.sport}</h2>
        <div className="event-page-details">
          <div className="event-page-section">
            <h3>Detalles del Evento</h3>
            <p>Fecha y hora: {formatDate(event.dateTime)}</p>
            <p>Organizador: {event.organizer}</p>
            <p>Jugadores: {event.players.length} / {event.minPlayers}</p>
            <p>Costo: ${event.cost}</p>
            {getPitchSize()}
          </div>

          <div className="event-page-section">
            <h3>Ubicación</h3>
            <p>Lugar: {event.location.placeName}</p>
            <div className="event-page-minimap">
              {event.location && (
                <MiniMap lat={event.location.x} lng={event.location.y} />
              )}
            </div>
          </div>

          <div className="event-page-section">
            <h3>Datos de Pago</h3>
            <div className="event-page-payment-info">
              <p>Alias: {event.transferData?.alias}</p>
              <p>CBU: {event.transferData?.cbu}</p>
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
                firstTeamPlayers={(event as FootballEvent).firstTeam.players}
                secondTeamPlayers={(event as FootballEvent).secondTeam.players}
                firstTeamColor={(event as FootballEvent).firstTeam.color}
                secondTeamColor={(event as FootballEvent).secondTeam.color}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventPage;
