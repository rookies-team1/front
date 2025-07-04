import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function Navbar() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Zustand로 로그인 정보 초기화
    navigate("/login");
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
