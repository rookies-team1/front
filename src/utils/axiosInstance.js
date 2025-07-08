import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://18.233.156.168:8080', // 백엔드 API의 기본 URL로 변경
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // 인증이 필요한 경우
  },
});

export default axiosInstance;