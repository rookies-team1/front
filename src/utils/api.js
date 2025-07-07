import axiosInstance from './axiosInstance';

// 뉴스 제목 조회
export const fetchNewsTitle = async (id) => {
  try {
    const response = await axiosInstance.get(`/news/${id}/title`);
    return response.data;  // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error fetching news title:", error);
    throw new Error('뉴스 제목을 불러오는 데 실패했습니다.');  // 사용자에게 적절한 에러 메시지 제공
  }
};


// 기업 목록 가져오기
export const fetchCompanies = async () => {
  try {
    const response = await axiosInstance.get('/news/companies'); // /news/companies API 호출
    return response.data; // 기업 목록을 반환
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error; // 에러가 발생하면 다시 throw
  }
};

// 뉴스 상세 조회
export const fetchNewsDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/news/${id}/detail`);
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

// 기업별 뉴스 조회 (optional)
export const fetchNewsByCompany = async (company) => {
  try {
    const response = await axiosInstance.get(`/news/companies?company=${company}`);
    return response.data;  // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error fetching news by company:", error);
    throw new Error(`회사(${company})의 뉴스 목록을 불러오는 데 실패했습니다.`);
  }
};

// 회원가입
export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;  // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error during signup:", error);
    throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
};

// 로그인
export const signIn = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/signin', { email, password });
    return response.data;  // 로그인 성공 시 사용자 데이터와 토큰 반환
  } catch (error) {
    console.error("Error during signin:", error);
    throw new Error('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
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