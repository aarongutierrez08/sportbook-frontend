import "./FinishedEventDisplay.css";
import React, { useEffect, useState, type JSX } from "react";

import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PlaceIcon from "@mui/icons-material/Place";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";

import type {
  Event,
  EventStatsResponse,
  TeamScoreDTO,
  Sport,
} from "../../types/apiTypes";
import { getEventStats } from "../../api/eventsApi";
import { generateMatchSummary } from "../../api/aiApi";
import { formatDate } from "../../utils/events";
import {
  getColorThemeClass,
  getTeamDisplayName,
} from "./event-stats/colorUtils";
import { formatAmountIntl } from "../../utils/formatAmount";

const formatAiText = (text: string) => {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} style={{ color: "var(--color-secondary)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

type SportConfigType = {
  label: string;
  icon: JSX.Element;
  scoreUnit: string;
  scoreLabel: string;
  statIcon: JSX.Element;
  playerStatLabel: string;
  comparisonLabel: string;
};

const SPORT_CONFIG: Record<Sport, SportConfigType> = {
  FOOTBALL: {
    label: "Fútbol",
    icon: <SportsSoccerIcon fontSize="inherit" />,
    scoreUnit: "goles",
    scoreLabel: "Goles",
    statIcon: <SportsSoccerIcon className="mini-icon" />,
    playerStatLabel: "Goleadores",
    comparisonLabel: "Distribución de Goles",
  },
  PADDLE: {
    label: "Pádel",
    icon: <SportsTennisIcon fontSize="inherit" />,
    scoreUnit: "sets",
    scoreLabel: "Sets",
    statIcon: <ScoreboardIcon className="mini-icon" />,
    playerStatLabel: "Jugadores Destacados",
    comparisonLabel: "Balance de Sets",
  },
  VOLLEY: {
    label: "Vóley",
    icon: <SportsVolleyballIcon fontSize="inherit" />,
    scoreUnit: "sets",
    scoreLabel: "Sets",
    statIcon: <SportsVolleyballIcon className="mini-icon" />,
    playerStatLabel: "Mejores Jugadores",
    comparisonLabel: "Balance de Sets",
  },
};

interface FinishedEventDisplayProps {
  event: Event;
  onViewFullStats: () => void;
}

const FinishedEventDisplay: React.FC<FinishedEventDisplayProps> = ({
  event,
  onViewFullStats,
}) => {
  const [stats, setStats] = useState<EventStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    getEventStats(event.id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [event.id]);

  const handleGenerateAI = async () => {
    if (!stats) return;
    setIsAiLoading(true);
    try {
      const summary = await generateMatchSummary(event, stats);
      setAiSummary(summary);
    } catch (error) {
      console.error(error);
      setAiSummary("Hubo un problema técnico al generar el resumen.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="finished-event-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!stats) return null;

  const config = SPORT_CONFIG[event.sport] || SPORT_CONFIG.FOOTBALL;

  const sortedTeams = [...stats.scores].sort(
    (teamA, teamB) => teamB.goals - teamA.goals
  );
  const isDraw = stats.winningTeam === null;

  const topScorers = stats.goalsDetail;

  const rawTeam1 = event.teams[0];
  const rawTeam2 = event.teams[1];
  const themeT1 = rawTeam1 ? getColorThemeClass(rawTeam1.color) : "theme-white";
  const themeT2 = rawTeam2 ? getColorThemeClass(rawTeam2.color) : "theme-white";

  const totalScoreUnits =
    (sortedTeams[0]?.goals || 0) + (sortedTeams[1]?.goals || 0);
  const team1Percent =
    totalScoreUnits > 0 ? (sortedTeams[0].goals / totalScoreUnits) * 100 : 50;
  const team2Percent =
    totalScoreUnits > 0 ? (sortedTeams[1].goals / totalScoreUnits) * 100 : 50;

  const displayTitle =
    event.name && event.name.trim() !== "" ? event.name : config.label;

  const renderDuelCard = (
    team: TeamScoreDTO,
    rank: number,
    status: "winner" | "runner-up" | "draw"
  ) => {
    const themeClass = getColorThemeClass(team.color);
    const displayName = getTeamDisplayName(event, team.teamId, team.color);

    let medalClass = "medal-bronze";
    let MainIcon = WorkspacePremiumIcon;
    let rankDisplay = `${rank}°`;
    let cardClass = "";

    if (status === "draw") {
      medalClass = "medal-draw";
      MainIcon = HandshakeIcon;
      rankDisplay = "=";
      cardClass = "draw-card";
    } else if (status === "winner") {
      medalClass = "medal-gold";
      MainIcon = WorkspacePremiumIcon;
      rankDisplay = "1°";
      cardClass = "winner-card";
    } else {
      medalClass = "medal-silver";
      rankDisplay = "2°";
      cardClass = "runner-up-card";
    }

    return (
      <div className={`duel-place ${cardClass}`} key={team.teamId}>
        <div className={`duel-rank ${themeClass}`}>{rankDisplay}</div>

        <div className={`duel-card ${themeClass}`}>
          <div className={`duel-medal ${medalClass}`}>
            <MainIcon className="medal-icon-svg" />
          </div>

          <div className={`team-color-badge ${themeClass}`}>{displayName}</div>

          <div
            className={`duel-score ${status === "winner" ? "winner-text" : ""}`}
          >
            {team.goals}
          </div>
          <div className="duel-label">{config.scoreUnit}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          {!event.name && <span className="sport-icon">{config.icon}</span>}
          {displayTitle}
        </h1>

        <div className="header-details-container">
          <div className="header-pill" title="Fecha">
            <CalendarTodayIcon fontSize="small" className="pill-icon" />
            <span>{formatDate(event.dateTime)}</span>
          </div>
          <div className="header-pill" title="Ubicación">
            <PlaceIcon fontSize="small" className="pill-icon" />
            <span>{event.location.placeName}</span>
          </div>
          {event.organizer && (
            <div className="header-pill" title="Organizador">
              <PersonIcon fontSize="small" className="pill-icon" />
              <span>
                {event.organizer.name} {event.organizer.lastName}
              </span>
            </div>
          )}
          {event.cost && (
            <div className="header-pill" title="Costo">
              <AttachMoneyIcon fontSize="small" className="pill-icon" />
              <span>{formatAmountIntl(event.cost)}</span>
            </div>
          )}
          {event.transferData &&
            (event.transferData.alias || event.transferData.cbu) && (
              <div className="header-pill" title="Pago">
                <AccountBalanceWalletIcon
                  fontSize="small"
                  className="pill-icon"
                />
                <span>
                  {event.transferData.alias || event.transferData.cbu}
                </span>
              </div>
            )}
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-main-column">
          <div className="duel-wrapper">
            <div
              className={`duel-container ${isDraw ? "is-draw" : "has-winner"}`}
            >
              {isDraw ? (
                <>
                  {renderDuelCard(sortedTeams[0], 1, "draw")}
                  {renderDuelCard(sortedTeams[1], 1, "draw")}
                </>
              ) : (
                <>
                  {renderDuelCard(sortedTeams[1], 2, "runner-up")}
                  {renderDuelCard(sortedTeams[0], 1, "winner")}
                </>
              )}
            </div>
          </div>

          <div className="final-score-wrapper">
            <div className="final-score-display">
              {sortedTeams.map((team, idx) => {
                const themeClass = getColorThemeClass(team.color);
                const name = getTeamDisplayName(event, team.teamId, team.color);
                return (
                  <React.Fragment key={team.teamId}>
                    <div className={`score-team ${themeClass}`}>
                      {idx === 0 && <span className="score-name">{name}</span>}
                      <span className="score-number">{team.goals}</span>
                      {idx === 1 && <span className="score-name">{name}</span>}
                    </div>
                    {idx === 0 && <div className="score-separator">-</div>}
                  </React.Fragment>
                );
              })}
            </div>

            {stats.sets && stats.sets.length > 0 && (
              <div className="sets-breakdown">
                {stats.sets.map((set, idx) => {
                  let setWinnerTheme = "";
                  if (set.team1Score > set.team2Score) setWinnerTheme = themeT1;
                  else if (set.team2Score > set.team1Score)
                    setWinnerTheme = themeT2;

                  const t1Class =
                    set.team1Score < set.team2Score ? "score-loser" : themeT1;
                  const t2Class =
                    set.team2Score < set.team1Score ? "score-loser" : themeT2;

                  return (
                    <div
                      key={idx}
                      className={`set-score-pill ${setWinnerTheme}`}
                    >
                      <span className={`set-score-num ${t1Class}`}>
                        {set.team1Score}
                      </span>
                      <span className="set-score-divider">-</span>
                      <span className={`set-score-num ${t2Class}`}>
                        {set.team2Score}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="details-card comparison-card full-width-comparison">
            <div className="comparison-mini-header">
              <CompareArrowsIcon fontSize="small" />
              <span>{config.comparisonLabel}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-segment segment-left ${getColorThemeClass(
                  sortedTeams[0].color
                )}`}
                style={{ width: `${team1Percent}%` }}
              ></div>
              <div
                className={`progress-segment segment-right ${getColorThemeClass(
                  sortedTeams[1].color
                )}`}
                style={{ width: `${team2Percent}%` }}
              ></div>
            </div>
          </div>
        </section>

        <aside className="dashboard-details-column">
          <div className="details-card stats-row">
            <div className="mini-stat">
              <span className="mini-icon-wrapper">{config.statIcon}</span>
              <div>
                <span className="mini-val">{stats.totalGoals}</span>
                <span className="mini-lbl">{config.scoreLabel}</span>
              </div>
            </div>
            <div className="mini-stat">
              <GroupIcon className="mini-icon" />
              <div>
                <span className="mini-val">{stats.presentPlayers}</span>
                <span className="mini-lbl">Jugadores</span>
              </div>
            </div>
            <div className="mini-stat">
              <BarChartIcon className="mini-icon" />
              <div>
                <span className="mini-val">
                  {Math.round(stats.attendanceRate * 100)}%
                </span>
                <span className="mini-lbl">Asistencia</span>
              </div>
            </div>
          </div>

          <div
            className={`details-card ai-section ${aiSummary ? "expanded" : ""}`}
          >
            <div className="ai-header">
              <SmartToyIcon className="ai-icon" />
              <span>Análisis del Partido</span>
            </div>
            {!aiSummary && !isAiLoading && (
              <div className="ai-prompt">
                <p>Genera una crónica breve y emocionante del encuentro.</p>
                <button className="btn-ai-generate" onClick={handleGenerateAI}>
                  <AutoAwesomeIcon fontSize="small" />
                  Generar con IA
                </button>
              </div>
            )}
            {isAiLoading && (
              <div className="ai-loading-state">
                <div className="ai-pulse"></div>
                <span>Escribiendo crónica...</span>
              </div>
            )}
            {aiSummary && (
              <div className="ai-result-container">
                <p className="ai-text">{formatAiText(aiSummary)}</p>
              </div>
            )}
          </div>

          {stats.mvp && (
            <div
              className={`details-card mvp-card-mini ${getColorThemeClass(
                stats.mvp.teamColor!
              )}`}
            >
              <div className="mvp-mini-icon">
                <AutoAwesomeIcon fontSize="small" style={{ color: "white" }} />
              </div>
              <div className="mvp-mini-info">
                <span className="mvp-mini-label">MVP DEL PARTIDO</span>
                <span className="mvp-mini-name">{stats.mvp.name}</span>
              </div>
            </div>
          )}

          {topScorers?.length > 0 && (
            <div className="details-card scorers-card-mini">
              <div className="mini-card-title">
                <GpsFixedIcon fontSize="small" />
                <span>{config.playerStatLabel}</span>
              </div>
              <div className="scorers-list-mini">
                {topScorers.map((scorer, index) => {
                  const teamScore = stats.scores.find(
                    (score) => score.teamId === scorer.teamId
                  );
                  const themeClass = teamScore
                    ? getColorThemeClass(teamScore.color)
                    : "theme-blue";
                  return (
                    <div
                      key={`${scorer.player.id}-${index}`}
                      className={`scorer-item-mini ${themeClass}`}
                    >
                      <div className="scorer-rank-mini">{index + 1}</div>
                      <span className="scorer-name-mini">
                        {scorer.player.name}
                      </span>
                      {scorer.goals > 0 && (
                        <span className="scorer-goals-mini">
                          {scorer.goals}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            className="btn-premium-action compact-btn"
            onClick={onViewFullStats}
          >
            <span>Ver Estadísticas Completas</span>
            <ArrowForwardIcon className="btn-icon" />
          </button>
        </aside>
      </div>
    </div>
  );
};

export default FinishedEventDisplay;
