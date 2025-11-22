import React from "react";
import "./FinishEventModal.css";
import "./finishEventCommonDetails.css";
import FootballEventFinishDetails from "./FootballEventFinishDetails";
import PaddleEventFinishDetails from "./PaddleEventFinishDetails";
import VolleyEventFinishDetails from "./VolleyEventFinishDetails";
import type {
  Event,
  FinishEventRequest,
  FootballEvent,
  PaddleEvent,
  VolleyEvent,
} from "../../../types/apiTypes";

interface FinishEventModalProps {
  event: Event;
  onClose: () => void;
  onSubmit: (data: FinishEventRequest) => void;
}

const FinishEventModal: React.FC<FinishEventModalProps> = ({
  event,
  onClose,
  onSubmit,
}) => {
  const renderEventDetails = () => {
    switch (event.sport) {
      case "FOOTBALL":
        return (
          <FootballEventFinishDetails
            event={event as FootballEvent}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        );
      case "PADDLE":
        return (
          <PaddleEventFinishDetails
            event={event as PaddleEvent}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        );
      case "VOLLEY":
        return (
          <VolleyEventFinishDetails
            event={event as VolleyEvent}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="fem-modal">
        <h2>Finalizar Evento</h2>
        {renderEventDetails()}
      </div>
    </div>
  );
};

export default FinishEventModal;
