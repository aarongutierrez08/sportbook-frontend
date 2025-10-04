export const KpiCard: React.FC<{
  label: string;
  value: React.ReactNode;
  progressPercent?: number;
}> = ({ label, value, progressPercent }) => (
  <div className="esm-kpi">
    <div className="esm-kpi-label">{label}</div>
    <div className="esm-kpi-value">{value}</div>
    {typeof progressPercent === "number" && (
      <div className="esm-progress">
        <div className="esm-progressBar" style={{ width: `${progressPercent}%` }} />
      </div>
    )}
  </div>
);