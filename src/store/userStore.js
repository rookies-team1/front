import { create } from "zustand";

// 사용자 정보를 저장할 store
export const useUserStore = create((set) => ({
  // 로컬 스토리지에서 사용자 정보 불러오기
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: [],
  
  // 사용자 정보 설정 및 로컬 스토리지에 저장
  setUser: (userInfo) => {
    set({ user: userInfo });
    localStorage.setItem("user", JSON.stringify(userInfo)); // 로그인 시 로컬 스토리지에 저장
  },
  
  // 사용자 정보 삭제 및 로컬 스토리지에서 제거
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("user"); // 로그아웃 시 로컬 스토리지에서 삭제
  },
  
  // 새로운 사용자 등록
  registerUser: (newUser) =>
    set((state) => {
      const updatedUsers = [...state.users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // 로컬 스토리지에 저장
      return { users: updatedUsers };
    }),
  
  // 로그인
  loginUser: (email, password) =>
    set((state) => {
      const found = state.users.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        localStorage.setItem("user", JSON.stringify(found)); // 로그인 성공 시 로컬 스토리지에 저장
        return { user: found };
      }
      return { user: null };
    }),
}));
