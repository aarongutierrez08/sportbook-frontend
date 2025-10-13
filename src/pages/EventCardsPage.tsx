import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../commons/components/Grid";
import Pagination from "../commons/components/Pagination";
import { getAllEvents } from "../api/eventsApi";
import type { SportEvent } from "../types/events";
import "../styles/eventCards.css";
import EventCard from "../commons/components/events/EventCard";
import { useAuth } from "../auth/useAuth";

const EventCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const { user: loggedUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllEvents();
        setEvents(res);
      } catch {
        setEvents([]);
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
    <Pagination
      items={events}
      pageSize={6}
      emptyPlaceholder={<div className="empty-state">No hay eventos</div>}
    >
      {(pageItems) => (
        <Grid
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
  );
};

export default EventCardsPage;
