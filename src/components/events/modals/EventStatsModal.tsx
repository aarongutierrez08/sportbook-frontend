import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "./EventStatsModal.css";
import { getEventStats } from "../../../api/eventsApi";
import type { EventStats } from "../../../types/events";

type EventStatsModalProps = {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
};

const EventStatsModal: React.FC<EventStatsModalProps> = ({
  eventId,
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setData(null);
      setLoading(true);
      getEventStats(eventId)
        .then((res) => setData(res))
        .catch(() => toast.error("No se pudieron cargar las estadísticas"))
        .finally(() => setLoading(false));

      setTimeout(() => closeBtnRef.current?.focus(), 0);
    }
  }, [isOpen, eventId]);

  if (!isOpen) return null;

  const attendancePct = data ? Math.round(data.attendanceRate * 100) : 0;

  return (
    <div className="esm-backdrop" role="presentation" onClick={onClose}>
      <div
        className="esm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-title"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div className="esm-header">
          <h3 id="stats-title">Estadísticas del evento</h3>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="esm-closeBtn"
            aria-label="Cerrar estadísticas"
          >
            ✕
          </button>
        </div>

        <div className="esm-body">
          {loading && <div className="esm-loading">Cargando estadísticas…</div>}

          {!loading && data && (
            <>
              <div className="esm-kpis-grid">
                <div className="esm-kpi">
                  <div className="esm-kpi-label">Registrados</div>
                  <div className="esm-kpi-value">
                    {data.totalRegisteredPlayers}
                  </div>
                </div>
                <div className="esm-kpi">
                  <div className="esm-kpi-label">Presentes</div>
                  <div className="esm-kpi-value">{data.presentPlayers}</div>
                </div>
                <div className="esm-kpi">
                  <div className="esm-kpi-label">Ausentes</div>
                  <div className="esm-kpi-value">{data.absentPlayers}</div>
                </div>
                <div className="esm-kpi">
                  <div className="esm-kpi-label">Asistencia</div>
                  <div className="esm-kpi-value">{attendancePct}%</div>
                  <div className="esm-progress">
                    <div
                      className="esm-progressBar"
                      style={{ width: `${attendancePct}%` }}
                    />
                  </div>
                </div>
                <div className="esm-kpi">
                  <div className="esm-kpi-label">Goles totales</div>
                  <div className="esm-kpi-value">{data.totalGoals}</div>
                </div>
              </div>

              <div className="esm-row--two">
                <div className="esm-card">
                  <div className="esm-card-title">Equipo ganador</div>
                  {data.winningTeam ? (
                    <div className="esm-winnerLine">
                      <span className="esm-pill">{`#${data.winningTeam.id}`}</span>
                      <span className="esm-chip">
                        {data.winningTeam.color ?? "—"}
                      </span>
                    </div>
                  ) : (
                    <div className="esm-muted">Empate o no definido</div>
                  )}
                </div>

                <div className="esm-card">
                  <div className="esm-card-title">MVP</div>
                  {data.mvp ? (
                    <div className="esm-winnerLine">
                      <span className="esm-pill">{`#${data.mvp.id}`}</span>
                      <span className="esm-chip">{data.mvp.name ?? "—"}</span>
                    </div>
                  ) : (
                    <div className="esm-muted">No definido</div>
                  )}
                </div>
              </div>

              <div className="esm-card">
                <div className="esm-card-title">Marcador</div>
                <div className="esm-scores">
                  {data.scores
                    .slice()
                    .sort((a, b) => b.goals - a.goals)
                    .map((s) => (
                      <div
                        key={s.teamId}
                        className={`esm-scoreRow ${
                          s.isWinner ? "is-winner" : ""
                        }`}
                      >
                        <div className="esm-scoreTeam">
                          <span className="esm-pill">{`#${s.teamId}`}</span>
                          <span className="esm-chip">{s.color ?? "—"}</span>
                        </div>
                        <div className="esm-scoreGoals">{s.goals}</div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="esm-card">
                <div className="esm-card-title">Goleadores</div>
                <div className="esm-table">
                  <div className="esm-thead">
                    <div>Pos</div>
                    <div>Jugador</div>
                    <div>Equipo</div>
                    <div>Goles</div>
                  </div>
                  <div className="esm-tbody">
                    {data.scorersRanking.map((r, idx) => (
                      <div key={`${r.player.id}-${idx}`} className="esm-trow">
                        <div>{idx + 1}</div>
                        <div className="esm-playerCell">
                          <span className="esm-pill">{`#${r.player.id}`}</span>
                          <span className="esm-playerName">
                            {r.player.name ?? "Sin nombre"}
                          </span>
                        </div>
                        <div>{r.teamId ?? "—"}</div>
                        <div className="esm-goalsCell">{r.goals}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="esm-card">
                <div className="esm-card-title">Ausentes</div>
                {data.missingPlayers.length === 0 ? (
                  <div className="esm-muted">No hubo ausentes</div>
                ) : (
                  <div className="esm-chips">
                    {data.missingPlayers.map((p) => (
                      <span key={p.id} className="esm-chip">
                        {p.name ?? `#${p.id}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStatsModal;
