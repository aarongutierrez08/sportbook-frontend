import React from "react";
import { useAuth } from "../../../auth/useAuth";
import AddPlayerButton from "../AddPlayerButton";
import AddTeamButton from "../AddTeamButton";
import RemoveTeamButton from "../RemoveTeamButton";
import { PlayerList } from "../../../pages/EventPage/components/PlayerList";
import EventFairnessRatingComponent from "../../../pages/EventPage/components/EventFairnessRatingComponent";
import type { PaddleEvent, VolleyEvent } from "../../../types/apiTypes";

interface Props {
  event: VolleyEvent;
  onEventUpdate: (updated: VolleyEvent | PaddleEvent) => void;
  onBalanceComplete: () => void;
}

const VolleyEventDetails: React.FC<Props> = ({
  event,
  onEventUpdate,
  onBalanceComplete,
}) => {
  const { user } = useAuth();
  const canEdit =
    !event.isFinished &&
    user?.role === "ORGANIZER" &&
    user?.id === event.organizer?.id;

  return (
    <>
      <div className="team-and-stats-section">
        <div className="event-page-section">
          <h3>Equipos</h3>
          <div className="event-page-team-section">
            {event.teams?.map((team) => (
              <div
                key={team.id}
                className="event-page-team-card"
                data-color={team.color}
              >
                <h4>Equipo {team.color}</h4>
                <AddPlayerButton
                  eventId={event.id}
                  teamId={team.id}
                  onPlayerAdded={onEventUpdate}
                  disabled={
                    team.players!.length >= event.maxPlayers ||
                    team.players.some((player) => player.user?.id === user?.id)
                  }
                />
                <PlayerList players={team.players!} />
                {canEdit && (
                  <RemoveTeamButton
                    team={team}
                    event={event}
                    onTeamAdded={onEventUpdate}
                    disabled={!canEdit}
                  />
                )}
              </div>
            ))}
          </div>
          {canEdit && (
            <AddTeamButton
              event={event}
              onTeamAdded={onEventUpdate}
              disabled={!canEdit}
            />
          )}
        </div>

        <div className="balance-and-players-column">
          <div className="event-page-section">
            <h3>Balance</h3>
            <EventFairnessRatingComponent
              eventId={event.id}
              teams={event.teams!}
              onBalanceComplete={onBalanceComplete}
              canBalance={canEdit}
            />
          </div>
          <div className="event-page-section no-team-players">
            <h3>Jugadores sin equipo</h3>
            <PlayerList
              players={event.unnasignedPlayers.filter(
                (p) =>
                  !event.teams?.some((t) =>
                    t.players?.some((tp) => tp.id === p.id)
                  )
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VolleyEventDetails;
