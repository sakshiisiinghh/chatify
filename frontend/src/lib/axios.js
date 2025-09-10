import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api', // Replace with your backend API
    withCredentials: true, // Include cookies in requests
}); 