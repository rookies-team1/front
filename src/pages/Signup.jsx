import { useState } from "react";
import { useUserStore } from "../store/userStore"; // 상태 관리
import { useNavigate } from "react-router-dom"; // 페이지 이동

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); // 에러 메시지 상태
  const { registerUser } = useUserStore(); // Zustand를 통한 사용자 정보 저장
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    // 영문, 숫자, 특수문자 포함 조건을 만족하는지 확인하는 정규식
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (!validatePassword(form.password)) {
      setError("비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    // 회원가입 처리
    registerUser(form);
    alert("회원가입 완료! 로그인해주세요.");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="이름"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded">가입하기</button>
      </form>
    </div>
  );
}
