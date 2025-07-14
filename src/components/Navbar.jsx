import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from '../assets/logo.png'; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBookmarkClick = (e) => {
    if (!user) {
      e.preventDefault(); // 라우터 이동 막기
      alert("로그인 후 이용 가능합니다.");
      navigate("/login"); // 명시적으로 로그인 페이지로 이동
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-700 hover:opacity-80 transition"
        >
          <img
            src={logo} 
            alt="로고"
            className="w-8 h-8"
          />
          <span>이미 직원</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/bookmark"
            onClick={handleBookmarkClick}
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