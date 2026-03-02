import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Response error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const getProblems = (domain = null, difficulty = null) => {
  const params = {};
  if (domain) params.domain = domain;
  if (difficulty) params.difficulty = difficulty;
  return api.get('/problems', { params });
};

export const getProblem = (problemId) => api.get(`/problems/${problemId}`);

export const createProblem = (data) => api.post('/problems', data);

export const solveBaseline = (problemText, domain = null) => {
  const params = { problem_text: problemText };
  if (domain) params.domain = domain;
  return api.post('/solve/baseline', null, { params });
};

export const solveImproved = (problemText, expectedAnswer = null) => {
  const params = { problem_text: problemText };
  if (expectedAnswer !== null && expectedAnswer !== undefined) {
    params.expected_answer = expectedAnswer;
  }
  return api.post('/solve/improved', null, { params });
};

export const solveCustom = (problemId = null, problemText = null, useImproved = true) => {
  const params = { use_improved: useImproved };
  if (problemId) params.problem_id = problemId;
  if (problemText) params.problem_text = problemText;
  return api.post('/solve/custom', null, { params });
};

export const runExperiment = (name, description = null, domain = null, difficulty = null) => {
  const params = { name };
  if (description) params.description = description;
  if (domain) params.domain = domain;
  if (difficulty) params.difficulty = difficulty;
  return api.post('/experiments/run', null, { params });
};

export const getExperiments = () => api.get('/experiments');

export const getExperiment = (experimentId) => api.get(`/experiments/${experimentId}`);

export const getComparisonAnalysis = () => api.get('/analysis/comparison');

export const getStats = () => api.get('/stats');

export const getHealth = () => axios.get('http://localhost:8000/health', { timeout: 5000 });

export const getLogs = (limit = 100) => api.get('/logs', { params: { limit } });

export default api;
