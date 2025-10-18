import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { PaddleProfileDTO } from '../../../types/user'
import '../../../styles/paddlePositionSelector.css';

interface PositionButtonProps {
  position: string;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
}

const PositionButton: React.FC<PositionButtonProps> = ({ position, x, y, isSelected, onClick }) => {
  return (
    <div
      className={`paddle-position-button ${isSelected ? 'selected' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
    >
      {position}
    </div>
  );
};

const positionCoords = {
  'DRIVE': { x: 75, y: 50 },
  'REVES': { x: 25, y: 50 }
};

export const PaddlePositionSelector: React.FC = () => {
  const { setValue, watch } = useFormContext<PaddleProfileDTO>();
  const selectedSide = watch('preferredSide');

  const handlePositionClick = (newPosition: string) => {
    setValue('preferredSide', newPosition as "DRIVE" | "REVES");
  };

  return (
    <div className="paddle-position-selector">
      <h2> Posicion Favorita </h2>
      <div className="paddle-position-selector-pitch-container">
        <div className="paddle-position-selector-pitch">
          {Object.entries(positionCoords).map(([pos, coords]) => (
            <PositionButton
              key={pos}
              position={pos}
              x={coords.x}
              y={coords.y}
              isSelected={selectedSide === pos}
              onClick={() => handlePositionClick(pos)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
