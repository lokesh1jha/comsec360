// src/store/authStore.ts
import create, { createStore } from 'zustand';

interface AuthState {
  user: { email: string; type: string } | null;
  token: string | null;
  setUser: (user: { email: string; type: string }) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = createStore<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
  getUser: () => set({ user: null, token: null }),
}));
