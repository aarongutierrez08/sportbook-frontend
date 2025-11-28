import "./FinishEventButton.css";
import React from "react";
import type { Event } from "../../../types/apiTypes";

interface FinishEventButtonProps {
  event: Event;
  onClick: () => void;
  isSubmitting: boolean;
}

const FinishEventButton: React.FC<FinishEventButtonProps> = ({
  event,
  onClick,
  isSubmitting,
}) => {
  if (event.isFinished) {
    return (
      <button
        disabled
        className={"finish-event-button"}
        title="Este evento ya está finalizado"
      >
        Evento Finalizado
      </button>
    );
  }

  return (
    <button onClick={onClick} disabled={isSubmitting} className={"btn btn--lg"}>
      {isSubmitting ? "Finalizando..." : "Finalizar Evento"}
    </button>
  );
};

export default FinishEventButton;
