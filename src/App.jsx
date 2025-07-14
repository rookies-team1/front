import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bookmark from "./pages/Bookmark";
import Navbar from "./components/Navbar";

function AppContent() {
  // const location = useLocation();

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
      <div className="min-h-screen text-gray-800 font-sans">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}