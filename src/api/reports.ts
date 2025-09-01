// frontend/src/api/reports.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://192.168.1.60:5000/api'; // your backend

// Create a new report
export const createReport = async (formData: FormData) => {
  const token = await getToken();
  if (!token) throw new Error('No auth token found');

  const response = await axios.post(`${API_URL}/reports`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get reports for logged-in user
export const getAllReports = async () => {
  const token = await getToken();
  if (!token) throw new Error('No auth token found');

  const response = await axios.get(`${API_URL}/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
