import { GoogleGenAI } from "@google/genai";
import type {
  Event,
  EventStatsResponse,
  Sport,
  TeamColor,
} from "../types/apiTypes";
import { getTeamColorName } from "../pages/event/event-stats/colorUtils";

const SPORT_LABELS: Record<Sport, string> = {
  FOOTBALL: "Fútbol",
  PADDLE: "Pádel",
  VOLLEY: "Vóley",
};

const getTeamName = (teamId: number, color: TeamColor, event: Event) => {
  const team = event.teams.find((t) => t.id === teamId);
  if (team && team.name && team.name.trim() !== "") return team.name;
  return `Equipo ${getTeamColorName(color)}`;
};

const getClient = () => {
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Falta la API KEY de Gemini.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMatchSummary = async (
  event: Event,
  stats: EventStatsResponse
): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: Configuración de IA no disponible.";

  const sport = event.sport;
  const sportName = SPORT_LABELS[sport] || sport;
  const location = event.location.placeName;

  const sortedScores = [...stats.scores].sort((a, b) => b.goals - a.goals);
  const winner = sortedScores[0];
  const loser = sortedScores[1];

  const winnerName = getTeamName(winner.teamId, winner.color, event);
  const loserName = getTeamName(loser.teamId, loser.color, event);
  const isDraw = stats.winningTeam === null;

  let scoreDetail = "";
  let gameFlowContext = "";
  let keyStatContext = "";

  if (sport === "FOOTBALL") {
    const goalDifference = winner.goals - loser.goals;
    const totalGoals = stats.totalGoals;

    scoreDetail = `${winner.goals} a ${loser.goals}`;

    const intensity =
      totalGoals > 8
        ? "Lluvia de goles, defensas abiertas"
        : totalGoals < 3
        ? "Partido trabado y táctico"
        : "Ritmo equilibrado";
    gameFlowContext = `Estilo de juego: ${intensity}. ${
      isDraw
        ? "Empate técnico."
        : `Victoria por diferencia de ${goalDifference} goles.`
    }`;

    if (stats.scorersRanking.length > 0) {
      const topScorer = stats.scorersRanking[0];
      const scorerTeamGoals =
        stats.scores.find((s) => s.teamId === topScorer.teamId)?.goals || 1;
      const dependency = Math.round((topScorer.goals / scorerTeamGoals) * 100);
      keyStatContext = `Goleador: ${topScorer.player.name} (${topScorer.goals} goles). Representó el ${dependency}% del ataque de su equipo.`;
    } else {
      keyStatContext = "Goles repartidos (Juego colectivo).";
    }
  } else {
    const sets = stats.sets || [];

    if (sets.length > 0) {
      const setsString = sets
        .map((s) => `${s.team1Score}-${s.team2Score}`)
        .join(", ");
      scoreDetail = `Sets: ${setsString} (Global: ${winner.goals}-${loser.goals})`;

      const totalSets = sets.length;
      if (totalSets >= 3) {
        gameFlowContext =
          "Partido maratónico y muy disputado, se definió en los últimos puntos.";
      } else {
        gameFlowContext = "Victoria contundente en sets corridos.";
      }
    } else {
      scoreDetail = `${winner.goals} sets a ${loser.goals}`;
      gameFlowContext = "Partido definido por sets.";
    }

    keyStatContext =
      "Destacar la consistencia y los puntos clave en la red/remate.";
  }

  const mvpInfo = stats.mvp
    ? `${stats.mvp.name} (${getTeamName(
        stats.mvp.teamId!,
        stats.mvp.teamColor!,
        event
      )})`
    : "No seleccionado";

  const prompt = `
    Actúa como un comentarista deportivo profesional de ${sportName}. 
    Escribe una crónica breve (máximo 90 palabras) sobre este encuentro finalizado.
    
    El tono debe ser: Natural, analítico y entusiasta, pero profesional. Usa terminología propia del deporte (${
      sport === "FOOTBALL"
        ? "goles, áreas, posesión"
        : "puntos, sets, red, remates"
    }).

    Datos del partido:
    - Sede: ${location}.
    - Enfrentamiento: ${winnerName} vs ${loserName}.
    - Resultado Final: ${scoreDetail}.
    - Contexto del juego: ${gameFlowContext}.
    - Dato destacado: ${keyStatContext}.
    - Figura (MVP): ${mvpInfo}.

    Instrucciones:
    1. Si es Padel/Voley, menciona los parciales de los sets si están disponibles.
    2. Si es Fútbol, menciona si fue goleada o partido cerrado.
    3. Dale crédito al MVP por su impacto en el resultado.
    4. Usa máximo 2 emojis al final.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const candidates = response.candidates || [];
    if (candidates.length > 0) {
      const text = candidates[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    }

    return "Analizando el encuentro...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "No se pudo conectar con el analista virtual.";
  }
};
