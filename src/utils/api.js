import axiosInstance from './axiosInstance';

// 기업 목록 가져오기
export const fetchCompanies = async () => {
  try {
    const response = await axiosInstance.get('/news/companies');
    // response.data.data가 배열 형태인지 확인하고 반환
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data; // data 안의 배열 반환
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
    const response = await axiosInstance.get(`/news/${id}/detail`);  // 여기서 /news/{id}/detail을 사용합니다.
    return response.data; // 성공적으로 데이터를 반환
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return null; // 에러 발생 시 null 반환
  }
};

// 뉴스 제목 리스트 조회
export const fetchNewsTitles = async () => {
  try {
    const response = await axiosInstance.get('/news/titles');
    return response.data;  // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error fetching news titles:", error);
    throw new Error('뉴스 제목 목록을 불러오는 데 실패했습니다.');
  }
};

// 기업별 뉴스 조회
export const fetchNewsByCompany = async (company) => {
  try {
    const response = await axiosInstance.get(`/news/${company}`); // 회사 이름을 URL 파라미터로 사용
    return response.data;  // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error fetching news by company:", error);
    throw new Error(`회사(${company})의 뉴스 목록을 불러오는 데 실패했습니다.`);
  }
};

// 회원가입
export const signUp = async (formData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', formData);
    return response.data;  // 서버 응답 데이터 반환
  } catch (error) {
    // 중복된 이메일일 경우 처리
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
    const response = await axiosInstance.post('/auth/signin', loginData);

    if (response.data.success) {
      const { accessToken, username } = response.data.data;
      return { accessToken, username }; // ✅ username도 함께 반환
    } else {
      throw new Error(response.data.message || "로그인에 실패했습니다.");
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response?.data?.errorMessage || "로그인에 실패했습니다.";
      throw new Error(errorMessage);
    } else {
      throw new Error("네트워크 오류입니다.");
    }
  }
};


// 토큰 재발급 (선택적)
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post('/auth/refresh', { token });
    return response.data;  // 새로 발급된 토큰 반환
  } catch (error) {
    console.error("Error during token refresh:", error);
    throw new Error('토큰 재발급에 실패했습니다. 다시 로그인 해주세요.');
  }
};





export const requestEmailVerification = async (email) => {
  const response = await axiosInstance.post('/auth/email', { email });
  return response.data;
};


export const verifyEmailCode = async ({ email, code }) => {
  const response = await axiosInstance.post('/auth/email/verify', { email, code });
  return response.data;
};


// 뉴스 요약 API 요청
export const fetchNewsSummary = async (newsId) => {
  try {
    const response = await axiosInstance.post(`/api/chat/summarize/${newsId}`);

    const result = response.data;

    // 응답 구조에 맞춰 정리
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



// AI 응답 요청
export const fetchChatResponse = async ({ newsId, question, file }) => {
  const token = localStorage.getItem('accessToken');

  const formData = new FormData();
  formData.append('newsId', newsId);
  formData.append('question', question);
  if (file) formData.append('file', file);

  try {
    const response = await axiosInstance.post('/api/chat/ask', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Content-Type 생략해야 boundary 자동 처리됨
      },
    });

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


// 뉴스별 채팅 히스토리 조회
export const fetchChatHistory = async (newsId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await axiosInstance.get(`/api/chat/chat-history/${newsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      // { role: 'user' | 'ai', content: string } 형태로 변환
      const history = response.data.data.flatMap((item) => [
        { role: 'user', content: item.question.content },
        { role: 'ai', content: item.answer.content },
      ]);
      return history;
    } else {
      return []; // 기록 없음 처리
    }
  } catch (error) {
    console.error('채팅 기록 조회 실패:', error);
    return [];
  }
};