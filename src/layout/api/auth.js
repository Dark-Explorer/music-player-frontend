// src/services/auth.service.js
import axios from 'axios';
import router from '@/router';
import { hasRole } from '@/utils/jwtUtils';

const API_URL = 'http://localhost:1208/music/auth/';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + 'token', {
                username,
                password
            })
            .then(response => {
                if (response.data.code === 200 && response.data.result.token) {
                    localStorage.setItem('token', response.data.result.token);
                }
                return response.data;
            });
    }

    logout() {
        const token = localStorage.getItem('token');
        if (token) {
            return axios
                .post(API_URL + 'logout', { token })
                .then(() => {
                    localStorage.removeItem('token');
                });
        }
        return Promise.resolve();
    }

    checkTokenValidity() {
        const token = localStorage.getItem('token');
        if (token) {
            return axios
                .post(API_URL + 'introspect', { token })
                .then(response => {
                    return response.data.code === 200 && response.data.result.valid;
                });
        }
        return Promise.resolve(false);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    checkRole(requiredRole) {
        const token = localStorage.getItem('token');
        return !!hasRole(token, requiredRole);
    }
}

export default new AuthService();
