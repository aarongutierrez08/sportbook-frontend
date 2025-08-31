import type { SportEventForm } from "../types/events";
import { stringToPlayerInfoList } from "./events";

export const matchDetailsBuilder = (
  data: SportEventForm
): object => {
  if (data.sport === "FOOTBALL") {
    const firstTeamPlayers = stringToPlayerInfoList(data.firstTeamPlayers);
    const secondTeamPlayers = stringToPlayerInfoList(data.secondTeamPlayers);
    return {
      players: firstTeamPlayers.concat(secondTeamPlayers),
      pitchSize: data.pitchSize ?? 5,
      firstTeam: {
        color: data.firstTeamColor,
        players: firstTeamPlayers,
      },
      secondTeam: {
        color: data.secondTeamColor,
        players: secondTeamPlayers,
      },
    };
  }
  if (data.sport === "PADDLE" || data.sport === "VOLLEY") {
    if (stringToPlayerInfoList(data.teams).length) {
      return {
        players: [],
        teams: [
          { color: "Negro", players: [] },
          { color: "Blanco", players: [] },
        ],
      };
    }
  } else {
    return {
      players: [],
      teams: stringToPlayerInfoList(data.teams).map((team) => {
        return {
          color: team,
          players: [],
        };
      }),
    };
  }
  return {};
};
