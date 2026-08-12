import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    login(form)
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        setError(authError || 'Invalid credentials, please try again.');
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ padding: '1.5rem' }}>
        <div className="auth-card__header">
          <div>
            <p className="eyebrow">College Practical</p>
            <h1>JWT & RBAC Demo</h1>
            <p className="muted">Login to access the project dashboard and post management.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="input-field"
            />
          </label>
          <label className="form-label">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field"
            />
          </label>

          {(error || authError) && <div className="alert alert-error">{error || authError}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        {/* Footer removed to keep the login card compact per requested UI update */}
      </div>
    </div>
  );
}

export default Login;
