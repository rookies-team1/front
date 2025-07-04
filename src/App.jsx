import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Bookmark from "./pages/Bookmark";
import { useUserStore } from "./store/userStore"; // 상태 관리

export default function App() {
  const { setUser } = useUserStore();
  // const { user, setUser } = useUserStore();

  // 새로고침 후 user 상태 초기화
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // 로컬 스토리지에 사용자 정보가 있으면 상태를 업데이트
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Routes>
    </BrowserRouter>
  );
}
