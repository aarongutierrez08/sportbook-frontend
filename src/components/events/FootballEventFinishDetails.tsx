import React from 'react';
import { FootballEvent, Goal, PlayerInfo } from '../../types/events';

interface FootballEventFinishDetailsProps {
    event: FootballEvent;
    goals: Goal[];
    missingPlayers: number[];
    mvpId: number | null;
    winningTeamId: number | null;
    onAddGoal: (teamId: number, playerId: number) => void;
    onRemoveGoal: (index: number) => void;
    onToggleMissingPlayer: (playerId: number) => void;
    onSetMvp: (playerId: number) => void;
    onSetWinningTeam: (teamId: number) => void;
}

const FootballEventFinishDetails: React.FC<FootballEventFinishDetailsProps> = ({
    event,
    goals,
    missingPlayers,
    mvpId,
    winningTeamId,
    onAddGoal,
    onRemoveGoal,
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
                                    onClick={() => onAddGoal(teamInfo.id, player.id)}
                                    className="action-button goal"
                                >
                                    + Gol
                                </button>
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
        <>
            <div className="teams-container">
                <div
                    className={`team-winner-selector ${winningTeamId === event.firstTeam.id ? 'selected' : ''}`}
                    onClick={() => onSetWinningTeam(event.firstTeam.id)}
                >
                    {renderTeamSection(event.firstTeam)}
                </div>
                <div
                    className={`team-winner-selector ${winningTeamId === event.secondTeam.id ? 'selected' : ''}`}
                    onClick={() => onSetWinningTeam(event.secondTeam.id)}
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
                                        onClick={() => onRemoveGoal(index)}
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
        </>
    );
};

export default FootballEventFinishDetails;
