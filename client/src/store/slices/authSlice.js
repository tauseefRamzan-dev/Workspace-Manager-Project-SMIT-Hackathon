import { createSlice } from '@reduxjs/toolkit';

const MOCK_USERS = [
  {
    id: 'user-1',
    name: 'Tauseef',
    email: 'tauseef@workspace.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: 'user-2',
    name: 'Muneeb',
    email: 'muneeb.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    id: 'user-3',
    name: 'Hassan',
    email: 'hassan@workspace.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
  },
  {
    id: 'user-4',
    name: 'Testing User',
    email: 'testing@gmail.com',
    password: 'testing123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Testing',
  },
  {
    id: 'user-5',
    name: 'Demo Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
];

const initialState = {
  isAuthenticated: false,
  currentUser: null,
  users: MOCK_USERS,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.loading = false;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    updateProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
      }
    },
    switchUser: (state, action) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        state.currentUser = { ...user };
        state.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
      }
    },
    signupUser: (state, action) => {
      const { name, email, password } = action.payload;
      if (state.users.some(user => user.email === email)) {
        state.error = 'An account with this email already exists';
        return;
      }
      const user = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };
      state.users.push(user);
      state.currentUser = user;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(user));
    },
    hydrateAuth: (state, action) => {
      const user = action.payload;
      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  updateProfile,
  switchUser,
  signupUser,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;

export const loginUser = (email, password) => (dispatch) => {
  dispatch(loginStart());
  
  return new Promise((resolve) => setTimeout(() => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      dispatch(loginSuccess(user));
      resolve(true);
    } else {
      dispatch(loginFailed('Invalid email or password'));
      resolve(false);
    }
  }, 500));
};
