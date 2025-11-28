import React, { useState, useMemo } from "react";
import {
  type TeamGoalRequest,
  type FinishEventRequest,
  type FootballEvent,
  type Team,
} from "../../../types/apiTypes";
import { getTeamColorName, getTeamThemeClass } from "../event-stats/colorUtils";

interface FootballEventFinishDetailsProps {
  event: FootballEvent;
  onSubmit: (data: FinishEventRequest) => void;
  onClose: () => void;
}

const FootballEventFinishDetails: React.FC<FootballEventFinishDetailsProps> = ({
  event,
  onSubmit,
  onClose,
}) => {
  const [goals, setGoals] = useState<TeamGoalRequest[]>([]);
  const [missingPlayers, setMissingPlayers] = useState<number[]>([]);
  const [mvpId, setMvpId] = useState<number | null>(null);

  const firstTeam = event.teams[0];
  const secondTeam = event.teams[1];

  const handleAddGoal = (teamId: number, playerId: number) => {
    if (missingPlayers.includes(playerId)) return;
    setGoals((prev) => [...prev, { teamId, playerId }]);
  };

  const handleRemoveGoal = (index: number, playerId: number) => {
    if (missingPlayers.includes(playerId)) return;
    setGoals((prev) => prev.filter((_, currentIdx) => currentIdx !== index));
  };

  const handleToggleMissingPlayer = (playerId: number) => {
    setMissingPlayers((prev) => {
      const isMissing = prev.includes(playerId);
      const updated = isMissing
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      if (!isMissing) {
        setGoals((prev) => prev.filter((goal) => goal.playerId !== playerId));
      }
      if (mvpId === playerId) {
        setMvpId(null);
      }
      return updated;
    });
  };

  const handleSetMvp = (playerId: number) => {
    if (missingPlayers.includes(playerId)) return;
    setMvpId(playerId === mvpId ? null : playerId);
  };

  const firstTeamGoals = goals.filter(
    (goal) => goal.teamId === firstTeam.id
  ).length;
  const secondTeamGoals = goals.filter(
    (goal) => goal.teamId === secondTeam.id
  ).length;

  const winningTeamId = useMemo(() => {
    if (firstTeamGoals > secondTeamGoals) return firstTeam.id;
    if (secondTeamGoals > firstTeamGoals) return secondTeam.id;
    return null;
  }, [firstTeam.id, firstTeamGoals, secondTeam.id, secondTeamGoals]);

  const getPlayerGoalsCount = (teamId: number, playerId: number) =>
    goals.filter((goal) => goal.teamId === teamId && goal.playerId === playerId)
      .length;

  const handleSubmit = () => {
    onSubmit({
      winningTeamId,
      goals,
      missingPlayerIds: missingPlayers,
      ...(mvpId !== null && { mvpId }),
    });
  };

  const renderTeamSection = (team: Team) => {
    const themeClass = getTeamThemeClass(team.color);
    const isWinner = winningTeamId === team.id;

    return (
      <div
        className={`fem-team-section ${themeClass} ${
          isWinner ? "winner-feedback" : ""
        }`}
      >
        <div className="fem-team-header">
          <div className="fem-team-color-badge">
            {getTeamColorName(team.color)}
          </div>
          {isWinner && <span className="fem-winner-badge">🏆 Ganador</span>}
        </div>

        <div className="fem-players-list">
          {team.players.map((player) => {
            const goalsCount = getPlayerGoalsCount(team.id, player.id);
            const isMissing = missingPlayers.includes(player.id);
            const isMvp = mvpId === player.id;

            return (
              <div
                key={player.id}
                className={`fem-player-item ${isMissing ? "missing" : ""} ${
                  isMvp ? "mvp" : ""
                }`}
              >
                <div className="fem-player-info">
                  <span className="fem-player-name">{player.name}</span>
                  {isMvp && <span className="fem-mvp-indicator">⭐ MVP</span>}
                  {isMissing && (
                    <span className="fem-missing-indicator">Ausente</span>
                  )}
                </div>

                <div className="fem-player-controls">
                  <div className="fem-goals-counter">
                    <button
                      className="fem-goal-button remove"
                      onClick={() => {
                        const lastGoalIndex = [...goals]
                          .reverse()
                          .findIndex(
                            (goal) =>
                              goal.teamId === team.id &&
                              goal.playerId === player.id
                          );
                        if (lastGoalIndex !== -1) {
                          handleRemoveGoal(
                            goals.length - 1 - lastGoalIndex,
                            player.id
                          );
                        }
                      }}
                      disabled={goalsCount === 0 || isMissing}
                    >
                      {" "}
                      −{" "}
                    </button>

                    <span className="fem-goals-count">{goalsCount}</span>

                    <button
                      className="fem-goal-button add"
                      onClick={() => handleAddGoal(team.id, player.id)}
                      disabled={isMissing}
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>

                  <div className="fem-player-actions">
                    <button
                      onClick={() => handleSetMvp(player.id)}
                      className={`fem-action-button mvp-btn ${
                        isMvp ? "selected" : ""
                      }`}
                      disabled={isMissing}
                    >
                      {" "}
                      MVP{" "}
                    </button>
                    <button
                      onClick={() => handleToggleMissingPlayer(player.id)}
                      className={`fem-action-button missing-btn ${
                        isMissing ? "selected" : ""
                      }`}
                    >
                      {" "}
                      Faltó{" "}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const firstTeamTheme = getTeamThemeClass(firstTeam.color);
  const secondTeamTheme = getTeamThemeClass(secondTeam.color);

  return (
    <div className="football-event-finish-container">
      <div className="fem-teams-container">
        {renderTeamSection(firstTeam)}
        {renderTeamSection(secondTeam)}
      </div>

      <div className="fem-match-summary">
        <h3>Resumen del partido</h3>
        <div className="fem-summary-content">
          <div className="fem-score">
            <div
              className={`fem-team-score ${firstTeamTheme} ${
                winningTeamId === firstTeam.id ? "winner-score" : ""
              }`}
            >
              <span className="fem-team-name">
                {getTeamColorName(firstTeam.color)}
              </span>
              <span className="fem-score-number">{firstTeamGoals}</span>
            </div>

            <span className="fem-score-separator">−</span>

            <div
              className={`fem-team-score ${secondTeamTheme} ${
                winningTeamId === secondTeam.id ? "winner-score" : ""
              }`}
            >
              <span className="fem-score-number">{secondTeamGoals}</span>
              <span className="fem-team-name">
                {getTeamColorName(secondTeam.color)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="fem-modal-actions">
        <button onClick={onClose} className="btn btn--secondary btn--lg">
          Cancelar
        </button>
        <button onClick={handleSubmit} className="btn btn--lg">
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default FootballEventFinishDetails;
