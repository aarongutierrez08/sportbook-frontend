import React from "react";
import EditableField from "../components/EditableField";
import type { Event } from "../../types/apiTypes";
import type { UpdateEventParams } from "../../pages/event/ActiveEventDetails";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { formatAmountIntl } from "../../utils/formatAmount";

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

    {}
    <div className="section-row">
      <AttachMoneyIcon className="section-icon" />
      <EditableField
        enabled={canEdit}
        label="Costo"
        field="cost"
        type="number"
        value={event.cost}
        displayValue={formatAmountIntl(event.cost)}
        editForm={editForm}
        onChange={onFieldChange}
      />
    </div>

    <div className="section-divider"></div>

    {}
    <div className="section-row">
      <AlternateEmailIcon className="section-icon" />
      <EditableField
        enabled={canEdit}
        label="Alias"
        field="transferDataAlias"
        value={event.transferData?.alias}
        editForm={editForm}
        onChange={onFieldChange}
      />
    </div>

    {}
    <div className="section-row">
      <AccountBalanceIcon className="section-icon" />
      <EditableField
        enabled={canEdit}
        label="CBU"
        field="transferDataCbu"
        value={event.transferData?.cbu}
        editForm={editForm}
        onChange={onFieldChange}
      />
    </div>
  </div>
);

export default EventPaymentSection;
