import "../../pages/event/EventPage.css";
import React, { useState } from "react";
import type { UpdateEventParams } from "../../pages/event/ActiveEventDetails";

interface EditableFieldProps {
  label: string;
  field: keyof UpdateEventParams;
  value?: string | number;
  displayValue?: string;
  editForm: UpdateEventParams;
  onChange: (field: keyof UpdateEventParams, value: string | number) => void;
  type?: string;
  enabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  field,
  value,
  displayValue,
  editForm,
  onChange,
  type = "text",
  enabled = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const currentValue = editForm[field] ?? value;

  const visibleValue = displayValue ?? currentValue;

  return (
    <div className="editable-field">
      <strong>{label}:</strong>{" "}
      {isEditing ? (
        <input
          type={type}
          value={currentValue}
          onChange={(e) =>
            onChange(
              field,
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          onBlur={() => setIsEditing(false)}
          className="inline-edit-input"
          autoFocus
        />
      ) : (
        <span style={{ marginLeft: "0.5rem" }}>{visibleValue}</span>
      )}
      {enabled && (
        <span
          className="edit-icon"
          title="Editar"
          onClick={() => setIsEditing(!isEditing)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default EditableField;
