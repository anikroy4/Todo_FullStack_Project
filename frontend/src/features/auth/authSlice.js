import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authApi from './authApi';
import { setToken } from '../../api';

// Safe parse localStorage
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('todo_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem('todo_token') || null;

export const registration = createAsyncThunk(
  'auth/registration',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.registration(data);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      if (res.data?.accessToken) {
        setToken(res.data.accessToken);
        localStorage.setItem('todo_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Login failed. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch (e) {
    // ignore
  } finally {
    setToken(null);
    localStorage.removeItem('todo_user');
  }
});

export const verify = createAsyncThunk(
  'auth/verify',
  async (token, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyEmail(token);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Email verification failed or link expired.';
      return rejectWithValue(message);
    }
  }
);

export const forgot = createAsyncThunk(
  'auth/forgot',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.forgotPassword(data);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Failed to send reset link.';
      return rejectWithValue(message);
    }
  }
);

export const reset = createAsyncThunk(
  'auth/reset',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await authApi.resetPassword(token, data);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Failed to reset password. Link may be expired.';
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getSavedUser(),
    accessToken: initialToken,
    loading: false,
    error: null,
    message: null,
    verifyLink: null,
    resetLink: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.verifyLink = null;
      state.resetLink = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Login successful';
        state.user = action.payload?.user || null;
        state.accessToken = action.payload?.accessToken || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // REGISTRATION
      .addCase(registration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.verifyLink = null;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.verifyLink = action.payload?.verifyLink || null;
      })
      .addCase(registration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // VERIFY
      .addCase(verify.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(verify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Verification failed';
      })

      // FORGOT
      .addCase(forgot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.resetLink = null;
      })
      .addCase(forgot.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.resetLink = action.payload?.resetLink || null;
      })
      .addCase(forgot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send reset email';
      })

      // RESET
      .addCase(reset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(reset.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(reset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
        state.message = null;
      });
  },
});

export const { clearError, clearMessage, setUser } = authSlice.actions;
export default authSlice.reducer;
