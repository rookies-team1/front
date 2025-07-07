import { useState } from "react";
import { useUserStore } from "../store/userStore"; // 상태 관리
import { useNavigate } from "react-router-dom"; // 페이지 이동
import { signUp } from "../utils/api"; // API 함수 가져오기 (회원가입 API)

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [emailValid, setEmailValid] = useState(true); // 이메일 유효성 상태
  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 여부
  const [verificationCode, setVerificationCode] = useState(""); // 입력된 인증 코드
  const [generatedCode, setGeneratedCode] = useState(""); // 생성된 인증 코드
  const { registerUser } = useUserStore(); // Zustand를 통한 사용자 정보 저장
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  // 이메일 검증 버튼 클릭 시
  const handleEmailValidation = () => {
    if (validateEmail(form.email)) {
      setEmailValid(true);
      const code = Math.floor(1000 + Math.random() * 9000); // 4자리 인증 코드 생성
      setGeneratedCode(code); // 생성된 인증 코드 저장
      alert(`인증 코드: ${code}`); // 실제 서비스에서는 이메일로 보내야 하지만, 여기서는 알림으로 처리
    } else {
      setEmailValid(false); // 이메일 형식이 맞지 않으면 오류
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode.toString()) {
      setEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("잘못된 인증 코드입니다.");
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 유효성 검사
    if (!validateEmail(form.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 이메일 인증 여부 확인
    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    // 비밀번호 유효성 검사
    if (!validatePassword(form.password)) {
      setError("비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await signUp(form); // API에서 회원가입을 처리
      if (response.success) {
        alert("회원가입 완료! 로그인해주세요.");
        navigate("/login");
      } else {
        setError(response.message || "회원가입 실패");
      }
    } catch (error) {
      setError("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="이름"
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

          {/* 이메일 인증 코드 입력란 */}
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
          <input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          {form.password !== form.confirmPassword && form.confirmPassword && (
            <p className="text-red-500 text-sm">비밀번호와 비밀번호 확인이 일치하지 않습니다.</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-blue-600 text-white p-2 rounded">가입하기</button>
        </form>
      </div>
    </div>
  );
}
