import axios from 'axios';

const API_URL_BASE = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL_BASE,
});

export function formatDateForBackend(date: string) {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatAlreadyDate(date: string|null) {

  if(date) {
    const splitted = date.split('/');

    const day = splitted[0];
    const month = splitted[1];
    const year = splitted[2];
  
    return `${day}-${month}-${year}`;
  }

  return null;


}

export default api;
