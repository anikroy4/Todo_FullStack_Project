import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as todoApi from './todoApi';

export const getTodosThunk = createAsyncThunk(
  'todos/getTodos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await todoApi.fetchTodos(params);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to load todos'
      );
    }
  }
);

export const addTodoThunk = createAsyncThunk(
  'todos/addTodo',
  async (data, { rejectWithValue }) => {
    try {
      const res = await todoApi.createTodo(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to add todo'
      );
    }
  }
);

export const updateTodoThunk = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await todoApi.updateTodo(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update todo'
      );
    }
  }
);

export const toggleTodoThunk = createAsyncThunk(
  'todos/toggleTodo',
  async (id, { rejectWithValue }) => {
    try {
      const res = await todoApi.toggleTodo(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to toggle status'
      );
    }
  }
);

export const deleteTodoThunk = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await todoApi.deleteTodo(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete todo'
      );
    }
  }
);

export const clearCompletedThunk = createAsyncThunk(
  'todos/clearCompleted',
  async (_, { rejectWithValue }) => {
    try {
      const res = await todoApi.clearCompleted();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to clear completed todos'
      );
    }
  }
);

export const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    stats: {
      total: 0,
      completed: 0,
      active: 0,
    },
    loading: false,
    actionLoading: false,
    error: null,
    filter: 'all', // 'all' | 'active' | 'completed'
    search: '',
    sort: 'newest', // 'newest' | 'dueDate' | 'priority'
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    clearTodoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET TODOS
      .addCase(getTodosThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.todos || [];
        state.stats = action.payload?.stats || {
          total: 0,
          completed: 0,
          active: 0,
        };
      })
      .addCase(getTodosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TODO
      .addCase(addTodoThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addTodoThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload?.todo) {
          state.items.unshift(action.payload.todo);
          state.stats.total += 1;
          state.stats.active += 1;
        }
      })
      .addCase(addTodoThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // UPDATE TODO
      .addCase(updateTodoThunk.fulfilled, (state, action) => {
        if (action.payload?.todo) {
          const index = state.items.findIndex(
            (t) => t._id === action.payload.todo._id
          );
          if (index !== -1) {
            state.items[index] = action.payload.todo;
          }
        }
      })

      // TOGGLE TODO
      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        if (action.payload?.todo) {
          const updated = action.payload.todo;
          const index = state.items.findIndex((t) => t._id === updated._id);
          if (index !== -1) {
            state.items[index] = updated;
          }
          // Recount stats
          const total = state.items.length;
          const completed = state.items.filter((t) => t.completed).length;
          state.stats = {
            total,
            completed,
            active: total - completed,
          };
        }
      })

      // DELETE TODO
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        const id = action.payload;
        const target = state.items.find((t) => t._id === id);
        state.items = state.items.filter((t) => t._id !== id);
        if (target) {
          state.stats.total = Math.max(0, state.stats.total - 1);
          if (target.completed) {
            state.stats.completed = Math.max(0, state.stats.completed - 1);
          } else {
            state.stats.active = Math.max(0, state.stats.active - 1);
          }
        }
      })

      // CLEAR COMPLETED
      .addCase(clearCompletedThunk.fulfilled, (state) => {
        state.items = state.items.filter((t) => !t.completed);
        state.stats.completed = 0;
        state.stats.total = state.items.length;
        state.stats.active = state.items.length;
      });
  },
});

export const { setFilter, setSearch, setSort, clearTodoError } =
  todoSlice.actions;
export default todoSlice.reducer;

