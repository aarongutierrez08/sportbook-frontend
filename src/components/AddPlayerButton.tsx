import React from 'react';
import { joinTeam } from '../api/eventsApi';
import toast from 'react-hot-toast';

interface AddPlayerButtonProps {
  eventId: number;
  teamId: number;
  onPlayerAdded?: (updatedEvent: any) => void;
  disabled?: boolean
}

const AddPlayerButton: React.FC<AddPlayerButtonProps> = ({ eventId, teamId, onPlayerAdded, disabled }) => {
  const handleClick = async () => {
    try {
      const updatedEvent = await joinTeam(eventId, teamId);
      toast.success('Te has unido al equipo exitosamente');
      if (onPlayerAdded) {
        onPlayerAdded(updatedEvent);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al unirse al equipo');
    }
  };

  return (
      <div className="team-header">
        <button className="add-player-btn" onClick={handleClick} disabled={disabled}>
          +
        </button>
      </div>
  );
};

export default AddPlayerButton;
