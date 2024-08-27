import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1208/music/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
