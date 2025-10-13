import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import type { SportUser } from "../types/user";
import { clearAuthData } from "../api/axios";
import { fetchMe, loginUser, registerUser } from "../api/authApi";
import { AuthContext } from "./useAuth";

type AuthStatus = "idle" | "guest" | "auth";

type AuthState = {
  status: AuthStatus;
  user: SportUser | null;
  token: string | null;
};

type Credentials = { username: string; password: string };

type AuthAction =
  | { type: "INIT"; payload: { user: SportUser | null; token: string | null } }
  | { type: "RESTORE"; payload: { user: SportUser; token: string } }
  | { type: "LOGIN"; payload: { user: SportUser; token: string } }
  | { type: "REGISTER"; payload: { user: SportUser; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: SportUser };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT": {
      const { token } = action.payload;
      return {
        status: token ? "idle" : "guest",
        user: null,
        token: token ?? null,
      };
    }
    case "RESTORE": {
      const { user, token } = action.payload;
      return { status: "auth", user, token };
    }
    case "LOGIN":
    case "REGISTER": {
      const { user, token } = action.payload;
      return { status: "auth", user, token };
    }
    case "SET_USER": {
      return { ...state, user: action.payload };
    }
    case "LOGOUT":
      return { status: "guest", user: null, token: null };
    default:
      return state;
  }
}

export type AuthContextValue = {
  status: AuthStatus;
  user: SportUser | null;
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  register: (user: SportUser) => Promise<void>;
  logout: () => void;
  setUser: (updater: (prev: SportUser) => SportUser) => void;
};

const initialState: AuthState = { status: "idle", user: null, token: null };

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch({ type: "INIT", payload: { user: null, token } });

    if (!token) {
      return;
    }

    const load = async () => {
      try {
        const me = await fetchMe();
        dispatch({ type: "RESTORE", payload: { user: me, token } });
      } catch {
        clearAuthData();
        dispatch({ type: "LOGOUT" });
      }
    };

    void load();
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    const user = await loginUser(credentials);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found after login");
    dispatch({ type: "LOGIN", payload: { user, token } });
  }, []);

  const register = useCallback(async (user: SportUser) => {
    const createdUser = await registerUser(user);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found after register");
    dispatch({ type: "REGISTER", payload: { user: createdUser, token } });
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    dispatch({ type: "LOGOUT" });
  }, []);

  const setUser = useCallback(
    (updater: (prev: SportUser) => SportUser) => {
      if (!state.user) return;
      const next = updater(state.user);
      dispatch({ type: "SET_USER", payload: next });
    },
    [state.user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      token: state.token,
      login,
      register,
      logout,
      setUser,
    }),
    [state.status, state.user, state.token, login, register, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
