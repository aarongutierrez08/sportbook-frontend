import React, { useMemo } from "react";
import { useAuth } from "../../auth/useAuth";
import AddPlayerButton from "../components/AddPlayerButton";
import type { PaddleEvent, VolleyEvent } from "../../types/apiTypes";
import { COLOR_MAPPER } from "../../constants/events";
import { PlayerList } from "../../pages/event/commons/PlayerList";
import EventFairnessRatingComponent from "../../pages/event/commons/EventFairnessRatingComponent";

interface Props {
  event: PaddleEvent;
  onEventUpdate: (updated: PaddleEvent | VolleyEvent) => void;
  onBalanceComplete: () => void;
}

const PaddleEventDetails: React.FC<Props> = ({
  event,
  onEventUpdate,
  onBalanceComplete,
}) => {
  const { user } = useAuth();
  const canEdit =
    !event.isFinished &&
    user?.role === "ORGANIZER" &&
    user?.id === event.organizer?.id;

  const isUserInEvent = useMemo(() => {
    if (!user) return false;
    const inUnassigned = event.unnasignedPlayers.some(
      (p) => p.user?.id === user.id
    );
    const inTeams = event.teams?.some((t) =>
      t.players.some((p) => p.user?.id === user.id)
    );
    return inUnassigned || inTeams;
  }, [event, user]);

  return (
    <>
      {}
      <div className="event-page-section full-width-teams-section">
        <h3>Equipos</h3>
        <div className="event-page-team-section">
          {event.teams?.map((team) => {
            const isUserInThisTeam = team.players.some(
              (p) => p.user?.id === user?.id
            );

            const maxPerTeam = Math.ceil(event.maxPlayers / 2);
            const isTeamFull = team.players.length >= maxPerTeam;

            const isDisabled = isUserInThisTeam || !isUserInEvent || isTeamFull;

            return (
              <div
                key={team.id}
                className="event-page-team-card"
                data-color={team.color}
              >
                <h4>Equipo {COLOR_MAPPER[team!.color]}</h4>
                <AddPlayerButton
                  eventId={event.id}
                  teamId={team.id}
                  onPlayerAdded={onEventUpdate}
                  disabled={isDisabled}
                />
                <PlayerList players={team.players!} />
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="secondary-details-grid">
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
          <PlayerList players={event.unnasignedPlayers} />
        </div>
      </div>
    </>
  );
};

export default PaddleEventDetails;
