import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FootballPosition } from '../../types/user';
import '../../styles/footballPitch.css';
import '../../styles/footballPositionSelector.css';

interface PositionButtonProps {
  position: FootballPosition;
  x: number;
  y: number;
  isSelected: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteClick: () => void;
}

const PositionButton: React.FC<PositionButtonProps> = ({ position, x, y, isSelected, isFavorite, onClick, onFavoriteClick }) => {
  return (
    <div
      className={`position-button ${isSelected ? 'selected' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
    >
      <div className="position-label">{position}</div>
      <button
        className={`favorite-star ${isFavorite ? 'favorite' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
      >
        ★
      </button>
    </div>
  );
};

const positionCoords: Record<FootballPosition, { x: number; y: number }> = {
  'ST': { x: 50, y: 20 },
  'LW': { x: 25, y: 20 },
  'RW': { x: 75, y: 20 },
  'CAM': { x: 50, y: 35 },
  'CM': { x: 50, y: 50 },
  'CDM': { x: 50, y: 65 },
  'LM': { x: 25, y: 50 },
  'RM': { x: 75, y: 50 },
  'LB': { x: 25, y: 80 },
  'RB': { x: 75, y: 80 },
  'CB': { x: 40, y: 80 },
  'LIB': { x: 60, y: 80 },
  'GK': { x: 50, y: 90 }
};

export const FootballPositionSelector: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const positions = watch('positions') as FootballPosition[];
  const favoritePosition = watch('favoritePosition') as FootballPosition;

  const handlePositionClick = (newPosition: FootballPosition) => {
    const newPositions = positions.includes(newPosition)
      ? positions.filter(position => position !== newPosition)
      : [...positions, newPosition];
    setValue('positions', newPositions);
  };

  const handleFavoriteClick = (position: FootballPosition) => {
    if (!positions.includes(position)) {
      setValue('positions', [...positions, position]);
    }
    setValue('favoritePosition', position);
  };

  return (
    <div className="football-position-selector">
      <div className="position-selector-pitch-container">
        <div className="position-selector-pitch">
          {Object.entries(positionCoords).map(([pos, coords]) => (
            <PositionButton
              key={pos}
              position={pos as FootballPosition}
              x={coords.x}
              y={coords.y}
              isSelected={positions.includes(pos as FootballPosition)}
              isFavorite={favoritePosition === pos}
              onClick={() => handlePositionClick(pos as FootballPosition)}
              onFavoriteClick={() => handleFavoriteClick(pos as FootballPosition)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
