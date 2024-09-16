// src/services/api.js
import axios from 'axios';
import AuthService from '@/layout/api/auth';

const api = axios.create({
    baseURL: 'http://localhost:1208/music', // adjust this to your API URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = AuthService.getToken();
        if (token) {
            const isValid = await AuthService.checkTokenValidity();
            if (isValid) {
                config.headers['Authorization'] = 'Bearer ' + token;
            } else {
                AuthService.logout();
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
