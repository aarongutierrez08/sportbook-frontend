import React, { useState } from "react";
import MiniMap from "../components/MiniMap";
import LocationPickerMap from "../components/LocationPickerMap";
import EditableField from "../components/EditableField";
import type { Event } from "../../types/apiTypes";
import type { UpdateEventParams } from "../../pages/event/ActiveEventDetails";
import PlaceIcon from "@mui/icons-material/Place";

interface Props {
  event: Event;
  editForm: UpdateEventParams;
  onChangeLocation: (lat: number, lng: number, placeName?: string) => void;
  onFieldChange: (
    field: keyof UpdateEventParams,
    value: string | number
  ) => void;
  canEdit: boolean;
}

const EventLocationSection: React.FC<Props> = ({
  event,
  editForm,
  onChangeLocation,
  onFieldChange,
  canEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="event-page-section">
      <h3>Ubicación</h3>

      <div className="section-row">
        <PlaceIcon className="section-icon" />
        <EditableField
          enabled={canEdit}
          label="Lugar"
          field="locationPlaceName"
          value={event.location.placeName}
          editForm={editForm}
          onChange={onFieldChange}
        />
      </div>

      {!isEditing ? (
        <div className="event-page-minimap">
          <MiniMap
            lat={Number(event.location.x)}
            lng={Number(event.location.y)}
          />
          {canEdit && (
            <button
              className="edit-location-button"
              onClick={() => setIsEditing(true)}
            >
              Cambiar ubicación
            </button>
          )}
        </div>
      ) : (
        <div
          className="location-picker-container"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <LocationPickerMap
            lat={Number(editForm.locationX) ?? Number(event.location.x)}
            lng={Number(editForm.locationY) ?? Number(event.location.y)}
            onChange={onChangeLocation}
          />
          <button
            className="cancel-location-button"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default EventLocationSection;
