import React from "react";
import EditableField from "../EditableField";
import type { UpdateEventParams } from "../../../pages/EventPage/EventPage";
import type { Event } from "../../../types/apiTypes";

interface Props {
  event: Event;
  editForm: UpdateEventParams;
  onFieldChange: (
    field: keyof UpdateEventParams,
    value: string | number
  ) => void;
  canEdit: boolean;
}

const EventPaymentSection: React.FC<Props> = ({
  event,
  editForm,
  onFieldChange,
  canEdit,
}) => (
  <div className="event-page-section">
    <h3>Datos de Pago</h3>
    <EditableField
      enabled={canEdit}
      label="Alias"
      field="transferDataAlias"
      value={event.transferData?.alias}
      editForm={editForm}
      onChange={onFieldChange}
    />
    <EditableField
      enabled={canEdit}
      label="CBU"
      field="transferDataCbu"
      value={event.transferData?.cbu}
      editForm={editForm}
      onChange={onFieldChange}
    />
  </div>
);

export default EventPaymentSection;
