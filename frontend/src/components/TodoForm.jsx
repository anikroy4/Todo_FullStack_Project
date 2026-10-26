import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodoThunk } from '../features/todos/todoSlice';

const TodoForm = () => {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.todos);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await dispatch(
      addTodoThunk({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
      })
    );

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-sm transition-all focus-within:border-zinc-400 focus-within:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-zinc-400 text-lg select-none pl-1">＋</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task... (press Enter to save)"
          className="w-full text-zinc-900 placeholder-zinc-400 text-sm sm:text-base outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!title.trim() || actionLoading}
          className="shrink-0 text-xs sm:text-sm font-medium px-4 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {actionLoading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col gap-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add optional notes or description..."
            rows={2}
            className="w-full text-xs sm:text-sm text-zinc-700 placeholder-zinc-400 outline-none resize-none bg-zinc-50/60 p-2.5 rounded-lg border border-zinc-200/60 focus:bg-white focus:border-zinc-300 transition"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Priority Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium">Priority:</span>
              <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 bg-zinc-50">
                {['low', 'medium', 'high'].map((p) => {
                  const active = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`capitalize px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                        active
                          ? p === 'high'
                            ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                            : p === 'medium'
                            ? 'bg-amber-50 text-amber-700 font-semibold shadow-xs'
                            : 'bg-white text-zinc-800 font-semibold shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date & Collapse */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <span>Due:</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-zinc-700 outline-none focus:border-zinc-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-zinc-400 hover:text-zinc-700 px-2 py-1 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;

