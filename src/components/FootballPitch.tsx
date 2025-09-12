import React from 'react';
import footballPitch from '../assets/footballpitch.png';
import type { PlayerInfo } from '../types/events';
import '../styles/footballPitch.css';

interface FootballPitchProps {
  firstTeamPlayers: PlayerInfo[];
  secondTeamPlayers: PlayerInfo[];
  firstTeamColor: string;
  secondTeamColor: string;
}

const FootballPitch: React.FC<FootballPitchProps> = ({
  firstTeamPlayers,
  secondTeamPlayers,
  firstTeamColor,
  secondTeamColor
}) => {
  // Definir las posiciones fijas para cada rol con etiquetas de posición
  const positions = {
    goalkeeper: { x: 10, y: 50, label: 'Arquero' },
    defender: { x: 30, y: 50, label: 'Defensor' },
    midfielder: { x: 50, y: 50, label: 'Mediocampista' },
    forward: { x: 70, y: 50, label: 'Delantero' },
  };

  // Función para asignar jugadores a posiciones
  const assignPositions = (players: PlayerInfo[]) => {
    return players.map((player, index) => {
      let position;
      switch (index) {
        case 0:
          position = { ...positions.goalkeeper, label: positions.goalkeeper.label };
          break;
        case 1:
          position = { ...positions.defender, y: 30, label: positions.defender.label };
          break;
        case 2:
          position = { ...positions.defender, y: 70, label: positions.defender.label };
          break;
        case 3:
          position = { ...positions.midfielder, y: 30, label: positions.midfielder.label };
          break;
        case 4:
          position = { ...positions.midfielder, y: 70, label: positions.midfielder.label };
          break;
        case 5:
        default:
          position = { ...positions.forward, y: 50, label: positions.forward.label };
          break;
      }
      return { ...player, position };
    });
  };

  const firstTeamWithPositions = assignPositions(firstTeamPlayers);
  const secondTeamWithPositions = assignPositions(secondTeamPlayers);

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

  return (
    <div className="football-pitch-container">
      <img src={footballPitch} alt="Football Pitch" className="football-pitch" />
      <div className="players-container">
        <div className="team-pitch first-team">
          {firstTeamWithPositions.map((player) => (
            <div
              key={player.user.username}
              className="player"
              style={{
                top: `${player.position.y}%`,
                left: `${player.position.x}%`,
                backgroundColor: getPlayerColor(firstTeamColor),
                borderColor: '#cccccc'
              }}
            >
              <div className="player-name">
                {player.name}
                <br />
                <small>{player.position.label}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="team-pitch second-team">
          {secondTeamWithPositions.map((player) => (
            <div
              key={player.user.username}
              className="player"
              style={{
                top: `${player.position.y}%`,
                left: `${100 - player.position.x}%`,
                backgroundColor: getPlayerColor(secondTeamColor),
                borderColor: '#cccccc'
              }}
            >
              <div className="player-name">
                {player.name}
                <br />
                <small>{player.position.label}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FootballPitch;
