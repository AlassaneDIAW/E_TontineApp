// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Thunks pour les opérations asynchrones
export const loginUser = createAsyncThunk(
    'auth/login',
    async({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async(userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/profile',
    async(_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await api.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                localStorage.setItem('token', action.payload.token);
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                localStorage.removeItem('token');
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.user = null;
                state.error = action.payload ? .message || 'Échec de la connexion';
            })

        // Register
        .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ? .message || "Échec de l'inscription";
            })

        // Fetch Profile
        .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                localStorage.removeItem('token');
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.user = null;
                state.error = action.payload ? .message || 'Session expirée';
            });
    },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;