import React, { useMemo } from "react";
import { useAuth } from "../../auth/useAuth";
import FootballPitch from "../components/FootballPitch";
import AddPlayerButton from "../components/AddPlayerButton";
import type { FootballEvent } from "../../types/apiTypes";
import { COLOR_MAPPER } from "../../constants/events";
import { PlayerList } from "../../pages/event/commons/PlayerList";
import EventFairnessRatingComponent from "../../pages/event/commons/EventFairnessRatingComponent";

interface Props {
  event: FootballEvent;
  pictures: Record<number, string>;
  onEventUpdate: (updated: FootballEvent) => void;
  onBalanceComplete: () => void;
}

const FootballEventDetails: React.FC<Props> = ({
  event,
  pictures,
  onEventUpdate,
  onBalanceComplete,
}) => {
  const { user, isOrganizer } = useAuth();
  const canEdit =
    !event.isFinished && isOrganizer && user?.id === event.organizer?.id;

  const pitchKey = useMemo(() => {
    const ids = event.teams.map((p) => p.id);
    return ids.join("-");
  }, [event.teams]);

  const isUserInEvent = useMemo(() => {
    if (!user) return false;
    const inUnassigned = event.unnasignedPlayers.some(
      (p) => p.user?.id === user.id
    );
    const inTeams = event.teams.some((t) =>
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
          {event.teams.map((team) => {
            const isUserInThisTeam = team.players.some(
              (p) => p.user?.id === user?.id
            );
            const isDisabled = isUserInThisTeam || !isUserInEvent;

            return (
              <div
                key={team?.id}
                className="event-page-team-card"
                data-color={team?.color}
              >
                <h4>Equipo {COLOR_MAPPER[team!.color]}</h4>
                <AddPlayerButton
                  eventId={event.id}
                  teamId={team?.id}
                  onPlayerAdded={onEventUpdate}
                  disabled={isDisabled}
                />
                <PlayerList players={team?.players} />
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
            teams={event.teams}
            onBalanceComplete={onBalanceComplete}
            canBalance={canEdit}
          />
        </div>

        <div className="event-page-section no-team-players">
          <h3>Jugadores sin equipo</h3>
          <PlayerList players={event.unnasignedPlayers} />
        </div>
      </div>

      {}
      <div className="event-page-section">
        <h3>Distribución táctica</h3>
        <FootballPitch
          key={pitchKey}
          eventId={event.id}
          firstTeamColor={event.teams[0].color}
          secondTeamColor={event.teams[1].color}
          pitchSize={Number(event.pitchSize)}
          canEdit={canEdit}
          pictures={pictures}
        />
      </div>
    </>
  );
};

export default FootballEventDetails;
