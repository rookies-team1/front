import axios from 'axios';
import axiosInstance from './axiosInstance';
import { useUserStore } from '../store/userStore';


// 기업 목록 가져오기
export const fetchCompanies = async () => {
  try {
    const response = await axiosInstance.get('/news/companies');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('올바르지 않은 데이터 형식입니다.');
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// 뉴스 상세 조회
export const fetchNewsDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/news/${id}/detail`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return null;
  }
};

// 뉴스 제목 리스트 조회
export const fetchNewsTitles = async () => {
  try {
    const response = await axiosInstance.get('/news/titles');
    return response.data;
  } catch (error) {
    console.error("Error fetching news titles:", error);
    throw new Error('뉴스 제목 목록을 불러오는 데 실패했습니다.');
  }
};

// 기업별 뉴스 조회
export const fetchNewsByCompany = async (company) => {
  try {
    const response = await axiosInstance.get(`/news/${company}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by company:", error);
    throw new Error(`회사(${company})의 뉴스 목록을 불러오는 데 실패했습니다.`);
  }
};

// 회원가입
export const signUp = async (formData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error(error.response?.data?.errorMessage || "회원가입에 실패했습니다.");
    } else {
      throw new Error(error.response?.data?.errorMessage || "회원가입에 실패했습니다.");
    }
  }
};

// 로그인
export const signIn = async (loginData) => {
  try {
    const response = await axiosInstance.post('/auth/signin', loginData, {
      withCredentials: true, // 쿠키 저장을 위해 필요
    });

    if (response.data.success) {
      const { accessToken, username } = response.data.data;
      return { accessToken, username };
    } else {
      throw new Error(response.data.message || "로그인에 실패했습니다.");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.errorMessage || "로그인 요청 중 오류 발생"
    );
  }
};

// 리프레시 (axiosInstance 내부에서도 호출됨)
export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("토큰 재발급에 실패했습니다.");
  }
};


// 로그아웃
export const signOut = async () => {
  try {
    await axiosInstance.post('/auth/signout', {}, { withCredentials: true });
    useUserStore.getState().clearAuth();
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};

// 이메일 인증 요청
export const requestEmailVerification = async (email) => {
  const response = await axiosInstance.post('/auth/email', { email });
  return response.data;
};

// 이메일 인증 코드 검증
export const verifyEmailCode = async ({ email, code }) => {
  const response = await axiosInstance.post('/auth/email/verify', { email, code });
  return response.data;
};

// 뉴스 요약 API
export const fetchNewsSummary = async (newsId) => {
  try {
    const response = await axiosInstance.post(`/api/chat/summarize/${newsId}`);
    const result = response.data;

    if (result?.success && result?.data) {
      return {
        summary: result.data.summary || '',
        error: result.data.error || false,
        error_content: result.data.error_content || '',
      };
    } else {
      return {
        summary: '',
        error: true,
        error_content: result?.message || '요약 실패: 서버 응답이 잘못되었습니다.',
      };
    }
  } catch (error) {
    console.error("요약 API 호출 실패:", error);
    return {
      summary: '',
      error: true,
      error_content: error.message || '요약 요청 중 예외가 발생했습니다.',
    };
  }
};

// AI 질문 요청
export const fetchChatResponse = async ({ newsId, question, file }) => {
  const formData = new FormData();
  formData.append('newsId', newsId);
  formData.append('question', question);
  if (file) formData.append('file', file);

  try {
    const response = await axiosInstance.post('/api/chat/ask', formData);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'AI 응답 실패');
    }
  } catch (error) {
    console.error('AI 질문 API 오류:', error);
    throw new Error(error.message || 'AI 질문 중 오류 발생');
  }
};

// 채팅 히스토리 조회
export const fetchChatHistory = async (newsId) => {
  try {
    const response = await axiosInstance.get(`/api/chat/chat-history/${newsId}`);
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.flatMap((item) => [
        { role: 'user', content: item.question.content },
        { role: 'ai', content: item.answer.content },
      ]);
    } else {
      return [];
    }
  } catch (error) {
    console.error('채팅 기록 조회 실패:', error);
    return [];
  }
};
