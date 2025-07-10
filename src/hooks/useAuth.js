import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

export const useAuth = () => {
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const logout = () => {
    clearUser();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return { user, logout };
};