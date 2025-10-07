import React, { useEffect, useState, useCallback } from 'react';
import footballPitch from '../../assets/soccer-pitch.png';
import type {Lineup, PlayerInfo, Position} from '../../types/events';
import '../../styles/footballPitch.css';
import { getLineups, addPlayerToPosition, removeFromPosition } from '../../api/eventsApi';
import toast from 'react-hot-toast';

interface FootballPitchProps {
  eventId: number;
  firstTeamColor: string;
  secondTeamColor: string;
  pitchSize: number;
}

// Definimos un tipo para los datos del drag & drop
interface DragData {
  player: PlayerInfo;
  fromPosition?: Position;
  lineupId: string | null;
}

const FootballPitch: React.FC<FootballPitchProps> = ({
  eventId,
  firstTeamColor,
  secondTeamColor,
  pitchSize
}) => {
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [draggedPosition, setDraggedPosition] = useState<string | null>(null);
  const [dragData, setDragData] = useState<DragData | null>(null);

  const fetchLineups = useCallback(async () => {
    try {
      const data = await getLineups(eventId);
      setLineups(data);
    } catch (error) {
      console.error('Error fetching lineups:', error);
    }
  }, [eventId]);

  useEffect(() => {
    fetchLineups();
  }, [fetchLineups]);

  // Definir las posiciones fijas para cada rol
  const positions: Record<Position, { x: number, y: number }> = {
    'GK': { x: 10, y: 50 },
    'RB': { x: 30, y: 20 },
    'LB': { x: 30, y: 80 },
    'CB': { x: 30, y: 60 },
    'LIB': { x: 20, y: 40 },
    'CM': { x: 50, y: 50 },
    'RM': { x: 50, y: 25 },
    'LM': { x: 50, y: 75 },
    'RW': { x: 75, y: 25 },
    'LW': { x: 75, y: 75 },
    'ST': { x: 60, y: 50 },
    'CT': { x: 80, y: 50 }
  };

  const getPlayerColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Rojo': '#ff4444',
      'Azul': '#4444ff',
      'Verde': '#44ff44',
      'Negro': '#000000',
      'Blanco': '#cccccc'
    };
    return colorMap[color] || colorMap['Blanco'];
  };

  const handleDragStart = (e: React.DragEvent, player: PlayerInfo, fromPosition?: Position) => {
    const newDragData: DragData = {
      player,
      fromPosition,
      lineupId: e.currentTarget.getAttribute('data-lineup-id')
    };

    setDragData(newDragData);

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'player-drag');

    if (fromPosition) {
      setDraggedPosition(fromPosition);
    }

    const target = e.target as HTMLElement;
    if (target) {
      target.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (target) {
      target.style.opacity = '1';
    }

    // Si el jugador se soltó fuera de una zona válida y venía de una posición
    if (dragData?.fromPosition && dragData.lineupId) {
      removeFromPosition(Number(dragData.lineupId), dragData.fromPosition)
        .then(() => {
          fetchLineups();
        })
        .catch((error) => {
          console.error('Error moving player to bench:', error);
        });
    }

    setDraggedPosition(null);
    setDragData(null);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('position-dropzone')) {
      target.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('position-dropzone')) {
      target.classList.remove('drag-over');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, position: Position, lineupId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    if (target.classList.contains('position-dropzone')) {
      target.classList.remove('drag-over');
    }

    try {
      if (!dragData) return;

      const { player, fromPosition, lineupId: fromLineupId } = dragData;
      setDragData(null);

      // Validamos que no se exceda el límite de jugadores en cancha según pitchSize
      const currentLineup = lineups.find(l => l.id === lineupId);
      if (!currentLineup) return;

      // Contamos los jugadores actuales en cancha (excluyendo al que está en la posición destino si hay uno)
      const playersInField = Object.values(currentLineup.positionsByPlayer).length;

      // Si el jugador no viene de otra posición en cancha y ya hay pitchSize jugadores, no permitimos agregar más
      if (!fromPosition && playersInField >= pitchSize) {
        toast.error(`No puedes poner más de ${pitchSize} jugadores en cancha`);
        return;
      }

      // Si hay un jugador en la posición destino, lo removemos primero
      const playerInPosition = currentLineup.positionsByPlayer[position];
      if (playerInPosition) {
        await removeFromPosition(lineupId, position);
      }

      // Si el jugador venía de otra posición, lo removemos de ahí
      if (fromPosition && fromLineupId) {
        await removeFromPosition(Number(fromLineupId), fromPosition);
      }

      // Agregamos el jugador a la nueva posición
      await addPlayerToPosition(lineupId, position, player.id);

      // Actualizamos los lineups
      await fetchLineups();
    } catch (error) {
      console.error('Error updating player position:', error);
      toast.error('Error al actualizar la posición del jugador');
    }
  };

  const renderTeam = (lineup: Lineup, isFirstTeam: boolean, teamColor: string) => {
    const players: React.JSX.Element[] = [];

    // Renderizar posiciones vacías y jugadores en posiciones
    Object.entries(positions).forEach(([position, pos]) => {
      const xPos = isFirstTeam ? pos.x : 100 - pos.x;
      const playerInPosition = lineup.positionsByPlayer[position as Position];

      // Si hay un jugador en la posición, lo mostramos
      if (playerInPosition) {
        const player = playerInPosition;
        players.push(
          <div
            key={player.user?.username + position}
            className="player"
            draggable
            data-lineup-id={lineup.id}
            onDragStart={(e) => handleDragStart(e, player, position as Position)}
            onDragEnd={handleDragEnd}
            style={{
              top: `${pos.y}%`,
              left: `${xPos}%`,
              backgroundColor: getPlayerColor(teamColor),
              borderColor: '#cccccc',
              cursor: 'grab'
            }}
          >
            <div className="player-name">
              {player.name}
              <br />
              <small>{position}</small>
            </div>
          </div>
        );
      }

      // Siempre mostramos la zona para soltar
      players.push(
        <div
          key={`dropzone-${position}`}
          className={`position-dropzone ${draggedPosition === position ? 'drag-over' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, position as Position, lineup.id)}
          style={{
            top: `${pos.y}%`,
            left: `${xPos}%`,
          }}
        >
          <div className="position-label">{position}</div>
        </div>
      );
    });

    // Renderizar jugadores en el banco según el equipo
    lineup.bench.forEach((player, index) => {
      const VERTICAL_SPACING = 10; // Espaciado vertical entre jugadores
      const PLAYERS_ON_SIDE = 7; // Máximo de jugadores en el lateral antes de pasar abajo
      const HORIZONTAL_SPACING = 10; // Espaciado horizontal para los jugadores de abajo

      let benchPosition;

      if (index < PLAYERS_ON_SIDE) {
        // Primeros jugadores van en el lateral
        benchPosition = isFirstTeam ?
          {
            left: '-15%',
            top: `${10 + (index * VERTICAL_SPACING)}%`
          } :
          {
            right: '-15%',
            top: `${10 + (index * VERTICAL_SPACING)}%`
          };
      } else {
        // Los demás jugadores van abajo, distribuidos desde su lado correspondiente
        const bottomIndex = index - PLAYERS_ON_SIDE;
        benchPosition = isFirstTeam ?
          {
            left: `${10 + (bottomIndex * HORIZONTAL_SPACING)}%`,
            bottom: '-15%'
          } :
          {
            right: `${10 + (bottomIndex * HORIZONTAL_SPACING)}%`,
            bottom: '-15%'
          };
      }

      players.push(
        <div
          key={player.user?.username + 'bench'}
          className="player bench-player"
          draggable
          data-lineup-id={lineup.id}
          onDragStart={(e) => handleDragStart(e, player)}
          onDragEnd={handleDragEnd}
          style={{
            ...benchPosition,
            position: 'absolute',
            backgroundColor: getPlayerColor(teamColor),
            borderColor: '#cccccc',
            cursor: 'grab',
            zIndex: 1000
          }}
        >
          <div className={`player-name ${isFirstTeam ? 'left-side' : 'right-side'}`}>
            {player.name}
            <br />
            <small>Suplente</small>
          </div>
        </div>
      );
    });

    return players;
  };

  return (
    <div className="football-pitch-container">
      <img src={footballPitch} alt="Football Pitch" className="football-pitch" />
      <div className="players-container">
        {lineups.length >= 2 && (
          <>
            <div className="team-pitch first-team">
              {renderTeam(lineups[0], true, firstTeamColor)}
            </div>
            <div className="team-pitch second-team">
              {renderTeam(lineups[1], false, secondTeamColor)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FootballPitch;
