
import api from "./axios";
import type { SportUser } from "../types/user";

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: SportUser;
}

export const loginUser = async (credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", credentials);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
};

export const registerUser = async (user: SportUser): Promise<SportUser> => {
  const res = await api.post<SportUser>("/auth/register", user);
  return res.data;
};
