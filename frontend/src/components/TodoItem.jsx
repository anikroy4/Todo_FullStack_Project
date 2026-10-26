import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  toggleTodoThunk,
  deleteTodoThunk,
  updateTodoThunk,
} from '../features/todos/todoSlice';

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? todo.dueDate.substring(0, 10) : ''
  );

  const handleToggle = () => {
    dispatch(toggleTodoThunk(todo._id));
  };

  const handleDelete = () => {
    dispatch(deleteTodoThunk(todo._id));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    dispatch(
      updateTodoThunk({
        id: todo._id,
        data: {
          title: editTitle.trim(),
          description: editDesc.trim(),
          priority: editPriority,
          dueDate: editDueDate || null,
        },
      })
    );
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(todo.dueDate ? todo.dueDate.substring(0, 10) : '');
    setIsEditing(false);
  };

  // Due date formatting
  let dueDateText = null;
  let isOverdue = false;
  if (todo.dueDate) {
    const due = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 && !todo.completed) {
      isOverdue = true;
      dueDateText = `${Math.abs(diffDays)}d overdue`;
    } else if (diffDays === 0) {
      dueDateText = 'Due today';
    } else if (diffDays === 1) {
      dueDateText = 'Tomorrow';
    } else {
      dueDateText = due.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  // Priority color config
  const priorityStyles = {
    high: 'text-rose-700 bg-rose-50 border-rose-200/60',
    medium: 'text-amber-700 bg-amber-50 border-amber-200/60',
    low: 'text-zinc-600 bg-zinc-100 border-zinc-200/60',
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSaveEdit}
        className="p-4 bg-white border border-zinc-300 rounded-xl shadow-sm flex flex-col gap-3"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          required
          className="text-sm font-medium text-zinc-900 border-b border-zinc-200 pb-1 outline-none focus:border-zinc-800"
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Notes..."
          rows={2}
          className="text-xs text-zinc-600 bg-zinc-50 p-2 rounded border border-zinc-200 outline-none resize-none focus:bg-white"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
          <div className="flex items-center gap-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded px-2 py-1 text-xs text-zinc-700 outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded px-2 py-1 text-xs text-zinc-700 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-2.5 py-1 text-zinc-500 hover:text-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`group relative flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
        todo.completed
          ? 'bg-zinc-50/70 border-zinc-200/60'
          : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-xs'
      }`}
    >
      {/* Left: Checkbox & Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Custom Minimal Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            todo.completed
              ? 'bg-zinc-900 border-zinc-900 text-white'
              : 'border-zinc-300 hover:border-zinc-500 bg-white'
          }`}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed && (
            <svg
              className="w-3 h-3 stroke-current stroke-2 fill-none"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Text info */}
        <div className="flex-1 min-w-0">
          <p
            onClick={handleToggle}
            className={`text-sm sm:text-base font-normal wrap-break-words cursor-pointer select-none transition ${
              todo.completed
                ? 'line-through text-zinc-400'
                : 'text-zinc-900 font-medium'
            }`}
          >
            {todo.title}
          </p>

          {todo.description && (
            <p
              className={`text-xs mt-1 wrap-break-words line-clamp-2 leading-relaxed ${
                todo.completed ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Badges / Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full border ${
                priorityStyles[todo.priority] || priorityStyles.medium
              }`}
            >
              {todo.priority}
            </span>

            {/* Due Date Badge */}
            {dueDateText && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${
                  isOverdue
                    ? 'text-rose-600 bg-rose-50 border-rose-200 font-semibold'
                    : 'text-zinc-500 bg-zinc-50 border-zinc-200'
                }`}
              >
                <svg
                  className="w-3 h-3 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {dueDateText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          title="Edit task"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 stroke-current fill-none stroke-2"
            viewBox="0 0 24 24"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          onClick={handleDelete}
          title="Delete task"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 stroke-current fill-none stroke-2"
            viewBox="0 0 24 24"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
