import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../commons/components/Grid";
import Pagination from "../commons/components/Pagination";
import { getAllEvents, getFinishedEvents } from "../api/eventsApi";
import type { SportEvent } from "../types/events";
import "../styles/eventCards.css";
import EventCard from "../commons/components/events/EventCard";
import { useAuth } from "../auth/useAuth";

const EventCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [finishedEvents, setFinishedEvents] = useState<SportEvent[]>([]);

  const { user: loggedUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllEvents();
        const finishedEvents = await getFinishedEvents();
        setFinishedEvents(finishedEvents);
        setEvents(res);
      } catch {
        setEvents([]);
        setFinishedEvents([]);
      }
    })();
  }, []);

  const goToDetails = useCallback(
    (id: number) => {
      navigate(`/events/${id}`);
    },
    [navigate]
  );

  return (
    <>
      <div className="events-section">
        <Pagination
          items={events}
          pageSize={8}
          emptyPlaceholder={<div className="empty-state">No hay eventos</div>}
        >
          {(pageItems) => (
            <Grid
              title="Eventos Disponibles"
              content={pageItems.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  loggedUser={loggedUser}
                  onDetails={goToDetails}
                />
              ))}
            />
          )}
        </Pagination>
      </div>

      <div className="section-divider"></div>

      <div className="events-section">
        <Pagination
          items={[...finishedEvents]}
          pageSize={8}
          emptyPlaceholder={
            <div className="empty-state">No hay eventos finalizados</div>
          }
        >
          {(pageItems) => (
            <Grid
              title="Eventos Finalizados"
              content={pageItems.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  loggedUser={loggedUser}
                  onDetails={goToDetails}
                />
              ))}
            />
          )}
        </Pagination>
      </div>
    </>
  );
};

export default EventCardsPage;
