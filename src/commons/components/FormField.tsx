import React, { cloneElement } from "react";
import { type FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  children: React.ReactElement<React.JSX.IntrinsicElements['input' | 'select']>;
  error?: FieldError;
  fullWidth?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  fullWidth = false,
}) => {
  const inputName = children.props.name

  const childWithId = cloneElement(children, {
    id: inputName,
  });

  return (
    <div className={`form-group ${fullWidth ? "form-full" : ""}`}>
      <label htmlFor={inputName}>{label}</label>
      {childWithId}
      {error && <div className="input-error">{error.message}</div>}
    </div>
  )
};
