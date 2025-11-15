import type { Player } from "../../../types/apiTypes";

interface PlayerListProps {
  players?: Player[];
}

export const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <ul className="event-page-players-list">
      {players?.map((player) => (
        <li key={player?.user?.username}>{player.name}</li>
      ))}
    </ul>
  );
};
