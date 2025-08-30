import type { MatchDetails, PlayerInfo, SportEventForm } from "../types/events";
import { mapPitchSize, stringToPlayerInfoList } from "./events";

export const matchDetailsBuilder = (
  data: SportEventForm
): { players?: PlayerInfo[]; matchDetails?: MatchDetails } => {
  if (data.sport === "FOOTBALL") {
    const firstTeamPlayers = stringToPlayerInfoList(data.firstTeamPlayers);
    const secondTeamPlayers = stringToPlayerInfoList(data.secondTeamPlayers);
    return {
      players: firstTeamPlayers.concat(secondTeamPlayers),
      matchDetails: {
        pitchSize: mapPitchSize(data.pitchSize ?? 5),
        firstTeam: {
          color: data.firstTeamColor,
          players: firstTeamPlayers,
        },
        secondTeam: {
          color: data.secondTeamColor,
          players: secondTeamPlayers,
        },
      },
    };
  }
  if (data.sport === "PADDEL" || data.sport === "VOLLEY") {
    if (stringToPlayerInfoList(data.teams).length) {
      return {
        players: [],
        matchDetails: {
          teams: [
            { color: "Negro", players: [] },
            { color: "Blanco", players: [] },
          ],
        },
      };
    }
  } else {
    return {
      players: [],
      matchDetails: {
        teams: stringToPlayerInfoList(data.teams).map((team) => {
          return {
            color: team,
            players: [],
          };
        }),
      },
    };
  }
  return {};
};
