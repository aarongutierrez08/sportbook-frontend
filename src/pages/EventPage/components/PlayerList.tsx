import type { PlayerInfo } from "../../../../types/events";

interface PlayerListProps {
  players: PlayerInfo[];
}

export const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <ul className="event-page-players-list">
      {players.map((player) => (
        <li key={player?.user?.username}>{player.name}</li>
      ))}
    </ul>
  );
};
