import React, { useEffect, useState } from 'react';
import footballPitch from '../assets/footballpitch.png';
import type {Lineup, PlayerInfo, Position} from '../types/events';
import '../styles/footballPitch.css';
import { getLineups, addPlayerToPosition, removeFromPosition } from '../api/eventsApi';

interface FootballPitchProps {
  eventId: number;
  firstTeamColor: string;
  secondTeamColor: string;
}

const FootballPitch: React.FC<FootballPitchProps> = ({
  eventId,
  firstTeamColor,
  secondTeamColor
}) => {
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [draggedPosition, setDraggedPosition] = useState<string | null>(null);

  const fetchLineups = async () => {
    try {
      const data = await getLineups(eventId);
      setLineups(data);
    } catch (error) {
      console.error('Error fetching lineups:', error);
    }
  };

  useEffect(() => {
    fetchLineups();
  }, [eventId]);

  // Definir las posiciones fijas para cada rol
  const positions: Record<Position, { x: number, y: number }> = {
    'GK': { x: 10, y: 50 },
    'RB': { x: 30, y: 30 },
    'LB': { x: 30, y: 70 },
    'CB': { x: 30, y: 50 },
    'CM': { x: 50, y: 50 },
    'RM': { x: 50, y: 30 },
    'LM': { x: 50, y: 70 },
    'RW': { x: 70, y: 30 },
    'LW': { x: 70, y: 70 },
    'CT': { x: 50, y: 50 },
    'ST': { x: 70, y: 50 }
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
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      player,
      fromPosition,
      lineupId: e.currentTarget.getAttribute('data-lineup-id')
    }));
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
    setDraggedPosition(null);
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

    const target = e.target as HTMLElement;
    if (target.classList.contains('position-dropzone')) {
      target.classList.remove('drag-over');
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { player, fromPosition, lineupId: fromLineupId } = data;

      // Si hay un jugador en la posición destino, lo removemos primero
      const playerInPosition: PlayerInfo | null = lineups.find(l => l.id === lineupId)?.positionsByPlayer.get(position) || null;

      if (playerInPosition) {
        await removeFromPosition(eventId, lineupId, position);
      }

      // Si el jugador venía de otra posición, lo removemos de ahí
      if (fromPosition) {
        await removeFromPosition(eventId, Number(fromLineupId), fromPosition as Position);
      }

      // Agregamos el jugador a la nueva posición
      await addPlayerToPosition(eventId, lineupId, position, player.user.id);

      // Actualizamos los lineups
      await fetchLineups();
    } catch (error) {
      console.error('Error updating player position:', error);
    }
  };

  const renderTeam = (lineup: Lineup, isFirstTeam: boolean, teamColor: string) => {
    const players: React.JSX.Element[] = [];

    // Renderizar posiciones vacías y jugadores en posiciones
    Object.entries(positions).forEach(([position, pos]) => {
      const xPos = isFirstTeam ? pos.x : 100 - pos.x;
      const playerInPosition: PlayerInfo | null = lineup.positionsByPlayer[position]|| null;

      // Si hay un jugador en la posición, lo mostramos
      if (playerInPosition) {
        const player = playerInPosition;
        players.push(
          <div
            key={player.user.username + position}
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

    // Renderizar jugadores en el banco
    lineup.bench.forEach((player, index) => {
      players.push(
        <div
          key={player.user.username + 'bench'}
          className="player bench-player"
          draggable
          data-lineup-id={lineup.id}
          onDragStart={(e) => handleDragStart(e, player)}
          onDragEnd={handleDragEnd}
          style={{
            bottom: '5%',
            left: `${10 + (index * 15)}%`,
            backgroundColor: getPlayerColor(teamColor),
            borderColor: '#cccccc',
            cursor: 'grab'
          }}
        >
          <div className="player-name">
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
