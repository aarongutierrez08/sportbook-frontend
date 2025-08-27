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
  const res = await api.get<SportEvent[]>(
    "/sportbook/events",
  );
  return res.data;
};
