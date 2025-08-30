import type { SportEvent } from "../types/events";
import api from "./axios";

export const createEvent = async (params: SportEvent): Promise<SportEvent> => {
  const res = await api.post<SportEvent>(
    "/sportbook/event",
    params,
  );
  return res.data;
};

export const getAllEvents = async (): Promise<SportEvent[]> => {
    console.log(api.getUri())
  const res = await api.get<SportEvent[]>(
    "/sportbook/events",
  );
  return res.data;
};

export const joinEvent = async (eventId: number, username: string): Promise<SportEvent> => {
    const res = await api.put<SportEvent>(
        "/sportbook/events/" + eventId + "/join?username=" + username,
    );
    return res.data;
}
