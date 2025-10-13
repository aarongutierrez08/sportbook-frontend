import React, { useState } from 'react';
import { type FinishEventParams, type PaddleEvent, type TeamInfo } from '../../../types/events';

interface PaddleEventFinishDetailsProps {
    event: PaddleEvent;
    onSubmit: (data: FinishEventParams) => void;
}

const PaddleEventFinishDetails: React.FC<PaddleEventFinishDetailsProps> = ({
    event,
    onSubmit,
}) => {
    const [missingPlayers, setMissingPlayers] = useState<number[]>([]);
    const [winningTeamId, setWinningTeamId] = useState<number | null>(null);
    const [mvpId, setMvpId] = useState<number | null>(null);

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
            goals: [],
            winningTeamId,
            missingPlayerIds: missingPlayers,
            ...(mvpId && { mvpId })
        });
    };

    const renderTeamSection = (teamInfo: TeamInfo) => (
        <div className="fem-team-section">
            <h3>Equipo {teamInfo.color}</h3>
            <div className="fem-players-list">
                {teamInfo.players!.map(player => (
                    <div key={player.id} className="fem-player-item">
                        <div className="fem-player-name">
                            <span>{player.name}</span>
                            <div className="fem-player-stats">
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
                ))}
            </div>
        </div>
    );

    const teams: TeamInfo[] = event.teams || [];

    return (
        <>
            <div className="fem-teams-container">
                {teams.map(team => (
                    <div
                        key={team.id}
                        className={`fem-team-winner-selector ${winningTeamId === team.id ? 'selected' : ''}`}
                        onClick={() => setWinningTeamId(team.id)}
                    >
                        {renderTeamSection(team)}
                    </div>
                ))}
            </div>

            <div className="fem-modal-actions">
                <button onClick={handleSubmit} className="btn btn--lg">
                    Finalizar
                </button>
            </div>
        </>
    );
};

export default PaddleEventFinishDetails;
