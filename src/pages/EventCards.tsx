import React, { type JSX, useEffect, useState } from "react";
import type {
    FootballCardMatchDetails,
    PaddelCardMatchDetails,
    SportEventCard,
    Team,
    VolleyCardMatchDetails,
} from "../types/event-cards.ts";
import mockedEvents from "./mock-events.json";
import { Color } from "../types/color.ts";
import Grid from "../components/grid.tsx";
import Pagination from "../components/pagination.tsx";

const getEvents = () => {
    return mockedEvents as SportEventCard[];
};

const EventCards: React.FC = () => {
    const [events, setEvents] = useState<SportEventCard[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    useEffect(() => {
        setEvents([...getEvents()]);
    }, []);

    const mapVolleyAndPaddelCardDetails = (teams: Team[]) => {
        return (
            <>
                {teams.map((team) => {
                    return (
                        <div key={team.color} className={"team " + team.color}>
                            <div key={team.color}>
                                {team.players.map((player) => (
                                    <div key={player}> {player} </div>
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
        firstTeamPlayers: string[],
        secondTeamColor: Color,
        secondTeamPlayers: string[],
        pitchSize: number
    ) => {
        return (
            <>
                <div className={"team " + firstTeamColor}>
                    <div key={firstTeamColor}>
                        {firstTeamPlayers.map((player) => (
                            <div key={player}> {player} </div>
                        ))}
                    </div>
                </div>

                <div className={"team " + secondTeamColor}>
                    <div key={secondTeamColor}>
                        {secondTeamPlayers.map((player) => (
                            <div key={player}> {player} </div>
                        ))}
                    </div>
                </div>
                <div className="pitchSize"> Tamaño de cancha: {pitchSize * 2}</div>
            </>
        );
    }

    const mapTeams = (event: SportEventCard): JSX.Element => {
        let content;
        switch (event.sport) {
            case "FOOTBALL": {
                const {
                    firstTeam: { color: firstTeamColor, players: firstTeamPlayers },
                    pitchSize,
                    secondTeam: { color: secondTeamColor, players: secondTeamPlayers },
                } = event.matchDetails as FootballCardMatchDetails;
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

    const mapFooter = (event: SportEventCard) => {
        return (
            <>
                Organizador: {event.organizer}
                <br />
                Alias: {event.alias}
                <br />
                CBU: {event.cbu}
            </>
        );
    }

    const totalPages = Math.ceil(events.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentEvents = events.slice(startIndex, startIndex + pageSize);

    const mapGridContent = () => {
        return currentEvents.map((event) => (
            <div key={event.dateTime + Math.random()} className="card">
                <div className="card-header">
                    <div className="sport"> {event.sport}</div>
                    <div className="date"> {event.dateTime}</div>
                </div>
                <div className="players">
                    👥 Jugadores: {event.players.length} / {event.minPlayers}
                </div>
                <div className="cost">💵 Costo: ${event.cost}</div>
                <div className="teams">{mapTeams(event)}</div>
                <div className="footer">{mapFooter(event)}</div>
            </div>
        ));
    }

    return (
        <div>
            <Grid content={mapGridContent()}/>
            <Pagination totalPages={totalPages} onPageChange={setCurrentPage}/>
        </div>
    );
};

export default EventCards;
