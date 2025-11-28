import React from "react";
import { useAuth } from "../../auth/useAuth";
import type { Event, Sport } from "../../types/apiTypes";
import {
  formatDateFriendly,
  formatTime,
  isLoggedUserInEvent,
} from "../../utils/events";
import { AmountText } from "../components/AmountText";

// Iconos
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

interface EventCardProps {
  event: Event;
  onDetails: (id: number) => void;
}

// Configuración de etiquetas por deporte
const SPORT_CONFIG: Record<Sport, string> = {
  FOOTBALL: "FÚTBOL",
  PADDLE: "PÁDEL",
  VOLLEY: "VÓLEY",
};

const EventCard: React.FC<EventCardProps> = ({ event, onDetails }) => {
  const { user } = useAuth();

  // Calcular jugadores
  const totalPlayers =
    (event.unnasignedPlayers?.length || 0) +
    (event.teams?.reduce((acc, team) => acc + (team.players?.length || 0), 0) ||
      0);

  const isJoined = !event.isFinished && isLoggedUserInEvent(event, user);
  const isFull = totalPlayers >= event.maxPlayers;

  return (
    <article
      className={`card ${event.isFinished ? "card-finished" : ""}`}
      onClick={() => onDetails(event.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onDetails(event.id);
      }}
    >
      {/* HEADER: Badge Deporte + Hora */}
      <div className="card-header-row">
        <span className="sport-badge">
          {SPORT_CONFIG[event.sport] || event.sport}
        </span>
        <span className="event-time">{formatTime(event.dateTime)} hs</span>
      </div>

      {/* TITULO */}
      <h3 className="card-title">{event.name || "Evento sin nombre"}</h3>

      {/* LISTA DE DETALLES (Manteniendo todos los datos) */}
      <div className="card-details-list">
        {/* Fecha */}
        <div className="detail-item">
          <CalendarTodayOutlinedIcon />
          <span>{formatDateFriendly(event.dateTime)}</span>
        </div>

        {/* Lugar */}
        <div className="detail-item">
          <PlaceOutlinedIcon />
          <span>{event.location.placeName}</span>
        </div>

        {/* Jugadores */}
        <div className={`detail-item ${isFull ? "text-warning" : ""}`}>
          <GroupsOutlinedIcon />
          <span style={{ fontWeight: isFull ? 700 : 500 }}>
            {totalPlayers} / {event.maxPlayers} Jugadores
            {isFull && " (Lleno)"}
          </span>
        </div>

        {/* Costo */}
        {event.cost && event.cost > 0 && (
          <div className="detail-item highlight">
            <AttachMoneyOutlinedIcon />
            <AmountText number={event.cost} />
          </div>
        )}

        {/* Organizador */}
        <div className="detail-item">
          <PersonOutlineOutlinedIcon />
          <span>Org: {event.organizer?.name}</span>
        </div>

        {/* Datos Bancarios (Alias/CBU) - Solo si existen */}
        {(event.transferData?.alias || event.transferData?.cbu) && (
          <div className="detail-item" style={{ fontSize: "0.8rem" }}>
            <AccountBalanceIcon sx={{ fontSize: "1rem !important" }} />
            <span>Pago disp.</span>
          </div>
        )}

        {/* Estado: Unido */}
        {isJoined && (
          <div className="status-badge">
            <CheckCircleIcon fontSize="inherit" />
            <span>Ya estás anotado</span>
          </div>
        )}

        {event.isFinished && (
          <div
            className="status-badge"
            style={{ backgroundColor: "#e2e8f0", color: "#475569" }}
          >
            <CheckCircleIcon fontSize="inherit" />
            <span>Evento Finalizado</span>
          </div>
        )}
      </div>

      {/* FOOTER: Botón Flecha */}
      <div className="card-footer">
        <div className="action-button">
          <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
        </div>
      </div>
    </article>
  );
};

export default EventCard;
