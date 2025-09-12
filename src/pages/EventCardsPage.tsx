import React, { type JSX, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../components/Grid.tsx";
import Pagination from "../components/Pagination.tsx";
import MiniMap from "../components/MiniMap.tsx";
import { getAllEvents, joinEvent, leaveEvent } from "../api/eventsApi.ts";
import type {
    Color, FootballEvent, PaddleEvent,
    PlayerInfo,
    SportEvent,
    TeamInfo, VolleyEvent,
} from "../types/events.ts";
import { formatDate } from "../utils/events.ts";
import toast from "react-hot-toast";
import type { SportUser } from "../types/user.ts";
import "../styles/eventCards.css";
import AddPlayerButton from "../components/AddPlayerButton.tsx";

const EventCardsPage: React.FC = () => {
  const navigate = useNavigate();
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

  const onPlayerAdded = (updatedEvent: SportEvent) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  }

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

  const handleLeave = async (eventId: number) => {
    await toast.promise(
      leaveEvent(eventId).then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
        );
      }),
      {
        loading: "Saliendo del evento...",
        success: "Has salido del evento",
        error: (err) => {
          const msg = err?.response?.data?.message || "Error al salir del evento";
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
    teams?: TeamInfo[],
    eventId?: number,
    userIsNotInEvent: boolean = true,
  ) => {
    const isUserInTeam = (teamId: number): boolean => {
      if (!eventId || !loggedUser) return false;

      const event = events.find(event => event.id === eventId);
      if (!event) return false;

      const eventTeams = 'teams' in event ? event.teams : null;
      if (!eventTeams) return false;

      const team = (eventTeams as TeamInfo[]).find(team => team.id === teamId);
      if (!team) return false;

      return team.players.some(player => player.user.username === loggedUser.username);
    };

    return (
      <div className="teams-container">
        {teams &&
          teams.map((team) => {
            return (
              <div key={team.color} className={"team " + team.color}>
                <div key={team.color}>{mapTeamMembers(team.players)}</div>
                <AddPlayerButton eventId={eventId!} teamId={team.id!} onPlayerAdded={onPlayerAdded} disabled={userIsNotInEvent || isUserInTeam(team.id)}/>
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
      </div>
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
    players?: PlayerInfo[],
    eventId?: number,
    firstTeamId?: number,
    secondTeamId?: number,
    userIsNotInEvent: boolean = true,
  ) => {

    const isUserInTeam = (firstTeam: boolean) => {
        const event = events.find(event => event.id === eventId);
        if (firstTeam) {
            return (event! as FootballEvent).firstTeam.players
                .some((player) => player.user.username === loggedUser.username);
        } else {
            return (event! as FootballEvent).secondTeam.players
                .some((player) => player.user.username === loggedUser.username);
        }
    }

    return (
      <div className="teams-container">
        <div className={"team " + firstTeamColor}>
          <div key={firstTeamColor}>{mapTeamMembers(firstTeamPlayers)}</div>
          <AddPlayerButton eventId={eventId!} teamId={firstTeamId!} onPlayerAdded={onPlayerAdded} disabled={userIsNotInEvent || isUserInTeam(true)}/>
        </div>
        <div className={"team " + secondTeamColor}>
          <div key={secondTeamColor}>{mapTeamMembers(secondTeamPlayers)}</div>
          <AddPlayerButton eventId={eventId!} teamId={secondTeamId!} onPlayerAdded={onPlayerAdded} disabled={userIsNotInEvent || isUserInTeam(false)}/>
        </div>
        <div className="pitchSize">
          Tamaño de cancha: {pitchSize}
        </div>
        <div className="footer">
          Jugadores sin equipo:{" "}
          {players &&
            getUnasignedPlayers(players, [
              ...firstTeamPlayers,
              ...secondTeamPlayers,
            ])}
        </div>
      </div>
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
          event.players as PlayerInfo[],
          event.id,
          (event as FootballEvent).firstTeam.id,
          (event as FootballEvent).secondTeam.id,
          !isUserInEvent(event, loggedUser),
        );
        break;
      }
      case "PADDLE": {
        const { teams } = event as PaddleEvent;
        content = mapVolleyAndPaddleCardDetails(event.players, teams, event.id, !isUserInEvent(event, loggedUser),);
        break;
      }
      case "VOLLEY": {
        const { teams } = event as VolleyEvent;
        content = mapVolleyAndPaddleCardDetails(event.players, teams, event.id, !isUserInEvent(event, loggedUser),);
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
      const userInEvent = isUserInEvent(event, loggedUser);
      return (
        <div
          key={event.id}
          className="card"
        >
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
          <div className="buttons-container">
            <button
              className={`btn ${userInEvent ? 'btn-danger' : ''}`}
              onClick={() => userInEvent ? handleLeave(event.id) : handleJoin(event.id)}
            >
              {userInEvent ? "Salir" : "Unirse"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              Ver detalles
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Grid content={mapGridContent()} />
      <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );
};

export default EventCardsPage;

const isUserInEvent = (event: SportEvent, loggedUser: SportUser): boolean => {
  if (!loggedUser) return false;
  return event.players.some(
    (player) => player.user.username === loggedUser.username
  );
};