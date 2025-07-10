import { useState } from "react";

export const useForm = (initialValues) => {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return {
    form,
    error,
    setError,
    handleChange,
    setForm, // 필요 시 외부에서 전체 값 재설정 가능
  };
};