import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { showToastOnce } from "../utils/toastHelper";

export default function ProtectedRoute({ children }) {
  const { token } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      const fromNavbar = location.state?.fromNavbar;
      if (!fromNavbar) {
        showToastOnce("로그인이 필요한 기능입니다.");
      }

      navigate("/login", {
        replace: true,
        state: undefined,
      });
    }
  }, [token, navigate, location]);

  return token ? children : null;
}
