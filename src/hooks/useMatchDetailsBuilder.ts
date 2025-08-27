import type { MatchDetails, SportEventForm } from "../types/events";
import { stringToList } from "../utils/events";

export function useMatchDetailsBuilder() {
  return (data: SportEventForm): MatchDetails => {
    if (data.sport === "FOOTBALL") {
      return {
        pitchSize: data.pitchSize,
        firstTeamColor: data.firstTeamColor,
        secondTeamColor: data.secondTeamColor,
      };
    }
    if (data.sport === "PADDEL" || data.sport === "VOLLEY") {
      return {
        teams: stringToList(data.teams),
      };
    }
    return {};
  };
}
