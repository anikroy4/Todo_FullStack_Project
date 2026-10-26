const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompletedTodos,
} = require('../controller/todoController');
const { protect } = require('../middleware/authMiddleware');

// All todo routes require authentication
router.use(protect);

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.delete('/clear-completed', clearCompletedTodos);

router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);

module.exports = router;

