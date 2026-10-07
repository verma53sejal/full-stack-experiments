import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Backend API URL
  const API_URL = 'http://localhost:8080/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?page=${page}&size=${pageSize}&sort=id,desc`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setTasks(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, completed: false })
      });
      await response.json();
      setNewTaskTitle(''); 
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PUT'
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Stats for the current page
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <main className="app-container">
      <header className="header">
        <div className="brand-lockup">
          <div className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 5.5h11a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V7A1.5 1.5 0 0 1 8 5.5Z" />
              <path d="m9.5 12 1.7 1.7 3.8-4M3.5 4.5h11M3.5 8h1M3.5 11.5h1" />
            </svg>
          </div>
          <div>
            <h1 className="title">Student Task Manager</h1>
            <p className="subtitle">Stay organized. Get things done.</p>
          </div>
        </div>
        <div className="experiment-label" aria-label="Experiment 6: Scalable APIs and Caching">
          <span className="experiment-badge">Experiment 6</span>
          <span className="experiment-detail">Scalable APIs &amp; Caching</span>
        </div>
      </header>

      <section className="stats-container" aria-label="Task statistics">
        <div className="stat-box stat-total">
          <span className="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </span>
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-box stat-completed">
          <span className="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-box stat-pending">
          <span className="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
      </section>

      <section className="add-task-panel" aria-labelledby="add-task-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Make a little progress</p>
            <h2 id="add-task-heading">Add a new task</h2>
          </div>
        </div>
        <form onSubmit={handleAddTask} className="add-task-form">
          <div className="input-group">
            <label className="visually-hidden" htmlFor="new-task-title">Task title</label>
            <input
              id="new-task-title"
              type="text"
              className="task-input"
              placeholder="e.g. Complete Data Structures assignment"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
          </div>
          <button type="submit" className="add-button">
            <span aria-hidden="true">+</span> Add Task
          </button>
        </form>
      </section>

      <section className="tasks-section" aria-labelledby="tasks-heading">
        <div className="tasks-heading-row">
          <div>
            <h2 id="tasks-heading">Your Tasks</h2>
            <p className="tasks-description">Manage your assignments and daily work</p>
          </div>
          {!loading && tasks.length > 0 && (
            <span className="task-count-label">{tasks.length} on this page</span>
          )}
        </div>

        {loading ? (
          <div className="loading-container" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <p className="loading-text">Fetching tasks from H2 Database...</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon" aria-hidden="true">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="13" y="10" width="38" height="46" rx="7" />
                    <path d="M23 23h18M23 33h18M23 43h9" />
                    <path d="m39 44 4 4 8-9" />
                  </svg>
                </div>
                <h3>You're all caught up!</h3>
                <p className="empty-text">Add a task above to get started.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <article key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <button
                    type="button"
                    className="task-content"
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={`${task.completed ? 'Mark as pending' : 'Mark as completed'}: ${task.title}`}
                    onClick={() => handleToggleTask(task.id)}
                  >
                    <span className={`checkbox-wrapper ${task.completed ? 'checked' : ''}`} aria-hidden="true">
                      <span className="checkbox-inner">
                        {task.completed && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    </span>
                    <span className="task-info">
                      <span className="task-title">{task.title}</span>
                      <span className="task-meta">ID: #{task.id} <span aria-hidden="true">·</span> Backend Data</span>
                    </span>
                  </button>
                  <span className={`status-badge ${task.completed ? 'status-done' : 'status-pending'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete Task"
                    aria-label={`Delete task: ${task.title}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="trash-icon" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </article>
              ))
            )}

            {totalPages > 1 && (
              <nav className="pagination-container" aria-label="Task pages">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="page-button"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Prev
                </button>

                <div className="page-indicator" aria-current="page">
                  <span className="current-page">{page + 1}</span>
                  <span className="page-divider">/</span>
                  <span className="total-pages">{totalPages}</span>
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="page-button"
                >
                  Next
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </nav>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
