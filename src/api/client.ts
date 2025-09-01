import axios from 'axios';
import { API_URL } from '../utils/config'; // import from config.ts

const client = axios.create({
  baseURL: API_URL, // now uses your production backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
