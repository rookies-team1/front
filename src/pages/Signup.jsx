import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../utils/api"; // API 함수 가져오기

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailValidation = () => {
    if (validateEmail(form.email)) {
      setEmailValid(true);
      const code = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(code);
      alert(`인증 코드: ${code}`);
    } else {
      setEmailValid(false);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === generatedCode.toString()) {
      setEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("잘못된 인증 코드입니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 유효성 검사
    if (!validateEmail(form.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError("비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await signUp({
        username: form.username,
        email: form.email,
        password: form.password
      });

      if (response.success) {
        alert("회원가입 완료! 로그인해주세요.");
        navigate("/login");
      } else {
        // 다른 에러 처리
        setError(response.errorMessage || "회원가입 실패");
      }
    } catch (error) {
      if (error.message === "중복된 이메일입니다.") {
        setError("중복된 이메일입니다. 다른 이메일을 사용해 주세요.");
      } else {
        setError(error.message || "회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="아이디"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="이메일"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleEmailValidation}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded"
            >
              인증
            </button>
          </div>
          {!emailValid && form.email && (
            <p className="text-red-500 text-sm">올바른 이메일 형식을 입력해주세요.</p>
          )}

          {emailValid && !emailVerified && (
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증 코드 입력"
                className="w-full p-2 border rounded mt-2"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="mt-2 w-full bg-blue-600 text-white p-2 rounded"
              >
                인증하기
              </button>
            </div>
          )}

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
    </div>
  );
}
