import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// RENAME the constant and the export
const apiClient = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

export default apiClient;