import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export async function fetchSiteData<T = any>(): Promise<T> {
  const res = await api.get('/data/siteData.json');
  return res.data as T;
}
