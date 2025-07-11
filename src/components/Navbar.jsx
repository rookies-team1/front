import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-50 border-b shadow-sm">
      <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* 왼쪽 로고/타이틀 */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700 hover:opacity-80 transition">
          <span className="text-3xl">📊</span>
          <span>뉴스 분석 서비스</span>
        </Link>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/bookmark"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            ⭐ 즐겨찾기
          </Link>

          {user ? (
            <>
              <span className="text-gray-800 font-semibold flex items-center gap-1">
                👤 <span>{user.name}님</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
