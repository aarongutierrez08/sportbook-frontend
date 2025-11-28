import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "./EventStatsModal.css";
import { Chip } from "./Chip";
import { Muted } from "./Muted";
import { CardSection } from "./CardSection";
import { WinnerLine } from "./WinnerLine";
import { KpiCard } from "./KpiCard";
import { getEventStats } from "../../../api/eventsApi";
import type {
  EventStatsResponse,
  Sport,
  TeamColor,
} from "../../../types/apiTypes";
import { getTeamColorName, getTeamThemeClass } from "./colorUtils";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";

type EventStatsModalProps = {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;

  pictures: Record<number, string>;
};

type SportConfigType = {
  scoreLabel: string;
  scoreUnit: string;
  icon: React.ReactNode;
};

const SPORT_CONFIG: Record<Sport, SportConfigType> = {
  FOOTBALL: {
    scoreLabel: "Goles totales",
    scoreUnit: "goles",
    icon: <SportsSoccerIcon />,
  },
  PADDLE: {
    scoreLabel: "Sets jugados",
    scoreUnit: "sets",
    icon: <SportsTennisIcon />,
  },
  VOLLEY: {
    scoreLabel: "Sets jugados",
    scoreUnit: "sets",
    icon: <SportsVolleyballIcon />,
  },
};

const PlayerAvatar: React.FC<{
  name: string;
  colorClass: string;
  photoUrl?: string;
}> = ({ name, colorClass, photoUrl }) => {
  if (photoUrl) {
    return (
      <div className={`esm-avatar has-photo ${colorClass}`}>
        <img src={photoUrl} alt={name} className="esm-avatar-img" />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return <div className={`esm-avatar ${colorClass}`}>{initials}</div>;
};

const EventStatsModal: React.FC<EventStatsModalProps> = ({
  eventId,
  isOpen,
  onClose,
  pictures,
}) => {
  const [eventStats, setEventStats] = useState<EventStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setEventStats(null);
      setLoading(true);
      getEventStats(eventId)
        .then((res) => setEventStats(res))
        .catch(() => toast.error("No se pudieron cargar las estadísticas"))
        .finally(() => setLoading(false));
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    }
  }, [isOpen, eventId]);

  const getDisplayName = (name: string | undefined, color: TeamColor) => {
    if (name && name.trim() !== "") return name;
    return getTeamColorName(color);
  };

  if (!isOpen) return null;

  const attendancePct = eventStats
    ? Math.round(eventStats.attendanceRate * 100)
    : 0;

  const sportConfig = eventStats
    ? SPORT_CONFIG[eventStats.sport]
    : SPORT_CONFIG.FOOTBALL;

  return (
    <div className="esm-backdrop" role="none">
      <dialog
        className="esm-modal"
        aria-modal="true"
        aria-labelledby="stats-title"
        aria-describedby="stats-content"
      >
        <div className="esm-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {sportConfig.icon}
            <h3 id="stats-title">Estadísticas del evento</h3>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="esm-closeBtn"
            aria-label="Cerrar estadísticas"
          >
            ✕
          </button>
        </div>
        <div className="esm-body" id="stats-content">
          {loading && <div className="esm-loading">Cargando estadísticas…</div>}
          {!loading && eventStats && (
            <>
              <div className="esm-kpis-grid">
                <KpiCard
                  label="Registrados"
                  value={eventStats.totalRegisteredPlayers}
                />
                <KpiCard label="Presentes" value={eventStats.presentPlayers} />
                <KpiCard label="Ausentes" value={eventStats.absentPlayers} />
                <KpiCard
                  label="Asistencia"
                  value={`${attendancePct}%`}
                  progressPercent={attendancePct}
                />
                <KpiCard
                  label={sportConfig.scoreLabel}
                  value={eventStats.totalGoals}
                />
              </div>

              <div className="esm-row--two">
                <CardSection title="Equipo ganador">
                  {eventStats.winningTeam ? (
                    <WinnerLine
                      textLabel={getDisplayName(
                        eventStats.winningTeam.name,
                        eventStats.winningTeam.color
                      )}
                      teamColor={eventStats.winningTeam.color}
                    />
                  ) : (
                    <Muted>Empate</Muted>
                  )}
                </CardSection>
                <CardSection title="MVP">
                  {eventStats.mvp ? (
                    <div className="esm-mvp-display">
                      <PlayerAvatar
                        name={eventStats.mvp.name}
                        photoUrl={pictures[eventStats.mvp.id]}
                        colorClass={
                          eventStats.mvp.teamColor
                            ? getTeamThemeClass(eventStats.mvp.teamColor)
                            : ""
                        }
                      />
                      <span className="esm-mvp-name">
                        {eventStats.mvp.name}
                      </span>
                    </div>
                  ) : (
                    <Muted>No definido</Muted>
                  )}
                </CardSection>
              </div>

              <CardSection title={`Marcador Final (${sportConfig.scoreUnit})`}>
                <div className="esm-scores">
                  {[...eventStats.scores]
                    .sort((scoreA, scoreB) => scoreB.goals - scoreA.goals)
                    .map((score) => {
                      const themeClass = getTeamThemeClass(score.color);
                      return (
                        <div
                          key={score.teamId}
                          className={`esm-scoreRow ${themeClass} ${
                            score.isWinner ? "is-winner" : ""
                          }`}
                        >
                          <div className="esm-scoreTeam">
                            <span className="esm-scoreTeamName">
                              {getDisplayName(score.name, score.color)}
                            </span>
                          </div>
                          <div className="esm-scoreGoals">{score.goals}</div>
                        </div>
                      );
                    })}
                </div>
              </CardSection>

              {eventStats.sets && eventStats.sets.length > 0 && (
                <CardSection title="Desglose de Sets">
                  <div className="esm-sets-container">
                    {eventStats.sets.map((set, idx) => {
                      const t1Win = set.team1Score > set.team2Score;
                      const t2Win = set.team2Score > set.team1Score;

                      const colorT1 = eventStats.scores[0]?.color;
                      const colorT2 = eventStats.scores[1]?.color;
                      const themeT1 = colorT1 ? getTeamThemeClass(colorT1) : "";
                      const themeT2 = colorT2 ? getTeamThemeClass(colorT2) : "";

                      return (
                        <div key={idx} className="esm-set-pill">
                          <span className="esm-set-label">Set {idx + 1}</span>
                          <div className="esm-set-result">
                            <span
                              className={`esm-set-num ${
                                t1Win ? themeT1 : "loser"
                              }`}
                            >
                              {set.team1Score}
                            </span>
                            <span className="esm-set-dash">-</span>
                            <span
                              className={`esm-set-num ${
                                t2Win ? themeT2 : "loser"
                              }`}
                            >
                              {set.team2Score}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardSection>
              )}

              <CardSection title="Goleadores / Jugadores Destacados">
                {eventStats.goalsDetail?.length === 0 ? (
                  <Muted>No hay datos individuales registrados</Muted>
                ) : (
                  <div className="esm-table">
                    <div className="esm-thead">
                      <div>Pos</div>
                      <div>Jugador</div>
                      <div>Equipo</div>
                      <div className="esm-goalsHeader">Goles</div>
                    </div>
                    <div className="esm-tbody">
                      {eventStats.goalsDetail?.map((row, index) => {
                        const teamScore = eventStats.scores.find(
                          (s) => s.teamId === row.teamId
                        );
                        const themeClass = row.player.teamColor
                          ? getTeamThemeClass(row.player.teamColor)
                          : "";

                        return (
                          <div
                            key={`${row.player.id}-${index}`}
                            className="esm-trow"
                          >
                            <div>{index + 1}</div>
                            <div className="esm-playerCell">
                              <PlayerAvatar
                                name={row.player.name}
                                photoUrl={pictures[row.player.id]}
                                colorClass={themeClass}
                              />
                              <span className="esm-playerName">
                                {row.player.name}
                              </span>
                            </div>
                            <div>
                              {teamScore ? (
                                <Chip teamColor={teamScore.color}>
                                  {getDisplayName(
                                    teamScore.name,
                                    teamScore.color
                                  )}
                                </Chip>
                              ) : (
                                "—"
                              )}
                            </div>
                            <div className="esm-goalsCell">{row.goals}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardSection>

              <CardSection title="Ausentes">
                {eventStats.missingPlayers.length === 0 ? (
                  <Muted>No hubo ausentes</Muted>
                ) : (
                  <div className="esm-chips">
                    {eventStats.missingPlayers.map((missingPlayer) => (
                      <div key={missingPlayer.id} className="esm-chip-avatar">
                        <PlayerAvatar
                          name={missingPlayer.name}
                          photoUrl={pictures[missingPlayer.id]}
                          colorClass={
                            missingPlayer.teamColor
                              ? getTeamThemeClass(missingPlayer.teamColor)
                              : ""
                          }
                        />
                        <span>{missingPlayer.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardSection>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default EventStatsModal;
