import React from "react";
import { FormField } from "./FormField";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SportEventForm } from "../types/events";

interface PaymentFieldsProps {
  register: UseFormRegister<SportEventForm>;
  errors: FieldErrors<SportEventForm>;
}

export const PaymentFields: React.FC<PaymentFieldsProps> = ({ register, errors }) => {
  return (
    <div className="form-group form-full payment-section">
      <h3>💰 Información de Pago (Opcional)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <FormField label="CBU" error={errors.cbu}>
          <input
            type="number"
            placeholder="1234567890123456789012"
            {...register("cbu", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Alias" error={errors.alias}>
          <input
            type="text"
            placeholder="deportes.juan"
            {...register("alias")}
          />
        </FormField>
      </div>
      <FormField label="Costo" error={errors.cost}>
        <input type="number" placeholder="10.000" {...register("cost", { valueAsNumber: true })} />
      </FormField>
    </div>
  );
};
