import React, { useEffect, useState, useCallback } from "react";
import footballPitch from "../../assets/soccer-pitch.png";
import "../../styles/footballPitch.css";
import {
  getLineups,
  addPlayerToPosition,
  removeFromPosition,
  autoConfigureLineups,
} from "../../api/eventsApi";
import toast from "react-hot-toast";
import type {
  FootballLineup,
  Player,
  Position,
  TeamColor,
} from "../../types/apiTypes";
import { getTeamThemeClass } from "../../pages/event/event-stats/colorUtils";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface FootballPitchProps {
  eventId: number;
  firstTeamColor?: TeamColor;
  secondTeamColor?: TeamColor;
  pitchSize: number;
  canEdit?: boolean;
  pictures: Record<number, string>;
  lastUpdate?: string;
}

interface DragData {
  player: Player;
  fromPosition?: Position;
  lineupId: string | null;
}

const POSITIONS_COORDS: Record<Position, { x: number; y: number }> = {
  GK: { x: 5, y: 50 },
  RB: { x: 30, y: 15 },
  LB: { x: 30, y: 85 },
  CB: { x: 25, y: 50 },
  LIB: { x: 15, y: 50 },
  CM: { x: 50, y: 50 },
  RM: { x: 60, y: 15 },
  LM: { x: 60, y: 85 },
  RW: { x: 80, y: 15 },
  LW: { x: 80, y: 85 },
  ST: { x: 80, y: 50 },
  CT: { x: 70, y: 50 },
};

const FootballPitch: React.FC<FootballPitchProps> = ({
  eventId,
  firstTeamColor,
  secondTeamColor,
  pitchSize,
  canEdit = false,
  pictures,
  lastUpdate,
}) => {
  const [lineups, setLineups] = useState<FootballLineup[]>([]);
  const [draggedPosition, setDraggedPosition] = useState<string | null>(null);
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [isAutoOrganizing, setIsAutoOrganizing] = useState(false);

  const fetchLineups = useCallback(async () => {
    try {
      const data = await getLineups(eventId);
      setLineups(data);
    } catch {
      toast.error("Error al cargar las formaciones");
    }
  }, [eventId]);

  useEffect(() => {
    fetchLineups();
  }, [fetchLineups, lastUpdate]);

  const handleAutoOrganize = async () => {
    if (!canEdit) return;
    setIsAutoOrganizing(true);
    const toastId = toast.loading("Calculando mejor formación...");

    try {
      const updatedLineups = await autoConfigureLineups(eventId);
      setLineups(updatedLineups);
      toast.success("¡Táctica aplicada!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error al organizar", { id: toastId });
    } finally {
      setIsAutoOrganizing(false);
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    player: Player,
    fromPosition?: Position
  ) => {
    if (!canEdit) return;

    const newDragData: DragData = {
      player,
      fromPosition,
      lineupId: e.currentTarget.getAttribute("data-lineup-id"),
    };

    setDragData(newDragData);
    setDraggedPosition(fromPosition || "BENCH");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(newDragData));

    const target = e.target as HTMLElement;
    target.classList.add("is-dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove("is-dragging");
    setDraggedPosition(null);
    setDragData(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("drag-over");
  };

  const handleDropOnPosition = async (
    e: React.DragEvent,
    targetPosition: Position,
    lineupId: number
  ) => {
    if (!canEdit || !dragData) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    target.classList.remove("drag-over");

    if (Number(dragData.lineupId) !== lineupId) {
      toast.error("No puedes mover un jugador al equipo contrario");
      return;
    }

    try {
      const { player, fromPosition } = dragData;
      const currentLineup = lineups.find((l) => l.id === lineupId);
      if (!currentLineup) return;

      const playersInField = Object.keys(
        currentLineup.positionsByPlayer
      ).length;
      const isTargetOccupied =
        !!currentLineup.positionsByPlayer[targetPosition];

      if (!fromPosition && playersInField >= pitchSize && !isTargetOccupied) {
        toast.error(`Máximo ${pitchSize} jugadores en cancha`);
        return;
      }

      if (isTargetOccupied) {
        await removeFromPosition(lineupId, targetPosition);
      }

      if (fromPosition) {
        await removeFromPosition(lineupId, fromPosition);
      }

      await addPlayerToPosition(lineupId, targetPosition, player.id);
      await fetchLineups();
    } catch {
      toast.error("Error al mover el jugador");
    }
  };

  const handleDropOnBench = async (e: React.DragEvent, lineupId: number) => {
    if (!canEdit || !dragData) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("drag-over");

    if (dragData.fromPosition && Number(dragData.lineupId) === lineupId) {
      try {
        await removeFromPosition(lineupId, dragData.fromPosition);
        await fetchLineups();
      } catch {
        toast.error("Error al enviar al banco");
      }
    }
  };

  const renderPlayerCircle = (
    player: Player,
    lineupId: number,
    teamThemeClass: string,
    position?: Position,
    style?: React.CSSProperties
  ) => {
    const photoUrl = player.user?.id ? pictures[player.user.id] : undefined;
    const hasPhoto = !!photoUrl;

    return (
      <div
        key={player.id}
        className={`player-token ${teamThemeClass} ${
          hasPhoto ? "has-photo" : ""
        } ${canEdit ? "draggable" : ""}`}
        draggable={canEdit}
        data-lineup-id={lineupId}
        onDragStart={(e) => handleDragStart(e, player, position)}
        onDragEnd={handleDragEnd}
        style={{
          ...style,
          backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
        }}
      >
        <span className="player-token-name">{player.name}</span>
      </div>
    );
  };

  const renderFieldSide = (
    lineup: FootballLineup,
    isLeft: boolean,
    color: TeamColor
  ) => {
    const themeClass = getTeamThemeClass(color);
    const elements: React.JSX.Element[] = [];

    Object.entries(POSITIONS_COORDS).forEach(([posKey, coords]) => {
      const position = posKey as Position;
      const leftPercent = isLeft ? coords.x : 100 - coords.x;
      const topPercent = coords.y;
      const player = lineup.positionsByPlayer[position];

      elements.push(
        <div
          key={`pos-${position}-${lineup.id}`}
          className={`position-slot ${draggedPosition ? "active-zone" : ""}`}
          style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDropOnPosition(e, position, lineup.id)}
        >
          {player
            ? renderPlayerCircle(player, lineup.id, themeClass, position)
            : canEdit && (
                <div className="empty-position-marker">{position}</div>
              )}
        </div>
      );
    });

    return (
      <div
        className={`field-side-layer ${isLeft ? "field-left" : "field-right"}`}
      >
        {elements}
      </div>
    );
  };

  const renderBenchSide = (lineup: FootballLineup, color: TeamColor) => {
    const themeClass = getTeamThemeClass(color);

    const benchElements = lineup.bench.map((player) => {
      return renderPlayerCircle(player, lineup.id, themeClass, undefined, {
        position: "relative",
        margin: "4px",
      });
    });

    return (
      <div
        className={`bench-outside-area ${themeClass}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDropOnBench(e, lineup.id)}
      >
        <div className="bench-title">Suplentes</div>
        <div className="bench-grid">{benchElements}</div>
      </div>
    );
  };

  const showComponent =
    lineups.length >= 2 && firstTeamColor && secondTeamColor;

  return (
    <div className="football-pitch-wrapper">
      {canEdit && (
        <div className="pitch-actions-overlay">
          <button
            className="btn-auto-tactics"
            onClick={handleAutoOrganize}
            disabled={isAutoOrganizing}
            title="Organizar automáticamente basado en habilidad y posición favorita"
          >
            <AutoAwesomeIcon
              fontSize="small"
              className={isAutoOrganizing ? "spin" : ""}
            />
            <span>{isAutoOrganizing ? "Calculando..." : "Auto organizar"}</span>
          </button>
        </div>
      )}

      {showComponent && (
        <div className="football-pitch-layout">
          {renderBenchSide(lineups[0], firstTeamColor!)}

          <div className="pitch-center-wrapper">
            <div className="pitch-background">
              <img src={footballPitch} alt="Cancha" />
            </div>
            <div className="field-players-overlay">
              {renderFieldSide(lineups[0], true, firstTeamColor!)}
              {renderFieldSide(lineups[1], false, secondTeamColor!)}
            </div>
          </div>

          {renderBenchSide(lineups[1], secondTeamColor!)}
        </div>
      )}
    </div>
  );
};

export default FootballPitch;
