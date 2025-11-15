import React, { useState } from "react";
import { removeTeam } from "../../api/eventsApi";
import toast from "react-hot-toast";
import "../../styles/deleteTeamButton.css";
import ConfirmDialog from "./ConfirmDialogModal";
import type { PaddleEvent, Team, VolleyEvent } from "../../types/apiTypes";

interface RemoveTeamButtonProps {
  event: PaddleEvent | VolleyEvent;
  team: Team;
  disabled?: boolean;
  onTeamAdded: (event: PaddleEvent | VolleyEvent) => void;
}

const RemoveTeamButton: React.FC<RemoveTeamButtonProps> = ({
  event,
  team,
  disabled,
  onTeamAdded,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const updatedEvent = await removeTeam(event.id, team.id);
      toast.success("Se eliminó el equipo " + team.color + "!");
      if (onTeamAdded) {
        onTeamAdded(updatedEvent as PaddleEvent | VolleyEvent);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error al eliminar el equipo"
      );
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div>
      <button
        className="delete-team-btn"
        onClick={handleClick}
        disabled={disabled}
      >
        Eliminar Equipo
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirmar eliminación"
        message={`¿Estás seguro que deseas eliminar el equipo ${team.color}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default RemoveTeamButton;
