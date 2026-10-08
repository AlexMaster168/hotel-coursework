import { t, getLanguage } from '../i18n/locale';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import authService from './auth.service';
import storage from './localStorage.service';
const http=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api',timeout:15000});
let refresh:Promise<void>|null=null;
http.interceptors.request.use(async(config:InternalAxiosRequestConfig)=>{
 if(storage.getRefreshToken()&&Number(storage.getTokenExpiresDate())<Date.now()){
  refresh ||= authService.refresh().then(storage.setTokens).catch(error=>{storage.removeAuthData();window.dispatchEvent(new Event('session-expired'));throw error;}).finally(()=>{refresh=null;});
  await refresh;
 }
 config.headers.set('Accept-Language',getLanguage());const token=storage.getAccessToken();if(token)config.headers.set('Authorization',`Bearer ${token}`);return config;
});
http.interceptors.response.use(res=>{res.data={content:res.data};return res;},error=>{
 if(!error.response||error.response.status>=500)toast.error(t('Не вдалося виконати запит. Спробуйте пізніше.'));
 return Promise.reject(error);
});
export default {get:http.get,post:http.post,put:http.put,delete:http.delete,patch:http.patch};
