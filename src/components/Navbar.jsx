import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

export default function Navbar() {
  const { user, setUser, clearUser } = useUserStore();
  const navigate = useNavigate();

  // 로그인 상태를 로컬 스토리지에서 초기화
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // 로컬 스토리지에서 사용자 정보를 불러오기
    }
  }, [setUser]);

  const handleLogout = () => {
    clearUser(); // Zustand로 로그인 정보 초기화
    localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 삭제
    localStorage.removeItem("accessToken"); // 토큰도 삭제
    navigate("/login"); // 로그인 페이지로 리디렉션
  };

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-600">
        📊 뉴스 분석 서비스
      </Link>
      <div className="flex gap-4 items-center">
        <Link
          to="/bookmark"
          className="text-blue-600 hover:underline"
        >
          ⭐ 즐겨찾기
        </Link>

        {user ? (
          <>
            <span className="text-gray-700">👋 {user.name}님</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="text-blue-600 hover:underline"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
