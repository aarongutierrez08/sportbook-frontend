import { useMemo } from "react";
import type { SportEvent } from "../../../types/events";
import type { Sport, SportUser } from "../../../types/user";
import { formatDate } from "../../../utils/events";
import { AmountText } from "../AmountText";

interface EventCardProps {
  event: SportEvent;
  loggedUser: SportUser | null;
  onDetails: (id: number) => void;
};

const SPORT_NAME_DICTIONARY: Record<Sport, string> = {
  FOOTBALL: 'Fútbol',
  PADDLE: 'Pádel',
  VOLLEY: 'Vóley',
}

const isUserInEvent = (
  event: SportEvent,
  loggedUser: SportUser | null
): boolean =>
  !!loggedUser &&
  event.players.some((p) => p?.user?.username === loggedUser.username);

const EventCard: React.FC<EventCardProps> = ({ event, loggedUser, onDetails }) => {
  const userInEvent = useMemo(
    () => isUserInEvent(event, loggedUser),
    [event, loggedUser]
  );

  return (
    <article
      className="card"
      aria-labelledby={`event-title-${event.id}`}
    >
      {event.isFinished && (
        <div className="event-status">Evento Finalizado</div>
      )}

      <div className="card-header">
        <div id={`event-title-${event.id}`} className="sport">
          {SPORT_NAME_DICTIONARY[event.sport]}
        </div>
        {!event.isFinished && (
          <div className="date">{formatDate(event.dateTime)}</div>
        )}
      </div>

      <div className="players" aria-label="Jugadores">
        👥 Jugadores: {event.players.length} / {event.minPlayers}
      </div>

      <div className="cost" aria-label="Costo">
        💵 Costo: <AmountText number={event.cost} />
      </div>

      <div className="footer">
        Organizador: {event.organizer?.name}
        <br />
        Lugar: {event.location.placeName}
        <br />
        Alias: {event.transferData?.alias ?? "—"}
        <br />
        CBU: {event.transferData?.cbu ?? "—"}
      </div>

      {!event.isFinished && userInEvent && (
        <div className="joined" aria-live="polite">
          ¡Ya sos parte de este evento!
        </div>
      )}

      <div className="buttons-container">
        <button
          className="btn btn--block btn--secondary"
          onClick={() => onDetails(event.id)}
        >
          Ver detalles
        </button>
      </div>
    </article>
  );
};

export default EventCard;
