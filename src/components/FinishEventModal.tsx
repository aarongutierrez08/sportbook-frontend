import React, { useState } from 'react';
import { FootballEvent, Goal, PlayerInfo } from '../types/events';
import '../styles/finishEventModal.css';

interface FinishEventModalProps {
    event: FootballEvent;
    onClose: () => void;
    onSubmit: (data: {
        winningTeamId: number;
        goals: Goal[];
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
            goals,
            missingPlayerIds: missingPlayers,
            ...(mvpId && { mvpId })
        });
    };

    const renderTeamSection = (teamInfo: { id: number, color: string, players: PlayerInfo[] }) => (
        <div className="team-section">
            <h3>Equipo {teamInfo.color}</h3>
            <div className="players-list">
                {teamInfo.players.map(player => (
                    <div key={player.id} className="player-item">
                        <div className="player-name">
                            {player.name}
                            <div className="player-actions">
                                <button
                                    onClick={() => handleAddGoal(teamInfo.id, player.id)}
                                    className="action-button goal"
                                >
                                    + Gol
                                </button>
                                <button
                                    onClick={() => setMvpId(player.id)}
                                    className={`action-button mvp ${mvpId === player.id ? 'selected' : ''}`}
                                >
                                    MVP
                                </button>
                                <button
                                    onClick={() => handleToggleMissingPlayer(player.id)}
                                    className={`action-button missing ${missingPlayers.includes(player.id) ? 'selected' : ''}`}
                                >
                                    Faltó
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="finish-event-modal">
                <h2>Finalizar Evento</h2>

                <div className="teams-container">
                    <div
                        className={`team-winner-selector ${winningTeamId === event.firstTeam.id ? 'selected' : ''}`}
                        onClick={() => setWinningTeamId(event.firstTeam.id)}
                    >
                        {renderTeamSection(event.firstTeam)}
                    </div>
                    <div
                        className={`team-winner-selector ${winningTeamId === event.secondTeam.id ? 'selected' : ''}`}
                        onClick={() => setWinningTeamId(event.secondTeam.id)}
                    >
                        {renderTeamSection(event.secondTeam)}
                    </div>
                </div>

                {goals.length > 0 && (
                    <div className="goals-summary">
                        <h3>Goles</h3>
                        <ul>
                            {goals.map((goal, index) => {
                                const team = goal.teamId === event.firstTeam.id ? event.firstTeam : event.secondTeam;
                                const player = team.players.find(p => p.id === goal.playerId);
                                return (
                                    <li key={index}>
                                        {player?.name} ({team.color})
                                        <button
                                            onClick={() => handleRemoveGoal(index)}
                                            className="remove-goal"
                                        >
                                            ×
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

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
