import React, { type JSX, useEffect, useState } from "react";
import type {
  PaddelCardMatchDetails,
  VolleyCardMatchDetails,
} from "../types/event-cards.ts";
import type { Color } from "../types/color.ts";
import Grid from "../components/grid.tsx";
import Pagination from "../components/pagination.tsx";
import MiniMap from "../components/MiniMap.tsx";
import {getAllEvents, joinEvent} from "../api/eventsApi.ts";
import type { FootballMatchDetails, PlayerInfo, SportEvent, TeamInfo } from "../types/events.ts";
import { formatDate, getPitchSizeLabel } from "../utils/events.ts";

const EventCards: React.FC = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingEventId, setLoadingEventId] = useState<number>(0);
  const pageSize = 4;

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const events = await getAllEvents();
        setEvents(events)
        return events;
      } catch {
        return []
      }
    };

    fetchAllEvents()
  }, []);

    const handleJoin = async (eventId: number) => {
        try {
            setLoadingEventId(eventId);
            const username = "playerusername1"; // Esto por ahora va hardcodeado, luego ser cambia por el user loggeado
            const updatedEvent = await joinEvent(eventId, username);
            setEvents((prev) =>
                prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
            );
        } catch (err) {
            console.error("Error al unirse:", err);
        } finally {
            setLoadingEventId(0);
        }
    };

  const mapTeamMembers = (players: PlayerInfo[]) => {
      if (players.length === 0) {
        return <div className="info-label"> Sin Jugadores </div>
      }
      return players.map((player) => (<div key={player.user.userName}> {player.name} </div>))
  }

  const mapVolleyAndPaddelCardDetails = (teams: TeamInfo[], players: PlayerInfo[]) => {
    return (
      <>
        {teams.map((team) => {
          return (
            <div key={team.color} className={"team " + team.color}>
              <div key={team.color}>
                { mapTeamMembers(team.players) }
              </div>
            </div>
          );
        })}
          <div className="footer">
          Jugadores sin equipo: {
            getUnasignedPlayers(
              players,
                teams
                    .map((teamInfo) => teamInfo.players)
                    .reduce((accumulator, currentArray) => {
                        return accumulator.concat(currentArray)
                    }))
            }
          </div>
      </>
    );
  };

    const getUnasignedPlayers = (players: PlayerInfo[], teamPlayers: PlayerInfo[]): JSX.Element => {
      const firstTeamPlayersNames = teamPlayers.map((firstTeamPlayer) => {
        return firstTeamPlayer.user.userName
      })
      const unasignedPlayers = players?.filter((player) => {
        return !firstTeamPlayersNames.includes(player.user.userName)
      }).map((player) => player.name)
      return <>
         {unasignedPlayers?.join(", ")}
      </>
    }

    const mapFootballCardDetails = (
    firstTeamColor: Color,
    firstTeamPlayers: PlayerInfo[],
    secondTeamColor: Color,
    secondTeamPlayers: PlayerInfo[],
    pitchSize?: string,
    players?: PlayerInfo[]
  ) => {
    return (
      <>
        <div className={"team " + firstTeamColor}>
          <div key={firstTeamColor}>
              {mapTeamMembers(firstTeamPlayers)}
          </div>
        </div>

        <div className={"team " + secondTeamColor}>
          <div key={secondTeamColor}>
            {mapTeamMembers(secondTeamPlayers)}
          </div>
        </div>
        <div className="pitchSize">
            Tamaño de cancha: {getPitchSizeLabel(pitchSize)}
        </div>
          <div className="footer">
              Jugadores sin equipo: {players && getUnasignedPlayers(players, [...firstTeamPlayers, ...secondTeamPlayers])}
          </div>
      </>
    );
  };

  const mapTeams = (event: SportEvent): JSX.Element => {
    let content;
    switch (event.sport) {
      case "FOOTBALL": {
        const {
          firstTeam: { color: firstTeamColor, players: firstTeamPlayers },
          pitchSize,
          secondTeam: { color: secondTeamColor, players: secondTeamPlayers },
        } = event.matchDetails as FootballMatchDetails;
        content = mapFootballCardDetails(
          firstTeamColor,
          firstTeamPlayers,
          secondTeamColor,
          secondTeamPlayers,
          pitchSize,
          event.players,
        );
        break;
      }
      case "PADDEL": {
        const { teams } = event.matchDetails as PaddelCardMatchDetails;
        content = mapVolleyAndPaddelCardDetails(teams, event.players);
        break;
      }
      case "VOLLEY": {
        const { teams } = event.matchDetails as VolleyCardMatchDetails;
        content = mapVolleyAndPaddelCardDetails(teams, event.players);
        break;
      }
    }
    return content!;
  };

  const mapFooter = (event: SportEvent) => {
    return (
      <>
        Organizador: {event.organizer}
        <br />
        Lugar: {event.location.placeName}
        <br />
        Alias: {event.transferData.alias}
        <br />
        CBU: {event.transferData.cbu}
      </>
    );
  };

  const totalPages = Math.ceil(events.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentEvents = events.slice(startIndex, startIndex + pageSize);

  const mapGridContent = () => {
    return currentEvents.map((event) => {
        const isAlreadyIn = event.players.some(
            (p) => p.user.userName === "playerusername1" // Esto por ahora va hardcodeado, luego ser cambia por el user loggeado
        );
        return (
            <div key={event.id} className="card">
                <div className="card-header">
                    <div className="sport"> {event.sport}</div>
                    <div className="date"> {formatDate(event.dateTime)}</div>
                </div>
                <div className="players">
                    👥 Jugadores: {event.players.length} / {event.minPlayers}
                </div>

                {event.location && (
                    <MiniMap lat={event.location.x} lng={event.location.y} />
                )}

                <div className="cost">💵 Costo: ${event.cost}</div>
                <div className="teams">{mapTeams(event)}</div>
                <div className="footer">{mapFooter(event)}</div>
                <button
                    className="btn"
                    disabled={loadingEventId === event.id || isAlreadyIn}
                    onClick={() => handleJoin(event.id)}
                >
                    {isAlreadyIn ? "Ya estás unido" : loadingEventId === event.id ? "Uniéndose..." : "Unirse"}
                </button>
            </div>
        )
    });
  };

  return (
    <div>
      <Grid content={mapGridContent()} />
      <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default EventCards;
