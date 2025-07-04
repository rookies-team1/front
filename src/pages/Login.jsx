import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginUser } = useUserStore();
//   const { loginUser, user } = useUserStore();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(form.email, form.password);

    if (!useUserStore.getState().user) {
      alert("이메일 또는 비밀번호가 틀렸습니다.");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
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
  );
}
