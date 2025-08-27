import React, { type JSX, useEffect, useState } from "react";
import type {
  PaddelCardMatchDetails,
  VolleyCardMatchDetails,
} from "../types/event-cards.ts";
import type { Color } from "../types/color.ts";
import Grid from "../components/grid.tsx";
import Pagination from "../components/pagination.tsx";
import MiniMap from "../components/MiniMap.tsx";
import { getAllEvents } from "../api/eventsApi.ts";
import type { FootballMatchDetails, PlayerInfo, SportEvent, TeamInfo } from "../types/events.ts";
import { formatDate, getPitchSizeLabel } from "../utils/events.ts";

// const getEvents = () => {
//   return mockedEvents as SportEvent[];
// };

const EventCards: React.FC = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    // setEvents([...getEvents()]);
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

  const mapVolleyAndPaddelCardDetails = (teams: TeamInfo[]) => {
    return (
      <>
        {teams.map((team) => {
          return (
            <div key={team.color} className={"team " + team.color}>
              <div key={team.color}>
                {team.players.map((player) => (
                  <div key={player.user.userName}> {player.name} </div>
                ))}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const mapFootballCardDetails = (
    firstTeamColor: Color,
    firstTeamPlayers: PlayerInfo[],
    secondTeamColor: Color,
    secondTeamPlayers: PlayerInfo[],
    pitchSize?: string
  ) => {
    return (
      <>
        <div className={"team " + firstTeamColor}>
          <div key={firstTeamColor}>
            {firstTeamPlayers.map((player) => (
              <div key={player.user.userName}> {player.name} </div>
            ))}
          </div>
        </div>

        <div className={"team " + secondTeamColor}>
          <div key={secondTeamColor}>
            {secondTeamPlayers.map((player) => (
              <div key={player.user.userName}> {player.name} </div>
            ))}
          </div>
        </div>
        <div className="pitchSize"> Tamaño de cancha: {getPitchSizeLabel(pitchSize)}</div>
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
          pitchSize
        );
        break;
      }
      case "PADDEL": {
        const { teams } = event.matchDetails as PaddelCardMatchDetails;
        content = mapVolleyAndPaddelCardDetails(teams);
        break;
      }
      case "VOLLEY": {
        const { teams } = event.matchDetails as VolleyCardMatchDetails;
        content = mapVolleyAndPaddelCardDetails(teams);
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
    return currentEvents.map((event) => (
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
      </div>
    ));
  };

  return (
    <div>
      <Grid content={mapGridContent()} />
      <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default EventCards;
