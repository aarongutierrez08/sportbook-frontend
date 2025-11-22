import React, { useState } from "react";
import type { SportUser, Player } from "../../types/apiTypes";
import { PlayerSelector } from "./PlayerSelector";
import type { UpdateEventParams } from "../../pages/event/ActiveEventDetails";

interface EditableUserFieldProps {
  label: string;
  field: keyof UpdateEventParams;
  user?: SportUser;
  onChange: (field: keyof UpdateEventParams, userId: number) => void;
  enabled?: boolean;
}

const EditableUserField: React.FC<EditableUserFieldProps> = ({
  label,
  field,
  user,
  onChange,
  enabled = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    user ? `${user.name} ${user.lastName}` : "Sin asignar"
  );

  const handlePlayerChange = (players: Player[]) => {
    if (players.length > 0 && players[0].user) {
      setDisplayName(`${players[0].user.name} ${players[0].user.lastName}`);
      onChange(field, players[0].user.id);
      setIsEditing(false);
    }
  };

  return (
    <p className="editable-field">
      {label}:{" "}
      {isEditing ? (
        <div className="editable-user-container">
          <PlayerSelector
            selectedPlayers={[]}
            onChange={handlePlayerChange}
            label=""
            placeholder="Buscar usuario por username..."
            allowGuests={false}
          />
        </div>
      ) : (
        <span>{displayName}</span>
      )}
      {enabled && (
        <span
          className="edit-icon"
          title={`Editar ${label.toLowerCase()}`}
          onClick={() => setIsEditing(!isEditing)}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ verticalAlign: "middle" }}
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </span>
      )}
    </p>
  );
};

export default EditableUserField;
