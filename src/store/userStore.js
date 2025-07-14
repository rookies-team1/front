import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  token: null,

  setUser: (userInfo) => set({ user: userInfo }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
}));