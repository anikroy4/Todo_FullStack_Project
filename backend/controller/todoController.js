const mongoose = require('mongoose');
const Todo = require('../model/todoModel');

// @desc    Get all todos for logged in user
// @route   GET /api/todos
const getTodos = async (req, res) => {
  try {
    const { status, priority, search, sort } = req.query;
    const query = { user: req.user._id };

    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sort === 'priority') {
      sortOption = { priority: 1, createdAt: -1 };
    }

    const todos = await Todo.find(query).sort(sortOption);

    const totalCount = await Todo.countDocuments({ user: req.user._id });
    const completedCount = await Todo.countDocuments({
      user: req.user._id,
      completed: true,
    });
    const activeCount = totalCount - completedCount;

    res.json({
      success: true,
      todos,
      stats: {
        total: totalCount,
        completed: completedCount,
        active: activeCount,
      },
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = new Todo({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.user._id,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: savedTodo,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = Boolean(completed);
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate || null;

    const updatedTodo = await todo.save();
    res.json({
      success: true,
      message: 'Todo updated successfully',
      todo: updatedTodo,
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// @desc    Toggle todo completed status
// @route   PATCH /api/todos/:id/toggle
const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();

    res.json({
      success: true,
      message: `Todo marked as ${updatedTodo.completed ? 'completed' : 'active'}`,
      todo: updatedTodo,
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo status' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// @desc    Clear all completed todos
// @route   DELETE /api/todos/clear-completed
const clearCompletedTodos = async (req, res) => {
  try {
    const result = await Todo.deleteMany({
      user: req.user._id,
      completed: true,
    });

    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} completed todos`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({ error: 'Failed to clear completed todos' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompletedTodos,
};
