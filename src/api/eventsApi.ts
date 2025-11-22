import type { UpdateEventParams } from "../pages/event/ActiveEventDetails";
import type {
  Event,
  EventStatsResponse,
  FinishEventRequest,
  FootballLineup,
  Lineup,
  Position,
  Sport,
  Team,
} from "../types/apiTypes";
import api from "./axios";

export type SimplifiedPlayer = {
  name: string | undefined;
  user:
    | {
        id: number;
      }
    | undefined;
};

export type CreateEventRequest = {
  sport: Sport;
  minPlayers: number;
  maxPlayers: number;
  cost?: number | string | null;
  dateTime: string;

  location: {
    x: string;
    y: string;
    placeName: string;
  };

  transferData: {
    cbu?: string | null;
    alias?: string | null;
  };

  pitchSize?: number | null;

  players: SimplifiedPlayer[];

  teams: Partial<Team>[];
};

export const createEvent = async (
  params: CreateEventRequest
): Promise<Event> => {
  const res = await api.post<Event>("/event", params);
  return res.data;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const res = await api.get<Event[]>("/event");
  return res.data;
};

export const getFinishedEvents = async (): Promise<Event[]> => {
  const res = await api.get<Event[]>("/event/finished");
  return res.data;
};

export const joinEvent = async (eventId: number): Promise<Event> => {
  const res = await api.put<Event>("/event/" + eventId + "/join");
  return res.data;
};

export const joinTeam = async (
  eventId: number,
  teamId: number
): Promise<Event> => {
  const res = await api.put<Event>("/event/" + eventId + "/join/" + teamId);
  return res.data;
};

export const getEvent = async (eventId: number): Promise<Event> => {
  const res = await api.get<Event>("/event/" + eventId);
  return res.data;
};

export const getLineups = async (
  eventId: number
): Promise<FootballLineup[]> => {
  const res = await api.get<FootballLineup[]>("/event/" + eventId + "/lineup");
  return res.data;
};

export const addPlayerToPosition = async (
  lineupId: number,
  position: Position,
  playerId: number
): Promise<Lineup> => {
  const res = await api.put<Lineup>(
    "/event/lineup/" +
      lineupId +
      "/position?position=" +
      position +
      "&playerId=" +
      playerId
  );
  return res.data;
};

export const removeFromPosition = async (
  lineupId: number,
  position: Position
): Promise<Lineup> => {
  const res = await api.delete<Lineup>(
    "/event/lineup/" + lineupId + "/position?position=" + position
  );
  return res.data;
};

export const leaveEvent = async (eventId: number): Promise<Lineup> => {
  const res = await api.delete<Lineup>("/event/" + eventId + "/leave");
  return res.data;
};

export const updateEvent = async (
  eventId: number,
  params: UpdateEventParams
): Promise<Event> => {
  const res = await api.put<Event>("/event/" + eventId, params);
  return res.data;
};

export const finishEvent = async (
  eventId: number,
  params: FinishEventRequest
): Promise<Event> => {
  const res = await api.post<Event>(`/event/${eventId}/finish`, params);
  return res.data;
};

export const getEventStats = async (
  eventId: number,
  params?: { userId?: number }
): Promise<EventStatsResponse> => {
  const res = await api.get<EventStatsResponse>(`/event/${eventId}/stats`, {
    params,
  });
  return res.data;
};

export const getFairnessRating = async (eventId: number): Promise<number> => {
  const res = await api.get<number>("/event/" + eventId + "/fairness-score");
  return res.data;
};

export const balanceEvent = (eventId: number) => {
  return api.post("/event/" + eventId + "/balance");
};

export const addTeam = async (eventId: number, team: Team): Promise<Event> => {
  const res = await api.put<Event>("/event/" + eventId + "/add-team", team);
  return res.data;
};

export const removeTeam = async (
  eventId: number,
  teamId: number
): Promise<Event> => {
  const res = await api.delete<Event>(
    "/event/" + eventId + "/remove-team/" + teamId
  );
  return res.data;
};
