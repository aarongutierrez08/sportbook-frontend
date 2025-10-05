import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../components/Grid.tsx";
import Pagination from "../components/Pagination.tsx";
import { getAllEvents, joinEvent, leaveEvent } from "../api/eventsApi.ts";
import type {SportEvent} from "../types/events.ts";
import { formatDate } from "../utils/events.ts";
import toast from "react-hot-toast";
import type { SportUser } from "../types/user.ts";
import "../styles/eventCards.css";
import { AmountText } from "../components/AmountText.tsx";
import SportIllustration from "../components/SportIllustration.tsx";

const EventCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
        error: (err) => err?.response?.data?.message || "Error al unirse al evento"
      }
    );
  };

  const handleLeave = async (eventId: number) => {
    await toast.promise(
      leaveEvent(eventId).then(() => {
        // Actualizamos el evento después de salir haciendo un nuevo fetch
        return getAllEvents().then(events => {
          setEvents(events);
          return events.find(ev => ev.id === eventId)!;
        });
      }),
      {
        loading: "Saliendo del evento...",
        success: "Has salido del evento",
        error: "Error al salir del evento"
      }
    );
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
        <div key={event.id} className="card">
          {event.isFinished && (
            <div className="event-status">Evento Finalizado</div>
          )}
          <div className="card-header">
            <div className="sport">{event.sport}</div>
            <div className="date">{formatDate(event.dateTime)}</div>
          </div>
          <div className="players">
            👥 Jugadores: {event.players.length} / {event.minPlayers}
          </div>
          <SportIllustration event={event}/>
          <div className="cost">💵 Costo: <AmountText number={event.cost} /></div>
          <div className="footer">{mapFooter(event)}</div>
          <div className="buttons-container">
            {!event.isFinished && (
              <button
                className={`btn ${userInEvent ? 'btn-danger' : ''}`}
                onClick={() => userInEvent ? handleLeave(event.id) : handleJoin(event.id)}
                disabled={event.players.length >= event.maxPlayers && !userInEvent}
              >
                {userInEvent ? "Salir" : "Unirse"}
              </button>
            )}
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