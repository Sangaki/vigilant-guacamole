import axios from 'axios';

const config = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

config.defaults.headers.common['Content-Type'] = 'application/json';

const userToken = localStorage.getItem('userToken');
if (userToken)
  config.defaults.headers.common.Authorization = `Bearer ${userToken}`;

export default config;

export function setToken(token: string) {
  localStorage.setItem('userToken', token);
  config.defaults.headers.common.Authorization = `Bearer ${token}`;
}
