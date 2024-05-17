import axios from 'axios';

const configureAxios = () => {
  axios.defaults.baseURL = 'http://localhost:5000/api';

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

const api = axios.create();

export { configureAxios, api };
