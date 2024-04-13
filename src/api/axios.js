import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    //request 헤더
    // config.headers.authorization = 'token';
    return config;
  },
  (err) => {
    //요청 에러 시 수행 로직
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    //response에 대해 기술할 예정...
    const res = response.data;
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;