// src/pages/ActiveEventsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../commons/components/Grid";
import Pagination from "../commons/components/Pagination";
import { getAllEvents } from "../api/eventsApi";
import type { SportEvent } from "../types/events";
import EventCard from "../commons/components/events/EventCard";
import { useAuth } from "../auth/useAuth";
import "../styles/eventCards.css";

const ActiveEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const { user: loggedUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllEvents();
        // filtra eventos que NO están finalizados
        const active = all.filter((e) => !e.isFinished);
        setEvents(active);
      } catch {
        setEvents([]);
      }
    })();
  }, []);

  const goToDetails = useCallback(
    (id: number) => navigate(`/events/${id}`),
    [navigate]
  );

  return (
    <div className="events-section">
      <Pagination
        items={events}
        pageSize={8}
        emptyPlaceholder={
          <div className="empty-state">No hay eventos disponibles</div>
        }
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
  );
};

export default ActiveEventsPage;
