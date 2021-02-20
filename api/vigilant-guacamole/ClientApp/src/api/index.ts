import axios from 'axios';
import { JsonWebTokenI, TokenDtoI } from 'src/shared/types/Login';

let isRefreshing = false;

const config = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

config.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401) {
    if (isRefreshing) {
      return new Promise(() => {}).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    // eslint-disable-next-line no-underscore-dangle
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenM: TokenDtoI = {
      token: refreshToken!!,
    };

    return new Promise((resolve, reject) => {
      axios.post('/auth/refresh-token', refreshTokenM, originalRequest)
        .then((resp) => {
          setToken(resp.data);
          originalRequest.headers.Authorization = `Bearer ${resp.data.accessToken}`;
          resolve(axios(originalRequest));
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => { isRefreshing = false; });
    });
  }
  return config;
});

config.defaults.headers.common['Content-Type'] = 'application/json';

const userToken = localStorage.getItem('accessToken');
if (userToken) {
  config.defaults.headers.common.Authorization = `Bearer ${userToken}`;
}

export default config;

export function resetAuthorization() {
  config.defaults.headers.common.Authorization = '';
}

export function setToken(jwtSet: JsonWebTokenI) {
  localStorage.setItem('accessToken', jwtSet.accessToken);
  localStorage.setItem('refreshToken', jwtSet.refreshToken);
  localStorage.setItem('expires', jwtSet.expires.toString());
  localStorage.setItem('userId', jwtSet.userId);
  config.defaults.headers.common.Authorization = `Bearer ${jwtSet.accessToken}`;
}
