import React, { useState } from 'react';
import type { SportEvent, Goal, FootballEvent, PaddleEvent, VolleyEvent } from '../types/events';
import '../styles/finishEventModal.css';
import FootballEventFinishDetails from './events/FootballEventFinishDetails';
import PaddleEventFinishDetails from './events/PaddleEventFinishDetails';
import VolleyEventFinishDetails from './events/VolleyEventFinishDetails';

interface FinishEventModalProps {
    event: SportEvent;
    onClose: () => void;
    onSubmit: (data: {
        winningTeamId: number;
        goals?: Goal[];
        missingPlayerIds: number[];
        mvpId?: number;
    }) => void;
}

const FinishEventModal: React.FC<FinishEventModalProps> = ({ event, onClose, onSubmit }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [missingPlayers, setMissingPlayers] = useState<number[]>([]);
    const [winningTeamId, setWinningTeamId] = useState<number | null>(null);
    const [mvpId, setMvpId] = useState<number | null>(null);

    const handleAddGoal = (teamId: number, playerId: number) => {
        setGoals(prev => [...prev, { teamId, playerId }]);
    };

    const handleRemoveGoal = (index: number) => {
        setGoals(prev => prev.filter((_, i) => i !== index));
    };

    const handleToggleMissingPlayer = (playerId: number) => {
        setMissingPlayers(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const handleSubmit = () => {
        if (winningTeamId === null) {
            alert('Por favor selecciona el equipo ganador');
            return;
        }

        onSubmit({
            winningTeamId,
            ...(event.sport === 'FOOTBALL' && { goals }),
            missingPlayerIds: missingPlayers,
            ...(mvpId && { mvpId })
        });
    };

    const renderEventDetails = () => {
        const commonProps = {
            missingPlayers,
            mvpId,
            winningTeamId,
            onToggleMissingPlayer: handleToggleMissingPlayer,
            onSetMvp: setMvpId,
            onSetWinningTeam: setWinningTeamId,
        };

        switch (event.sport) {
            case 'FOOTBALL':
                return (
                    <FootballEventFinishDetails
                        event={event as FootballEvent}
                        goals={goals}
                        onAddGoal={handleAddGoal}
                        onRemoveGoal={handleRemoveGoal}
                        {...commonProps}
                    />
                );
            case 'PADDLE':
                return (
                    <PaddleEventFinishDetails
                        event={event as PaddleEvent}
                        {...commonProps}
                    />
                );
            case 'VOLLEY':
                return (
                    <VolleyEventFinishDetails
                        event={event as VolleyEvent}
                        {...commonProps}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="finish-event-modal">
                <h2>Finalizar Evento</h2>
                {renderEventDetails()}
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-button">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="submit-button">
                        Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinishEventModal;
