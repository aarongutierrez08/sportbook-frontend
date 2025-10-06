import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../commons/components/Grid.tsx";
import Pagination from "../commons/components/Pagination.tsx";
import { getAllEvents } from "../api/eventsApi.ts";
import type {SportEvent} from "../types/events.ts";
import { formatDate } from "../utils/events.ts";
import type { SportUser } from "../types/user.ts";
import "../styles/eventCards.css";
import { AmountText } from "../commons/components/AmountText.tsx";
import { usePageSize } from "../hooks/usePageSize.ts";

const EventCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = usePageSize(events.length);

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
        <div key={event.id} className="card">
          {event.isFinished && (
            <div className="event-status">Evento Finalizado</div>
          )}
          <div className="card-header">
            <div className="sport">{event.sport}</div>
              { !event.isFinished &&(
                <div className="date">{formatDate(event.dateTime)}</div>)
              }
          </div>
          <div className="players">
            👥 Jugadores: {event.players.length} / {event.minPlayers}
          </div>
          <div className="cost">💵 Costo: <AmountText number={event.cost} /></div>
          <div className="footer">{mapFooter(event)}</div>
          {!event.isFinished && userInEvent && (<div className="joined">Ya sos parte de este evento!</div>)}
          <div className="buttons-container">
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
      {events.length > 0 && <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />}
    </>
  );
};

export default EventCardsPage;

const isUserInEvent = (event: SportEvent, loggedUser: SportUser): boolean => {
  if (!loggedUser) return false;
  return event.players.some(
    (player) => player?.user?.username === loggedUser.username
  );
};