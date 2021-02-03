import axios from 'axios';
import { JsonWebTokenI, TokenDtoI } from 'src/shared/types/Login';
import { updateTokenRequest } from './auth';

const config = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

config.interceptors.request.use(function (config) {
  const tokenExp = localStorage.getItem('expires');
  const refreshToken = localStorage.getItem('refreshToken');
  if (tokenExp && refreshToken !== null) {
    const nowDate = new Date();
    const tokenExpDate = new Date(parseInt(tokenExp, 10) * 1000 + nowDate.getTimezoneOffset() * 60000);

    if (tokenExpDate < nowDate) {
      const refreshTokenM:TokenDtoI = {
        token: refreshToken,
      };
      updateTokenRequest(refreshTokenM).then((resp) => {
        setToken(resp.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  return config;
});

config.defaults.headers.common['Content-Type'] = 'application/json';

const userToken = localStorage.getItem('accessToken');
if (userToken) {
  config.defaults.headers.common.Authorization = `Bearer ${userToken}`;
}

export default config;

export function setToken(jwtSet: JsonWebTokenI) {
  localStorage.setItem('accessToken', jwtSet.accessToken);
  localStorage.setItem('refreshToken', jwtSet.refreshToken);
  localStorage.setItem('expires', jwtSet.expires.toString());
  config.defaults.headers.common.Authorization = `Bearer ${jwtSet.accessToken}`;
}
