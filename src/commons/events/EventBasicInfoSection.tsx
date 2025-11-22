import React from "react";
import EditableField from "../components/EditableField";
import EditableUserField from "../components/EditableUserField";
import type { Event } from "../../types/apiTypes";
import type { UpdateEventParams } from "../../pages/event/ActiveEventDetails";

import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  event: Event;
  editForm: UpdateEventParams;
  onFieldChange: (
    field: keyof UpdateEventParams,
    value: string | number
  ) => void;
  canEdit: boolean;
}

const EventBasicInfoSection: React.FC<Props> = ({
  event,
  editForm,
  onFieldChange,
  canEdit,
}) => {
  const currentDateTime = editForm.dateTime || event.dateTime;

  const [datePart, timeFull] = currentDateTime.split(" ");
  const timePart = timeFull ? timeFull.substring(0, 5) : "00:00";

  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (_: any, newDate: string | number) => {
    const newDateTime = `${newDate} ${timePart}:00`;
    onFieldChange("dateTime", newDateTime);
  };

  const handleTimeChange = (_: any, newTime: string | number) => {
    const newDateTime = `${datePart} ${newTime}:00`;
    onFieldChange("dateTime", newDateTime);
  };

  const totalPlayers =
    event.unnasignedPlayers.length +
    event.teams.reduce((acc, t) => acc + t.players.length, 0);

  return (
    <div className="event-page-section">
      <h3>Detalles del Evento</h3>

      <div className="section-row">
        <EventIcon className="section-icon" titleAccess="Fecha" />
        <EditableField
          enabled={canEdit}
          label="Fecha"
          field="dateTime"
          type="date"
          value={datePart}
          displayValue={formatDateDisplay(datePart)}
          editForm={{}}
          onChange={handleDateChange}
        />
      </div>

      <div className="section-row">
        <CheckCircleIcon className="section-icon" titleAccess="Hora" />
        <EditableField
          enabled={canEdit}
          label="Hora"
          field="dateTime"
          type="time"
          value={timePart}
          editForm={{}}
          onChange={handleTimeChange}
        />
      </div>

      <div className="section-row">
        <PersonIcon className="section-icon" titleAccess="Organizador" />
        <EditableUserField
          enabled={canEdit}
          label="Organizador"
          field="organizerId"
          user={event.organizer}
          onChange={onFieldChange}
        />
      </div>

      <div className="section-divider"></div>

      <div className="section-row">
        <PeopleIcon className="section-icon" />
        <EditableField
          enabled={canEdit}
          label="Mínimo"
          field="minPlayers"
          type="number"
          value={event.minPlayers}
          editForm={editForm}
          onChange={onFieldChange}
        />
      </div>

      <div className="section-row">
        <PeopleIcon className="section-icon" />
        <EditableField
          enabled={canEdit}
          label="Máximo"
          field="maxPlayers"
          type="number"
          value={event.maxPlayers}
          editForm={editForm}
          onChange={onFieldChange}
        />
      </div>

      <div className="section-row" style={{ marginTop: "auto" }}>
        <div style={{ width: 32, flexShrink: 0 }}></div>
        <p
          style={{
            margin: 0,
            padding: 0,
            background: "transparent",
            border: "none",
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Inscriptos actuales: <strong>{totalPlayers}</strong>
        </p>
      </div>
    </div>
  );
};

export default EventBasicInfoSection;
