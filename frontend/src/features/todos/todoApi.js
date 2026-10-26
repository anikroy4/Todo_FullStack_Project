import api from '../../api';

export const fetchTodos = (params) => {
  return api.get('/todos', { params });
};

export const createTodo = (data) => {
  return api.post('/todos', data);
};

export const updateTodo = (id, data) => {
  return api.put(`/todos/${id}`, data);
};

export const toggleTodo = (id) => {
  return api.patch(`/todos/${id}/toggle`);
};

export const deleteTodo = (id) => {
  return api.delete(`/todos/${id}`);
};

export const clearCompleted = () => {
  return api.delete('/todos/clear-completed');
};

