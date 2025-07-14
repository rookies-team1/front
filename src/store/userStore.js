import { create } from "zustand";

export const useUserStore = create((set) => ({
  // 초기 상태: 로컬 스토리지에서 불러오기
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("accessToken") || null,

  // 사용자 정보 설정
  setUser: (userInfo) => {
    set({ user: userInfo });
    localStorage.setItem("user", JSON.stringify(userInfo));
  },

  // 토큰 설정
  setToken: (token) => {
    set({ token });
    localStorage.setItem("accessToken", token);
  },

  // 사용자 정보와 토큰 모두 제거
  clearAuth: () => {
    set({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  },
}));