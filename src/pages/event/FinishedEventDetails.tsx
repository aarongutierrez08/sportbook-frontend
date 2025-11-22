import React, { useState } from "react";
import FinishedEventDisplay from "./FinishedEventDisplay";
import EventStatsModal from "./event-stats/EventStatsModal";
import type { Event } from "../../types/apiTypes";

interface FinishedEventDetailsProps {
  event: Event;
  pictures: Record<number, string>;
}

const FinishedEventDetails: React.FC<FinishedEventDetailsProps> = ({
  event,
  pictures,
}) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <FinishedEventDisplay
        event={event}
        onViewFullStats={() => setShowStats(true)}
      />
      <EventStatsModal
        eventId={event.id}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        pictures={pictures}
      />
    </>
  );
};

export default FinishedEventDetails;
