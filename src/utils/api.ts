import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ... (keep existing interceptors)

// Add a new method for Electron IPC communication
api.electron = async (operation: string, collection: string, data: any) => {
  if (window.electronAPI) {
    return window.electronAPI.dbOperation({ operation, collection, ...data });
  }
  throw new Error('Electron API not available');
};

api.electronFile = async (operation: string, filename: string, fileData?: ArrayBuffer) => {
  if (window.electronAPI) {
    return window.electronAPI.fileOperation({ operation, filename, fileData });
  }
  throw new Error('Electron API not available');
};

export default api;