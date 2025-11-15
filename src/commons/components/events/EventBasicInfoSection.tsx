import React from "react";
import EditableField from "../EditableField";
import { formatDate } from "../../../utils/events";
import type { UpdateEventParams } from "../../../pages/EventPage/EventPage";
import type { Event } from "../../../types/apiTypes";
import EditableUserField from "../EditableUserField";

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
}) => (
  <div className="event-page-section">
    <h3>Detalles del Evento</h3>
    <p>Fecha y hora: {formatDate(event.dateTime)}</p>

    <EditableUserField
      enabled={canEdit}
      label="Organizador"
      field="organizerId"
      user={event.organizer}
      onChange={onFieldChange}
    />

    <p>
      Jugadores: {event.unnasignedPlayers.length} / {event.minPlayers}
    </p>

    <EditableField
      enabled={canEdit}
      label="Costo"
      field="cost"
      type="number"
      value={event.cost}
      editForm={editForm}
      onChange={onFieldChange}
    />
  </div>
);

export default EventBasicInfoSection;
