import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "./EventStatsModal.css";
import { getEventStats } from "../../../../api/eventsApi";
import type { EventStats } from "../../../../types/events";
import { Chip } from "./Chip";
import { Muted } from "./Muted";
import { CardSection } from "./CardSection";
import { Pill } from "./Pill";
import { WinnerLine } from "./WinnerLine";
import { KpiCard } from "./KpiCard";

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
    <div className="esm-backdrop" role="none" onClick={onClose}>
      <dialog
        className="esm-modal"
        aria-modal="true"
        aria-labelledby="stats-title"
        aria-describedby="stats-content"
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

        <div className="esm-body" id="stats-content">
          {loading && <div className="esm-loading">Cargando estadísticas…</div>}

          {!loading && data && (
            <>
              <div className="esm-kpis-grid">
                <KpiCard label="Registrados" value={data.totalRegisteredPlayers} />
                <KpiCard label="Presentes" value={data.presentPlayers} />
                <KpiCard label="Ausentes" value={data.absentPlayers} />
                <KpiCard label="Asistencia" value={`${attendancePct}%`} progressPercent={attendancePct} />
                <KpiCard label="Goles totales" value={data.totalGoals} />
              </div>

              <div className="esm-row--two">
                <CardSection title="Equipo ganador">
                  {data.winningTeam ? (
                    <WinnerLine idLabel={`#${data.winningTeam.id}`} textLabel={data.winningTeam.color ?? "—"} />
                  ) : (
                    <Muted>No definido o empate</Muted>
                  )}
                </CardSection>

                <CardSection title="MVP">
                  {data.mvp ? (
                    <WinnerLine idLabel={`#${data.mvp.id}`} textLabel={data.mvp.name ?? "—"} />
                  ) : (
                    <Muted>No definido</Muted>
                  )}
                </CardSection>
              </div>

              <CardSection title="Marcador">
                <div className="esm-scores">
                  {[...data.scores]
                    .sort((scoreA, scoreB) => scoreB.goals - scoreA.goals)
                    .map((score) => (
                      <div key={score.teamId} className={`esm-scoreRow ${score.isWinner ? "is-winner" : ""}`}>
                        <div className="esm-scoreTeam">
                          <Pill>{`#${score.teamId}`}</Pill>
                          <Chip>{score.color}</Chip>
                        </div>
                        <div className="esm-scoreGoals">{score.goals}</div>
                      </div>
                    ))}
                </div>
              </CardSection>

              <CardSection title="Goleadores">
                <div className="esm-table">
                  <div className="esm-thead">
                    <div>Pos</div>
                    <div>Jugador</div>
                    <div>Equipo</div>
                    <div>Goles</div>
                  </div>
                  <div className="esm-tbody">
                    {data.scorersRanking.map((row, index) => (
                      <div key={`${row.player.id}-${index}`} className="esm-trow">
                        <div>{index + 1}</div>
                        <div className="esm-playerCell">
                          <Pill>{`#${row.player.id}`}</Pill>
                          <span className="esm-playerName">{row.player.name}</span>
                        </div>
                        <div>{row.teamId ?? "—"}</div>
                        <div className="esm-goalsCell">{row.goals}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardSection>

              <CardSection title="Ausentes">
                {data.missingPlayers.length === 0 ? (
                  <Muted>No hubo ausentes</Muted>
                ) : (
                  <div className="esm-chips">
                    {data.missingPlayers.map((missingPlayer) => (
                      <Chip key={missingPlayer.id}>{missingPlayer.name}</Chip>
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
