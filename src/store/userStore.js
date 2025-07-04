// src/store/userStore.js
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null, // 현재 로그인한 사용자
  users: [],  // 가입된 모든 사용자 정보 (더미 DB 역할)
  setUser: (userInfo) => set({ user: userInfo }),
  clearUser: () => set({ user: null }),

  registerUser: (newUser) =>
    set((state) => ({
      users: [...state.users, newUser],
    })),

  loginUser: (email, password) =>
    set((state) => {
      const found = state.users.find(
        (u) => u.email === email && u.password === password
      );
      return { user: found || null };
    }),
}));
