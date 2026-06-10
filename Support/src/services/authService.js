import axios from 'axios';

const TOKEN_KEY = 'support-token';
const USER_KEY = 'support-user';

const apiClient = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
        }

        return Promise.reject(error);
    },
);

const saveSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const login = async (email, password) => {
    try {
        const { data } = await apiClient.post('/auth/login', {
            username: email.trim(),
            password,
        });

        if (!data?.token) {
            throw new Error('Authentication failed. Please try again.');
        }

        const user = {
            id: data.id ?? 'demo-user',
            name: data.firstName ? `${data.firstName} ${data.lastName ?? ''}`.trim() : data.username ?? email.trim(),
            email: data.email ?? email.trim(),
            image: data.image ?? '',
        };

        saveSession(data.token, user);

        return { user, token: data.token };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Unable to sign in right now. Please try again.';

        throw new Error(message);
    }
};

const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
    } catch {
        return null;
    }
};

const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));

export { apiClient, login, logout, getStoredUser, isAuthenticated };
