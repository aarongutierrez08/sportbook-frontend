
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
  const username = parseJwt(res.data.token).sub
  localStorage.setItem("user", JSON.stringify({ username }));
  return res.data;
};

export const registerUser = async (user: SportUser): Promise<SportUser> => {
  const res = await api.post<SportUser>("/auth/register", user);
  return res.data;
};


function parseJwt<T = any>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    // JWT usa base64url (diferente a base64 estándar)
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decodificar
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as T;
  } catch (e) {
    console.error("Error al decodificar JWT", e);
    return null;
  }
}