import "../../styles/eventCards.css";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getFinishedEvents } from "../../api/eventsApi";
import Pagination from "../../commons/components/Pagination";
import Grid from "../../commons/components/Grid";
import EventCard from "../../commons/events/EventCard";
import type { Event } from "../../types/apiTypes";

const FinishedEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [finishedEvents, setFinishedEvents] = useState<Event[]>([]);

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
    <div>
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
              <EventCard key={ev.id} event={ev} onDetails={goToDetails} />
            ))}
          />
        )}
      </Pagination>
    </div>
  );
};

export default FinishedEventsPage;
