import axios from 'axios'



// Create an Axios instance
const api = axios.create({
    baseURL: 'https://localhost:7026/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Get the token (for example, from localStorage or any other secure storage)
        const token = localStorage.getItem('token');  // Or get it dynamically from your app state
        // If there's a token, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;