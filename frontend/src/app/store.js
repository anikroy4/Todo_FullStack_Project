import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import todoReducer from '../features/todos/todoSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
});
