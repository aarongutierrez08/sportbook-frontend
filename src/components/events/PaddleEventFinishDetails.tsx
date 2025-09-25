import React from 'react';
import { PaddleEvent, PlayerInfo } from '../../types/events';

interface PaddleEventFinishDetailsProps {
    event: PaddleEvent;
    missingPlayers: number[];
    mvpId: number | null;
    winningTeamId: number | null;
    onToggleMissingPlayer: (playerId: number) => void;
    onSetMvp: (playerId: number) => void;
    onSetWinningTeam: (teamId: number) => void;
}

const PaddleEventFinishDetails: React.FC<PaddleEventFinishDetailsProps> = ({
    event,
    missingPlayers,
    mvpId,
    winningTeamId,
    onToggleMissingPlayer,
    onSetMvp,
    onSetWinningTeam,
}) => {
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
                                    onClick={() => onSetMvp(player.id)}
                                    className={`action-button mvp ${mvpId === player.id ? 'selected' : ''}`}
                                >
                                    MVP
                                </button>
                                <button
                                    onClick={() => onToggleMissingPlayer(player.id)}
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
        <div className="teams-container">
            {event.teams?.map(team => (
                <div
                    key={team.id}
                    className={`team-winner-selector ${winningTeamId === team.id ? 'selected' : ''}`}
                    onClick={() => onSetWinningTeam(team.id)}
                >
                    {renderTeamSection(team)}
                </div>
            ))}
        </div>
    );
};

export default PaddleEventFinishDetails;
