import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { signIn } from "../utils/api"; // API 연동

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useUserStore(); // 상태 관리
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 백엔드에서 로그인 API 호출
    try {
      const response = await signIn(form.email, form.password); // 로그인 API 호출

      if (response && response.user) {
        // 로그인 성공 시 상태 업데이트
        setUser(response.user);
        navigate("/"); // 홈 페이지로 이동
      } else {
        alert("이메일 또는 비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="이메일"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">로그인</button>
        </form>
      </div>
    </div>
  );
}
