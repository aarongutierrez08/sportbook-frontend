import api from "./axios";

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export const loginUser = async (credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", credentials);
  return res.data;
};

import type { SportUser } from "../types/user";

export const registerUser = async (user: SportUser): Promise<SportUser> => {
  const res = await api.post<SportUser>("/auth/register", user);
  return res.data;
};
