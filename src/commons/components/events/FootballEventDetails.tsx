import React, { useMemo } from "react";
import { useAuth } from "../../../auth/useAuth";
import FootballPitch from "../FootballPitch";
import AddPlayerButton from "../AddPlayerButton";
import { PlayerList } from "../../../pages/EventPage/components/PlayerList";
import EventFairnessRatingComponent from "../../../pages/EventPage/components/EventFairnessRatingComponent";
import type { FootballEvent } from "../../../types/apiTypes";
import { COLOR_MAPPER } from "../../../constants/events";

interface Props {
  event: FootballEvent;
  onEventUpdate: (updated: FootballEvent) => void;
  onBalanceComplete: () => void;
}

const FootballEventDetails: React.FC<Props> = ({
  event,
  onEventUpdate,
  onBalanceComplete,
}) => {
  const { user } = useAuth();
  const canEdit =
    !event.isFinished &&
    user?.role === "ORGANIZER" &&
    user?.id === event.organizer?.id;

  const pitchKey = useMemo(() => {
    const ids = [
      ...(event.firstTeam?.players || []),
      ...(event.secondTeam?.players || []),
    ].map((p) => p.id);
    return ids.join("-");
  }, [event.firstTeam?.players, event.secondTeam?.players]);

  return (
    <>
      <div className="team-and-stats-section">
        <div className="event-page-section">
          <h3>Equipos</h3>
          <div className="event-page-team-section">
            {[event.firstTeam, event.secondTeam].map((team) => (
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
                  disabled={
                    event.firstTeam?.players.some(
                      (player) => player.user?.id === user?.id
                    ) ||
                    event.secondTeam?.players.some(
                      (player) => player.user?.id === user?.id
                    )
                  }
                />
                <PlayerList players={team?.players} />
              </div>
            ))}
          </div>
        </div>

        <div className="event-page-section">
          <h3>Balance</h3>
          <EventFairnessRatingComponent
            eventId={event.id}
            teams={[event.firstTeam, event.secondTeam]}
            onBalanceComplete={onBalanceComplete}
            canBalance={canEdit}
          />
        </div>

        <div className="event-page-section no-team-players">
          <h3>Jugadores sin equipo</h3>
          <PlayerList
            players={event.unnasignedPlayers?.filter(
              (p) =>
                !event.firstTeam?.players.some((tp) => tp.id === p.id) &&
                !event.secondTeam?.players.some((tp) => tp.id === p.id)
            )}
          />
        </div>
      </div>

      <div className="event-page-section">
        <h3>Distribución táctica</h3>
        <FootballPitch
          key={pitchKey}
          eventId={event.id}
          firstTeamColor={event.firstTeam?.color}
          secondTeamColor={event.secondTeam?.color}
          pitchSize={Number(event.pitchSize)}
          canEdit={canEdit}
        />
      </div>
    </>
  );
};

export default FootballEventDetails;
