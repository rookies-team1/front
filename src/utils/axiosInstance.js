// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // 백엔드 API의 기본 URL로 변경
//   headers: {
//     'Content-Type': 'application/json',
//     // 'Authorization': `Bearer ${localStorage.getItem('token')}` // 인증이 필요한 경우
//   },
// });

// export default axiosInstance;



import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✔️ 여긴 그대로
});

export default axiosInstance;




// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // 필요에 따라 요청마다 헤더를 동적으로 추가할 수 있음
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // 바디가 있는 POST 요청만 Content-Type 설정
//   if (
//     config.method === 'post' &&
//     config.data &&
//     typeof config.data === 'object' &&
//     !(config.data instanceof FormData)
//   ) {
//     config.headers['Content-Type'] = 'application/json';
//   }

//   return config;
// });

// export default axiosInstance;
