import React from "react";
import { addTeam } from "../../api/eventsApi";
import toast from "react-hot-toast";
import "../../styles/addTeamButton.css";
import { COLOR_KEYS } from "../../constants/events.ts";
import type {
  PaddleEvent,
  TeamColor,
  VolleyEvent,
} from "../../types/apiTypes.ts";

interface AddTeamButton {
  event: PaddleEvent | VolleyEvent;
  disabled?: boolean;
  onTeamAdded: (event: PaddleEvent | VolleyEvent) => void;
}

const AddTeamButton: React.FC<AddTeamButton> = ({
  event,
  disabled,
  onTeamAdded,
}) => {
  const handleClick = async () => {
    try {
      const usedColors = event.teams
        ? event.teams.map((team) => team.color)
        : [];
      const availableColors = event.teams
        ? COLOR_KEYS.filter((color) => !usedColors.includes(color))
        : ["BLACK"];
      const updatedEvent = await addTeam(event.id, {
        players: [],
        id: 0,
        color: (availableColors[0] ? availableColors[0] : "BLACK") as TeamColor,
      });
      toast.success("Se agregó un nuevo equipo!");
      if (onTeamAdded) {
        onTeamAdded(updatedEvent as PaddleEvent | VolleyEvent);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error al unirse al equipo"
      );
    }
  };

  return (
    <div>
      <button
        className="add-team-btn"
        onClick={handleClick}
        disabled={disabled}
      >
        Agregar Equipo
      </button>
    </div>
  );
};

export default AddTeamButton;
