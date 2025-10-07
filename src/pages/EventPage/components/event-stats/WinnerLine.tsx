import { Chip } from "./Chip";
import { Pill } from "./Pill";

export const WinnerLine: React.FC<{ idLabel: string; textLabel: string }> = ({
  idLabel,
  textLabel,
}) => (
  <div className="esm-winnerLine">
    <Pill>{idLabel}</Pill>
    <Chip>{textLabel}</Chip>
  </div>
);