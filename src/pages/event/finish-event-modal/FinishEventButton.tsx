import "./FinishEventButton.css";
import React, { useState } from "react";
import { finishEvent } from "../../../api/eventsApi";
import toast from "react-hot-toast";
import FinishEventModal from "./FinishEventModal";
import type { Event, FinishEventRequest } from "../../../types/apiTypes";

interface FinishEventButtonProps {
  event: Event;
}

const FinishEventButton: React.FC<FinishEventButtonProps> = ({ event }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFinish = async () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (params: FinishEventRequest) => {
    setIsSubmitting(true);
    try {
      await finishEvent(event.id, params);
      toast.success("Evento finalizado exitosamente");
      setShowModal(false);
      window.location.href = "/events";
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
        className={"finish-event-button"}
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
        className={"btn btn--lg"}
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
