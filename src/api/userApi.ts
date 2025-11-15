import type { SportUser } from "../types/apiTypes";
import api from "./axios";

export const searchUsers = async (query: string): Promise<SportUser[]> => {
  const response = await api.get(
    `/users/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};
