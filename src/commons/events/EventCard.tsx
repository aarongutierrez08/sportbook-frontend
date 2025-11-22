import { type JSX } from "react";
import { formatDate, isLoggedUserInEvent } from "../../utils/events";
import { AmountText } from "../components/AmountText";
import { useTheme } from "@mui/material/styles";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "../../auth/useAuth";
import type { Event, Sport } from "../../types/apiTypes";

interface EventCardProps {
  event: Event;
  onDetails: (id: number) => void;
}

const SPORT_NAME_DICTIONARY: Record<
  Sport,
  { label: string; icon: JSX.Element }
> = {
  FOOTBALL: { label: "Fútbol", icon: <SportsSoccerIcon fontSize="small" /> },
  PADDLE: { label: "Pádel", icon: <SportsTennisIcon fontSize="small" /> },
  VOLLEY: { label: "Vóley", icon: <SportsVolleyballIcon fontSize="small" /> },
};

const EventCard: React.FC<EventCardProps> = ({ event, onDetails }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const sportInfo = SPORT_NAME_DICTIONARY[event.sport];

  return (
    <article className="card" aria-labelledby={`event-title-${event.id}`}>
      {event.isFinished && (
        <div className="event-status">
          <CheckCircleIcon
            sx={{
              color: theme.palette.secondary.light,
              fontSize: 20,
              mr: 0.5,
              verticalAlign: "middle",
            }}
          />{" "}
          Evento Finalizado
        </div>
      )}

      <div className="card-header event-detail-row">
        <div id={`event-title-${event.id}`} className="sport event-detail-row">
          {sportInfo.icon}
          <span>{sportInfo.label}</span>
        </div>
        {!event.isFinished && (
          <div className="date event-detail-row">
            <EventIcon
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 20,
                verticalAlign: "middle",
              }}
            />
            <span>{formatDate(event.dateTime)}</span>
          </div>
        )}
      </div>

      <div className="players event-detail-row">
        <PeopleIcon
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 24,
            verticalAlign: "middle",
          }}
        />
        <span>
          Jugadores: {event.unnasignedPlayers.length} / {event.minPlayers}
        </span>
      </div>

      <div className="cost event-detail-row">
        <AttachMoneyIcon
          sx={{
            color: theme.palette.secondary.main,
            fontSize: 24,
            verticalAlign: "middle",
          }}
        />
        <span>
          Costo: <AmountText number={event.cost} />
        </span>
      </div>

      <div className="footer">
        <div className="event-detail-row">
          <PersonIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: 24,
              verticalAlign: "middle",
            }}
          />
          <span>Organizador: {event.organizer?.name}</span>
        </div>
        <div className="event-detail-row">
          <PlaceIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: 24,
              verticalAlign: "middle",
            }}
          />
          <span>Lugar: {event.location.placeName}</span>
        </div>
        <div className="event-detail-row">
          <AlternateEmailIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: 24,
              verticalAlign: "middle",
            }}
          />
          <span>Alias: {event.transferData?.alias ?? "—"}</span>
        </div>
        <div className="event-detail-row">
          <AccountBalanceIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: 24,
              verticalAlign: "middle",
            }}
          />
          <span>CBU: {event.transferData?.cbu ?? "—"}</span>
        </div>
      </div>

      {!event.isFinished && isLoggedUserInEvent(event, user) && (
        <div className="joined event-detail-row" aria-live="polite">
          <CheckCircleIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: 20,
              verticalAlign: "middle",
              mr: 0.5,
            }}
          />
          <span>¡Ya sos parte de este evento!</span>
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
