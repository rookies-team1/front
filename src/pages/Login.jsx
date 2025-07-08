import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { signIn } from "../utils/api"; // API 함수 가져오기

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); // 네비게이션을 사용하여 로그인 후 이동
  const { setUser } = useUserStore(); // Zustand의 setUser 사용

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: form.email,
      password: form.password,
    };

    try {
      // 로그인 API 호출
      const token = await signIn(loginData);
      console.log('로그인 성공, 받은 토큰:', token);
      localStorage.setItem('accessToken', token); // 받은 토큰 로컬 스토리지에 저장

      const user = { email: form.email, name: form.email.split('@')[0] }; // 사용자의 이메일로 이름 설정
      localStorage.setItem("user", JSON.stringify(user)); // 로컬 스토리지에 사용자 정보 저장

      setUser(user);  // Zustand 상태 업데이트

      navigate("/");  // 로그인 후 이동할 페이지 (홈 페이지)
    } catch (error) {
      // API에서 반환한 errorMessage 처리
      const errorMessage = error.response?.data?.errorMessage || error.message;
      console.error('로그인 오류:', errorMessage);  // 응답에서 메시지 확인
      setError(errorMessage);  // 에러 상태 업데이트
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
          {error && <p className="text-red-500 text-sm">{error}</p>}  {/* 에러 메시지 출력 */}
          <button className="w-full bg-blue-600 text-white p-2 rounded">로그인</button>
        </form>
      </div>
    </div>
  );
}
