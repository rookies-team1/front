import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bookmark from "./pages/Bookmark";
import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();

  // // 로그인/회원가입 페이지에서는 Navbar 생략
  // const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
