import React from "react";
import { useParams } from "react-router-dom";
import { useEventWithPictures } from "./useEventWithPictures";
import FinishedEventDetails from "./FinishedEventDetails";
import ActiveEventDetails from "./ActiveEventDetails";
import "./EventPage.css";

const EventPage: React.FC = () => {
  const { id } = useParams();

  const { event, setEvent, pictures, loading } = useEventWithPictures(
    id ? Number(id) : null
  );

  if (loading || !event) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Cargando evento...
      </div>
    );
  }

  if (event.isFinished) {
    return <FinishedEventDetails event={event} pictures={pictures} />;
  }

  return (
    <ActiveEventDetails
      event={event}
      onEventUpdate={setEvent}
      pictures={pictures}
    />
  );
};

export default EventPage;
