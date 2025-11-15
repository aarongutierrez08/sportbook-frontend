import React, { useState } from "react";
import MiniMap from "../MiniMap";
import LocationPickerMap from "../LocationPickerMap";
import EditableField from "../EditableField";
import type { UpdateEventParams } from "../../../pages/EventPage/EventPage";
import type { Event } from "../../../types/apiTypes";

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
      <EditableField
        enabled={canEdit}
        label="Lugar"
        field="locationPlaceName"
        value={event.location.placeName}
        editForm={editForm}
        onChange={onFieldChange}
      />

      {!isEditing ? (
        <div className="event-page-minimap">
          <MiniMap
            lat={Number(event.location.x)}
            lng={Number(event.location.y)}
          />
          {canEdit && (
            <div className="buttons-container">
              <button
                className="btn btn--block"
                onClick={() => setIsEditing(true)}
              >
                Cambiar ubicación
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="location-picker-container">
          <LocationPickerMap
            lat={Number(editForm.locationX) ?? Number(event.location.x)}
            lng={Number(editForm.locationY) ?? Number(event.location.y)}
            onChange={onChangeLocation}
          />
          <button
            className="btn btn--secondary"
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
