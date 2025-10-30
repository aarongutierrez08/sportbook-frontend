import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../commons/components/Grid";
import Pagination from "../commons/components/Pagination";
import { getFinishedEvents } from "../api/eventsApi";
import type { SportEvent } from "../types/events";
import EventCard from "../commons/components/events/EventCard";
import { useAuth } from "../auth/useAuth";
import "../styles/eventCards.css";

const FinishedEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [finishedEvents, setFinishedEvents] = useState<SportEvent[]>([]);
  const { user: loggedUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const finished = await getFinishedEvents();
        setFinishedEvents(finished);
      } catch {
        setFinishedEvents([]);
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
        items={finishedEvents}
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
  );
};

export default FinishedEventsPage;
