import api from './axios';

export const createInterview = async (setup) => {
  const { data } = await api.post('/interviews', setup);
  return data.interview;
};

export const submitAnswer = async (interviewId, answer) => {
  const { data } = await api.post(`/interviews/${interviewId}/answer`, { answer });
  return data;
};

export const getInterview = async (interviewId) => {
  const { data } = await api.get(`/interviews/${interviewId}`);
  return data.interview;
};

export const getHistory = async () => {
  const { data } = await api.get('/interviews');
  return data.interviews;
};
