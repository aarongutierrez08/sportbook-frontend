import React, { type JSX, useEffect, useMemo, useState } from "react";
import Grid from "../components/Grid.tsx";
import Pagination from "../components/Pagination.tsx";
import MiniMap from "../components/MiniMap.tsx";
import { getAllEvents, joinEvent } from "../api/eventsApi.ts";
import type {
    Color, FootballEvent, PaddleEvent,
    PlayerInfo,
    SportEvent,
    TeamInfo, VolleyEvent,
} from "../types/events.ts";
import { formatDate, getPitchSizeLabel } from "../utils/events.ts";
import toast from "react-hot-toast";
import type { SportUser } from "../types/user.ts";

const EventCardsPage: React.FC = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const loggedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);
  
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const events = await getAllEvents();
        setEvents(events);
        return events;
      } catch {
        return [];
      }
    };

    fetchAllEvents();
  }, []);

  const handleJoin = async (eventId: number) => {
    await toast.promise(
      joinEvent(eventId).then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
        );
      }),
      {
        loading: "Uniéndote al evento...",
        success: "¡Te uniste al evento!",
        error: (err) => {
          const msg = err?.response?.data?.message || "Error al unirse al evento";
          return msg;
        },
      }
    );
  };

  const mapTeamMembers = (players: PlayerInfo[]) => {
    if (players.length === 0) {
      return <div className="info-label"> Sin Jugadores </div>;
    }
    return players.map((player) => (
      <div key={player.user.username}> {player.name} </div>
    ));
  };

  const mapVolleyAndPaddleCardDetails = (
    players: PlayerInfo[],
    teams?: TeamInfo[]
  ) => {
    return (
      <>
        {teams &&
          teams.map((team) => {
            return (
              <div key={team.color} className={"team " + team.color}>
                <div key={team.color}>{mapTeamMembers(team.players)}</div>
              </div>
            );
          })}
        <div className="footer">
          Jugadores sin equipo:{" "}
          {getUnasignedPlayers(
            players,
            teams
              ?.map((teamInfo) => teamInfo.players)
              .reduce((accumulator, currentArray) => {
                return accumulator.concat(currentArray);
              })
          )}
        </div>
      </>
    );
  };

  const getUnasignedPlayers = (
    players?: PlayerInfo[],
    teamPlayers?: PlayerInfo[]
  ): JSX.Element => {
    const firstTeamPlayersNames = teamPlayers?.map((firstTeamPlayer) => {
      return firstTeamPlayer.user.username;
    });
    const unasignedPlayers = players
      ?.filter((player) => {
        return !firstTeamPlayersNames?.includes(player.user.username);
      })
      .map((player) => player.name);
    return <>{unasignedPlayers?.join(", ")}</>;
  };

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
          <div key={firstTeamColor}>{mapTeamMembers(firstTeamPlayers)}</div>
        </div>

        <div className={"team " + secondTeamColor}>
          <div key={secondTeamColor}>{mapTeamMembers(secondTeamPlayers)}</div>
        </div>
        <div className="pitchSize">
          Tamaño de cancha: {getPitchSizeLabel(pitchSize)}
        </div>
        <div className="footer">
          Jugadores sin equipo:{" "}
          {players &&
            getUnasignedPlayers(players, [
              ...firstTeamPlayers,
              ...secondTeamPlayers,
            ])}
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
        } = event as FootballEvent;
        content = mapFootballCardDetails(
          firstTeamColor,
          firstTeamPlayers,
          secondTeamColor,
          secondTeamPlayers,
          pitchSize,
          event.players as PlayerInfo[]
        );
        break;
      }
      case "PADDLE": {
        const { teams } = event as PaddleEvent;
        content = mapVolleyAndPaddleCardDetails(event.players, teams);
        break;
      }
      case "VOLLEY": {
        const { teams } = event as VolleyEvent;
        content = mapVolleyAndPaddleCardDetails(event.players, teams);
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
        Alias: {event.transferData?.alias}
        <br />
        CBU: {event.transferData?.cbu}
      </>
    );
  };

  const totalPages = Math.ceil(events.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentEvents = events.slice(startIndex, startIndex + pageSize);

  const mapGridContent = () => {
    return currentEvents.map((event) => {
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
            onClick={() => handleJoin(event.id)}
            disabled={isUserInEvent(event, loggedUser)}
          >
            {isUserInEvent(event, loggedUser) ? "Ya estás unido" : "Unirse"}
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <Grid content={mapGridContent()} />
      <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default EventCardsPage;

const isUserInEvent = (event: SportEvent, loggedUser: SportUser): boolean => {
  if (!loggedUser) return false;
  return event.players.some(
    (player) => player.user.username === loggedUser.username
  );
};
