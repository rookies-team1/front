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
      return response.data.data.accessToken; // accessToken 반환
    } else {
      throw new Error(response.data.message || "로그인에 실패했습니다.");
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response?.data?.errorMessage || "로그인에 실패했습니다.";
      throw new Error(errorMessage);  // 서버에서 받은 에러 메시지 반환
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


export const uploadFiles = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

  try {
    const response = await axiosInstance.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // 멀티파트 폼 데이터로 전송
        'Authorization': `Bearer ${token}`,    // 토큰을 Authorization 헤더에 포함
      },
    });

    return response.data;  // 서버에서 반환한 데이터 반환
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    throw new Error('파일 업로드에 실패했습니다.');
  }
};