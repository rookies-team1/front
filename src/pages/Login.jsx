import { useNavigate } from "react-router-dom";
import { signIn } from "../utils/api";
import { useForm } from "../hooks/useForm";
import { useUserStore } from "../store/userStore"; // Zustand 사용자/토큰 상태 사용

export default function Login() {
  const { form, handleChange, error, setError } = useForm({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore(); // 전역 상태 설정 함수

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await signIn({
        email: form.email,
        password: form.password,
      });

      // 상태로 저장
      setToken(token);
      setUser({
        email: form.email,
        name: form.email.split("@")[0],
      });

      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || error.message;
      console.error("로그인 오류:", errorMessage);
      setError(errorMessage);
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
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
