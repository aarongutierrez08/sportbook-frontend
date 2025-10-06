import React, { useState } from "react";
import { finishEvent } from "../../api/eventsApi";
import type { FinishEventParams, SportEvent } from "../../types/events";
import toast from "react-hot-toast";
import "../../styles/finishEventButton.css";
import FinishEventModal from "./FinishEventModal";

interface FinishEventButtonProps {
  event: SportEvent;
  className?: string;
}

const FinishEventButton: React.FC<FinishEventButtonProps> = ({
  event,
  className,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFinish = async () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (params: FinishEventParams) => {
    setIsSubmitting(true);
    try {
      await finishEvent(event.id, params);
      toast.success("Evento finalizado exitosamente");
      setShowModal(false);
      window.location.reload();
    } catch {
      toast.error("Error al finalizar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (event.isFinished) {
    return (
      <button
        disabled
        className={`finish-event-button finished ${className || ""}`}
        title="Este evento ya está finalizado"
      >
        Evento Finalizado
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleFinish}
        disabled={isSubmitting}
        className={`finish-event-button ${className || ""}`}
      >
        {isSubmitting ? "Finalizando..." : "Finalizar Evento"}
      </button>

      {showModal && (
        <FinishEventModal
          event={event}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
};

export default FinishEventButton;
