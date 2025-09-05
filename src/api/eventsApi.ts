import type { SportEvent } from "../types/events";
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
