import { create } from "zustand";
import { authApi } from "../services/api";
import type { LoginPayload, RegisterPayload, User } from "../types/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const TOKEN_KEY = "issue_tracker_token";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  loading: false,
  initialized: false,
  error: null,

  bootstrap: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ initialized: true });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await authApi.me();
      set({ user: data.user, token, initialized: true, loading: false });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, token: null, initialized: true, loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login(payload);
      localStorage.setItem(TOKEN_KEY, data.token);
      set({ user: data.user, token: data.token, loading: false, initialized: true });
    } catch (error: any) {
      const message = error?.response?.data?.error || "Unable to login";
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register(payload);
      localStorage.setItem(TOKEN_KEY, data.token);
      set({ user: data.user, token: data.token, loading: false, initialized: true });
    } catch (error: any) {
      const message = error?.response?.data?.error || "Unable to register";
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, error: null });
  },
}));
