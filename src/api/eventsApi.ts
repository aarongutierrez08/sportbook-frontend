import type {Lineup, Position, SportEvent, UpdateEventParams} from "../types/events";
import api from "./axios";

export const createEvent = async (params: SportEvent): Promise<SportEvent> => {
  const res = await api.post<SportEvent>(
    "/event",
    params,
  );
  return res.data;
};

export const getAllEvents = async (): Promise<SportEvent[]> => {
  const res = await api.get<SportEvent[]>(
    "/event",
  );
  return res.data;
};

export const joinEvent = async (eventId: number): Promise<SportEvent> => {
    const res = await api.put<SportEvent>(
        "/event/" + eventId + "/join",
    );
    return res.data;
}

export const joinTeam = async (eventId: number, teamId: number): Promise<SportEvent> => {
    const res = await api.put<SportEvent>(
        "/event/" + eventId + "/join/" + teamId,
    );
    return res.data;
}

export const getEvent = async (eventId: number): Promise<SportEvent> => {
    const res = await api.get<SportEvent>(
        "/event/" + eventId,
    );
    return res.data;
};

export const getLineups = async (eventId: number): Promise<Lineup[]> => {
    const res = await api.get<Lineup[]>(
        "/event/" + eventId + "/lineup",
    );
    return res.data;
};

export const addPlayerToPosition = async (lineupId: number, position: Position, playerId: number): Promise<Lineup> => {
    const res = await api.put<Lineup>(
        "/event/lineup/" + lineupId + "/position?position=" + position + "&playerId=" + playerId,
    );
    return res.data;
};

export const removeFromPosition = async (lineupId: number, position: Position): Promise<Lineup> => {
    const res = await api.delete<Lineup>(
        "/event/lineup/" + lineupId + "/position?position=" + position,
    );
    return res.data;
};

export const leaveEvent = async (eventId: number): Promise<Lineup> => {
    const res = await api.delete<Lineup>(
        "/event/" + eventId + "/leave",
    );
    return res.data;
};

export const updateEvent = async (eventId: number, params: UpdateEventParams): Promise<SportEvent> => {
    const res = await api.put<SportEvent>(
        "/event/" + eventId,
        params
    );
    return res.data;
};
