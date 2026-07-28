import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export const getSampleData = () => api.get('/api/sample-data');
export const getMetrics = () => api.get('/api/metrics');
export const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/api/upload', form);
};
export const analyzeData = (query, data_context) => api.post('/api/analyze', { query, data_context });
export const chatWithAgent = (message, conversation_history) => api.post('/api/chat', { message, conversation_history });
export const generateReport = (query) => api.post('/api/generate-report', { query });
