import { GoogleGenAI } from "@google/genai";
import type {
  Event,
  EventStatsResponse,
  Sport,
  TeamColor,
  FootballProfileDetail,
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

const getLocalPerformanceInsights = (
  event: Event,
  stats: EventStatsResponse,
  winnerId: number | undefined
): string[] => {
  const insights: string[] = [];
  const sport = event.sport;

  if (stats.goalsDetail && stats.goalsDetail.length > 0) {
    const topScorer = stats.goalsDetail[0];

    if (topScorer.goals >= 3) {
      insights.push(
        `ACTUACIÓN ESTELAR: ${topScorer.player.name} se llevó la pelota con un Hat-Trick (${topScorer.goals} goles).`
      );
    } else if (topScorer.goals === 2) {
      insights.push(
        `FIGURA: Doblete clave de ${topScorer.player.name} para liderar la ofensiva.`
      );
    }

    if (sport === "FOOTBALL") {
      const fullScorer = event.teams
        .flatMap((t) => t.players)
        .find((p) => p.id === topScorer.player.id);

      const profile = fullScorer?.user?.profiles.find(
        (p) => p.sport === "FOOTBALL"
      )?.details as FootballProfileDetail | undefined;

      if (
        profile?.favoritePosition &&
        ["GK", "CB", "LB", "RB"].includes(profile.favoritePosition)
      ) {
        insights.push(
          `DATO TÁCTICO: Sorpresivo aporte ofensivo de ${topScorer.player.name}, quien habitualmente juega en defensa (${profile.favoritePosition}).`
        );
      }
    }
  }

  if (winnerId) {
    const loserScore =
      stats.scores.find((s) => s.teamId !== winnerId)?.goals || 0;

    if (loserScore === 0) {
      insights.push(
        "SOLIDEZ DEFENSIVA: El equipo ganador mantuvo su valla invicta (Clean Sheet), neutralizando completamente al rival."
      );
    }
  }

  if (sport !== "FOOTBALL" && stats.sets) {
    const sets = stats.sets;
    const tightSets = sets.filter(
      (s) => Math.abs(s.team1Score - s.team2Score) <= 2
    ).length;

    if (tightSets === sets.length && sets.length > 0) {
      insights.push(
        "PARIDAD ABSOLUTA: Todos los sets se definieron por la mínima diferencia."
      );
    } else if (tightSets === 0 && sets.length > 0) {
      insights.push(
        "DOMINIO TOTAL: Victoria contundente sin permitir sets reñidos."
      );
    }
  }

  return insights;
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
  let matchContext = "";

  if (sport === "FOOTBALL") {
    const diff = winner.goals - loser.goals;
    scoreDetail = `${winner.goals} a ${loser.goals}`;

    if (isDraw) {
      matchContext = "Empate técnico con reparto de puntos.";
    } else if (diff > 3) {
      matchContext = "Victoria abultada con amplia superioridad ofensiva.";
    } else {
      matchContext = "Triunfo trabajado y ajustado.";
    }
  } else {
    const sets = stats.sets || [];
    const setsStr = sets
      .map((s) => `${s.team1Score}-${s.team2Score}`)
      .join(", ");
    scoreDetail = `Sets: ${setsStr} (Global: ${winner.goals}-${loser.goals})`;
    matchContext = "Encuentro definido por consistencia en los puntos clave.";
  }

  const historicalInsights = stats.insights || [];

  const performanceInsights = getLocalPerformanceInsights(
    event,
    stats,
    stats.winningTeam?.id
  );

  const allInsights = [...historicalInsights, ...performanceInsights];

  const insightsText =
    allInsights.length > 0
      ? allInsights.join("\n    - ")
      : "Partido parejo sin incidencias estadísticas fuera de lo común.";

  const mvpInfo = stats.mvp
    ? `${stats.mvp.name} (${getTeamName(
        stats.mvp.teamId!,
        stats.mvp.teamColor!,
        event
      )})`
    : "Rendimiento colectivo destacado";

  const prompt = `
    Actúa como un Analista Deportivo Senior (estilo OptaJoe o VarskySports).
    Genera un resumen post-partido de ${sportName} breve, profesional y centrado en datos curiosos.

    DATOS DEL PARTIDO:
    - Sede: ${location}
    - Resultado: ${winnerName} venció a ${loserName} (${scoreDetail}).
    - MVP: ${mvpInfo}.
    - Contexto: ${matchContext}
    
    INSIGHTS ESTADÍSTICOS (PRIORIDAD ALTA - ÚSALOS):
    - ${insightsText}

    REGLAS DE REDACCIÓN:
      1. Usa **negritas** (con doble asterisco) para resaltar ÚNICAMENTE los datos estadísticos clave y nombres propios importantes (ej: **Lio Messi**, **Hat-trick**, **Valla Invicta**).
      2. NO uses listas, ni títulos, ni encabezados Markdown (#). Escribe en párrafos fluidos.
      3. Prioridad absoluta a los "INSIGHTS ESTADÍSTICOS".
      4. NO uses frases de relleno genéricas. Ve al dato duro.
      5. Extensión: Máximo 80 palabras.
      6. Termina con 1 solo emoji relevante.
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

    return "Procesando estadísticas avanzadas...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "No se pudo conectar con el servicio de análisis.";
  }
};
