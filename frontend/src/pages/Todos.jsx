import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import {
  getTodosThunk,
  setFilter,
  setSearch,
  setSort,
  clearCompletedThunk,
} from '../features/todos/todoSlice';
import { debounce } from '../utils/debounce';

const Todos = () => {
  const dispatch = useDispatch();
  const { items, stats, loading, filter, search, sort, error } = useSelector(
    (state) => state.todos
  );
  const { user } = useSelector((state) => state.auth);
  const debouncedSearchRef = useRef(null);

  // Initialize debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce((searchValue) => {
      dispatch(getTodosThunk({ status: filter, search: searchValue, sort }));
    }, 500);
  }, [dispatch, filter, sort]);

  // Fetch todos when filter or sort changes
  useEffect(() => {
    dispatch(getTodosThunk({ status: filter, search, sort }));
  }, [dispatch, filter, sort]);

  // Handle search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setSearch(value));
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getTodosThunk({ status: filter, search, sort }));
  };

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to remove all completed tasks?')) {
      dispatch(clearCompletedThunk());
    }
  };

  // Filter items in memory if search is local or fetch
  const displayedItems = items.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const percentComplete =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header Greeting & Progress Summary */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">
              {todayFormatted}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Welcome back{user?.username ? `, ${user.username}` : ''}
            </h1>
          </div>

          {/* Quick stats & progress */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-2 min-w-60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-500">Progress</span>
              <span className="font-semibold text-zinc-900">
                {stats.completed} of {stats.total} tasks ({percentComplete}%)
              </span>
            </div>
            {/* Minimal Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
              <span>{stats.active} pending</span>
              <span>{stats.completed} completed</span>
            </div>
          </div>
        </div>

        {/* New Todo Input Card */}
        <TodoForm />

        {/* Filter, Search & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Tabs: All / Active / Completed */}
          <div className="inline-flex rounded-xl bg-zinc-100/90 p-1 border border-zinc-200/60 self-start">
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'active', label: 'Active', count: stats.active },
              { id: 'completed', label: 'Completed', count: stats.completed },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setFilter(tab.id))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? 'bg-zinc-100 text-zinc-800 font-bold'
                        : 'bg-zinc-200/60 text-zinc-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search tasks..."
                className="bg-white border border-zinc-200/90 text-xs rounded-xl pl-8 pr-7 py-2 text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 w-44 sm:w-56"
              />
              <svg
                className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400 stroke-current fill-none stroke-2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setSearch(''));
                    dispatch(getTodosThunk({ status: filter, search: '', sort }));
                  }}
                  className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Sort Selector */}
            <select
              value={sort}
              onChange={(e) => dispatch(setSort(e.target.value))}
              className="bg-white border border-zinc-200/90 text-xs rounded-xl px-2.5 py-2 text-zinc-700 outline-none cursor-pointer focus:border-zinc-400"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
            </select>

            {/* Clear Completed */}
            {stats.completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-xs text-zinc-400 hover:text-rose-600 px-2 py-2 transition cursor-pointer"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {/* Todo Items List */}
        <div className="flex flex-col gap-2.5">
          {loading && items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
              <p className="text-xs">Loading tasks...</p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="bg-white border border-dashed border-zinc-200 rounded-2xl py-14 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 text-xl mb-3">
                {filter === 'completed' ? '✓' : '✧'}
              </div>
              <h3 className="text-sm font-semibold text-zinc-800">
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'All tasks completed!'
                  : 'No tasks found'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                {filter === 'completed'
                  ? 'Complete your active tasks to view them archived here.'
                  : filter === 'active'
                  ? 'Great job! You have cleared all pending tasks.'
                  : 'Type a task above and press Enter to begin.'}
              </p>
            </div>
          ) : (
            displayedItems.map((todo) => <TodoItem key={todo._id} todo={todo} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default Todos;
