import { useAuth } from '../context/AuthContext';
import { getPermissionsSummary, permissionLabel } from '../utils/permissions';

function Dashboard() {
  const { currentUser } = useAuth();
  const summary = getPermissionsSummary(currentUser?.role);

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Project Overview</p>
          <h1>Welcome, {currentUser?.name}</h1>
          <p className="muted">You are signed in as <strong>{currentUser?.email}</strong>.</p>
        </div>
        <div className="dashboard-badge-panel">
          <span className="role-badge role-badge--large">{currentUser?.role}</span>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card summary-card--welcome">
          <h2>Welcome to your dashboard</h2>
          <p>
            Use the links above to manage posts and review your role-based permissions. This project demonstrates
            frontend-only JWT simulation and RBAC authorization.
          </p>
        </div>

        <div className="summary-card">
          <h3>Permissions summary</h3>
          <div className="permission-list">
            {summary.map(item => (
              <div key={item.permission} className="permission-row">
                <span>{permissionLabel(item.permission)}</span>
                <span className={item.allowed ? 'status status-success' : 'status status-failed'}>
                  {item.allowed ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
