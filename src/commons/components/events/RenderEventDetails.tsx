import type {
  FootballEvent,
  PaddleEvent,
  SportEvent,
  VolleyEvent,
} from "../../../types/events";
import FootballEventDetails from "./FootballEventDetails";
import PaddleEventDetails from "./PaddleEventDetails";
import VolleyEventDetails from "./VolleyEventDetails";

function RenderEventDetails({
  event,
  onEventUpdate,
  onBalanceComplete,
}: {
  event: SportEvent;
  onEventUpdate: (event: any) => void;
  onBalanceComplete: () => void;
}) {
  switch (event.sport) {
    case "FOOTBALL":
      return (
        <FootballEventDetails
          event={event as FootballEvent}
          onEventUpdate={onEventUpdate}
          onBalanceComplete={onBalanceComplete}
        />
      );
    case "PADDLE":
      return (
        <PaddleEventDetails
          event={event as PaddleEvent}
          onEventUpdate={onEventUpdate}
          onBalanceComplete={onBalanceComplete}
        />
      );
    case "VOLLEY":
      return (
        <VolleyEventDetails
          event={event as VolleyEvent}
          onEventUpdate={onEventUpdate}
          onBalanceComplete={onBalanceComplete}
        />
      );
    default:
      return null;
  }
}

export default RenderEventDetails;
