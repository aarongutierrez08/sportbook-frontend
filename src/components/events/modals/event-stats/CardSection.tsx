export const CardSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="esm-card">
    <div className="esm-card-title">{title}</div>
    {children}
  </div>
);