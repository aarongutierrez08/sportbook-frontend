import React, { useState } from 'react';
import type {FootballEvent, Goal, FinishEventParams, TeamInfo} from '../../../types/events';

interface FootballEventFinishDetailsProps {
    event: FootballEvent;
    onSubmit: (data: FinishEventParams) => void;
}

const FootballEventFinishDetails: React.FC<FootballEventFinishDetailsProps> = ({
    event,
    onSubmit,
}) => {
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

    const getPlayerGoalsCount = (teamId: number, playerId: number) => {
        return goals.filter(goal => goal.teamId === teamId && goal.playerId === playerId).length;
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

    const renderTeamSection = (teamInfo: TeamInfo) => (
        <div className="fem-team-section">
            <h3>Equipo {teamInfo.color}</h3>
            <div className="fem-players-list">
                {teamInfo.players!.map(player => {
                    const goalsCount = getPlayerGoalsCount(teamInfo.id, player.id);
                    return (
                        <div key={player.id} className="fem-player-item">
                            <div className="fem-player-name">
                                <span>{player.name}</span>
                                <div className="fem-player-stats">
                                    <div className="fem-goals-counter">
                                        <button
                                            className="fem-goal-button remove"
                                            onClick={() => {
                                                const lastGoalIndex = [...goals].reverse().findIndex(
                                                    goal => goal.teamId === teamInfo.id && goal.playerId === player.id
                                                );
                                                if (lastGoalIndex !== -1) {
                                                    handleRemoveGoal(goals.length - 1 - lastGoalIndex);
                                                }
                                            }}
                                            disabled={goalsCount === 0}
                                        >
                                            -
                                        </button>
                                        <span className="fem-goals-count">
                                            {goalsCount} {goalsCount === 1 ? 'gol' : 'goles'}
                                        </span>
                                        <button
                                            className="fem-goal-button add"
                                            onClick={() => handleAddGoal(teamInfo.id, player.id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="fem-player-actions">
                                        <button
                                            onClick={() => setMvpId(player.id)}
                                            className={`fem-action-button mvp ${mvpId === player.id ? 'selected' : ''}`}
                                            title="Jugador más valioso"
                                        >
                                            MVP
                                        </button>
                                        <button
                                            onClick={() => handleToggleMissingPlayer(player.id)}
                                            className={`fem-action-button missing ${missingPlayers.includes(player.id) ? 'selected' : ''}`}
                                            title="Jugador ausente"
                                        >
                                            Faltó
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            <div className="fem-teams-container">
                <div
                    className={`fem-team-winner-selector ${winningTeamId === event.firstTeam.id ? 'selected' : ''}`}
                    onClick={() => setWinningTeamId(event.firstTeam.id)}
                >
                    {renderTeamSection(event.firstTeam)}
                </div>
                <div
                    className={`fem-team-winner-selector ${winningTeamId === event.secondTeam.id ? 'selected' : ''}`}
                    onClick={() => setWinningTeamId(event.secondTeam.id)}
                >
                    {renderTeamSection(event.secondTeam)}
                </div>
            </div>

            <div className="fem-match-summary">
                <h3>Resumen del partido</h3>
                <div className="fem-summary-content">
                    <div className="fem-score">
                        <div className="fem-team-score">
                            <span className="fem-team-name">{event.firstTeam.color}</span>
                            <span className="fem-score-number">
                                {goals.filter(g => g.teamId === event.firstTeam.id).length}
                            </span>
                        </div>
                        <span className="fem-score-separator">-</span>
                        <div className="fem-team-score">
                            <span className="fem-score-number">
                                {goals.filter(g => g.teamId === event.secondTeam.id).length}
                            </span>
                            <span className="fem-team-name">{event.secondTeam.color}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fem-modal-actions">
                <button onClick={handleSubmit} className="btn btn--lg">
                    Finalizar
                </button>
            </div>
        </>
    );
};

export default FootballEventFinishDetails;
