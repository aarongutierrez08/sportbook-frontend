import React, { useState, useMemo } from "react";
import {
  type FinishEventRequest,
  type VolleyEvent,
  type Team,
  type SetResult,
} from "../../../types/apiTypes";
import { getTeamColorName, getTeamThemeClass } from "../event-stats/colorUtils";
import "./finishEventCommonDetails.css";
import "./setsEventDetails.css";

interface VolleyEventFinishDetailsProps {
  event: VolleyEvent;
  onSubmit: (data: FinishEventRequest) => void;
  onClose: () => void;
}

const VolleyEventFinishDetails: React.FC<VolleyEventFinishDetailsProps> = ({
  event,
  onSubmit,
  onClose,
}) => {
  const [sets, setSets] = useState<SetResult[]>([
    { team1Score: 0, team2Score: 0 },
  ]);
  const [missingPlayers, setMissingPlayers] = useState<number[]>([]);
  const [mvpId, setMvpId] = useState<number | null>(null);

  const team1 = event.teams[0];
  const team2 = event.teams[1];

  const handleScoreChange = (index: number, team: 1 | 2, delta: number) => {
    const currentSet = sets[index];
    const myScore = team === 1 ? currentSet.team1Score : currentSet.team2Score;
    const opponentScore =
      team === 1 ? currentSet.team2Score : currentSet.team1Score;

    const newScore = myScore + delta;

    if (newScore < 0) return;

    if (delta > 0) {
      const targetScore = index === 4 ? 15 : 25;

      if (myScore >= targetScore && myScore - opponentScore >= 2) {
        return;
      }
    }

    const newSets = [...sets];
    if (team === 1) newSets[index].team1Score = newScore;
    else newSets[index].team2Score = newScore;
    setSets(newSets);
  };

  const addSet = () => {
    if (sets.length < 5) setSets([...sets, { team1Score: 0, team2Score: 0 }]);
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) setSets(sets.filter((_, idx) => idx !== index));
  };

  const winningTeamId = useMemo(() => {
    let t1Wins = 0;
    let t2Wins = 0;

    sets.forEach((set, idx) => {
      const target = idx === 4 ? 15 : 25;

      const t1WonSet =
        set.team1Score >= target && set.team1Score - set.team2Score >= 2;
      const t2WonSet =
        set.team2Score >= target && set.team2Score - set.team1Score >= 2;

      if (t1WonSet) t1Wins++;
      else if (t2WonSet) t2Wins++;
      else if (set.team1Score > set.team2Score) t1Wins++;
      else if (set.team2Score > set.team1Score) t2Wins++;
    });

    if (t1Wins > t2Wins) return team1.id;
    if (t2Wins > t1Wins) return team2.id;
    return null;
  }, [sets, team1.id, team2.id]);

  const handleToggleMissing = (id: number) => {
    setMissingPlayers((prev) =>
      prev.includes(id)
        ? prev.filter((playerId) => playerId !== id)
        : [...prev, id]
    );
    if (mvpId === id) setMvpId(null);
  };

  const handleSubmit = () => {
    onSubmit({
      winningTeamId,
      goals: [],
      missingPlayerIds: missingPlayers,
      mvpId: mvpId || undefined,
      sets: sets,
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
            const isMissing = missingPlayers.includes(player.id);
            return (
              <div
                key={player.id}
                className={`fem-player-item ${isMissing ? "missing" : ""}`}
              >
                <div className="fem-player-info">
                  <span className="fem-player-name">{player.name}</span>
                  {mvpId === player.id && (
                    <span className="fem-mvp-indicator">⭐ MVP</span>
                  )}
                </div>
                <div className="fem-player-actions">
                  <button
                    onClick={() =>
                      setMvpId((prev) =>
                        prev === player.id ? null : player.id
                      )
                    }
                    className={`fem-action-button mvp-btn ${
                      mvpId === player.id ? "selected" : ""
                    }`}
                    disabled={isMissing}
                  >
                    MVP
                  </button>
                  <button
                    onClick={() => handleToggleMissing(player.id)}
                    className={`fem-action-button missing-btn ${
                      isMissing ? "selected" : ""
                    }`}
                  >
                    Faltó
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="football-event-finish-container">
      <div className="fem-sets-container">
        <h3>Sets (Vóley)</h3>
        <div className="fem-sets-grid">
          {sets.map((set, idx) => (
            <div key={idx} className="fem-set-row">
              <span className="fem-set-label">Set {idx + 1}</span>
              <div className="fem-set-controls">
                <div
                  className={`fem-set-input-group ${getTeamThemeClass(
                    team1.color
                  )}`}
                >
                  <button onClick={() => handleScoreChange(idx, 1, -1)}>
                    −
                  </button>
                  <span className="fem-set-score">{set.team1Score}</span>
                  <button onClick={() => handleScoreChange(idx, 1, 1)}>
                    +
                  </button>
                </div>
                <span className="fem-set-divider">-</span>
                <div
                  className={`fem-set-input-group ${getTeamThemeClass(
                    team2.color
                  )}`}
                >
                  <button onClick={() => handleScoreChange(idx, 2, -1)}>
                    −
                  </button>
                  <span className="fem-set-score">{set.team2Score}</span>
                  <button onClick={() => handleScoreChange(idx, 2, 1)}>
                    +
                  </button>
                </div>
                {sets.length > 1 && (
                  <button
                    className="fem-remove-set-btn"
                    onClick={() => removeSet(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {sets.length < 5 && (
          <button
            className="btn btn--secondary btn--sm"
            onClick={addSet}
            style={{ marginTop: "1rem" }}
          >
            + Agregar Set
          </button>
        )}
      </div>

      <div className="fem-teams-container">
        {renderTeamSection(team1)}
        {renderTeamSection(team2)}
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

export default VolleyEventFinishDetails;
