import api from "./axios";
import type { SportUser } from "../types/user";

const extractBearerToken = (
  authorizationHeader?: string | null
): string | null => {
  if (!authorizationHeader) return null;
  const [scheme, value] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) return null;
  return value;
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}): Promise<SportUser> => {
  const res = await api.post<SportUser>("/auth/login", credentials);

  const token = extractBearerToken(res.headers["authorization"]);
  if (token) {
    localStorage.setItem("token", token);
  }

  const user = res.data;

  return user;
};

export const registerUser = async (user: SportUser): Promise<SportUser> => {
  const res = await api.post<SportUser>("/auth/register", user);

  const token = extractBearerToken(res.headers["authorization"]);
  if (token) {
    localStorage.setItem("token", token);
  }

  const createdUser = res.data;

  return createdUser;
};

export const fetchMe = async (): Promise<SportUser> => {
  const res = await api.get<SportUser>("/auth/me");
  return res.data;
};
