import type { SportEvent } from "../types/events";
import api from "./axios";

export const createEvent = async (params: SportEvent): Promise<SportEvent> => {
  try {
    const res = await api.post<SportEvent>(
      "/sportbook/event",
      params,
    );
    return res.data;
  } catch (err) {
    console.error("Fail to create event:", err);
    throw err;
  }
};
