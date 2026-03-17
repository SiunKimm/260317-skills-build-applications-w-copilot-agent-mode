import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navigationItems = [
  { path: '/users', label: 'Users' },
  { path: '/teams', label: 'Teams' },
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts' },
];

function resolveCodespaceApiBaseUrl(codespaceName) {
  if (!codespaceName) {
    return '';
  }

  return `https://${codespaceName}-8000.app.github.dev/api`;
}

function resolveApiBaseUrl() {
  const configuredCodespaceName = process.env.REACT_APP_CODESPACE_NAME;

  if (configuredCodespaceName) {
    return resolveCodespaceApiBaseUrl(configuredCodespaceName);
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }

  const { hostname, protocol } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${hostname}:8000/api`;
  }

  if (hostname.includes('app.github.dev')) {
    const derivedCodespaceName = hostname.replace(
      /-\d+\.app\.github\.dev$/,
      ''
    );

    return resolveCodespaceApiBaseUrl(derivedCodespaceName);
  }

  return `${protocol}//${hostname}:8000/api`;
}

function App() {
  const apiBaseUrl = resolveApiBaseUrl();

  return (
    <div className="app-shell">
      <header className="card border-0 shadow-sm hero-card overflow-hidden mb-4">
        <div className="card-body p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="brand-mark mb-4">
                <img
                  className="brand-logo"
                  src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
                  alt="OctoFit app logo"
                />
                <div>
                  <div className="brand-title">OctoFit App</div>
                  <div className="brand-caption">Team fitness tracker dashboard</div>
                </div>
              </div>
              <p className="eyebrow mb-2">OctoFit Tracker</p>
              <h1 className="display-5 fw-semibold mb-3">
                Bootstrap 기반 OctoFit 대시보드
              </h1>
              <p className="hero-description mb-4">
                각 화면은 Django REST API의 users, teams, activities,
                leaderboard, workouts 엔드포인트를 직접 조회하고,
                일관된 Bootstrap 테이블과 모달 인터페이스로 보여줍니다.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <a className="btn btn-primary btn-lg" href={`${apiBaseUrl}/users/`}>
                  Users API 열기
                </a>
                <a className="btn btn-outline-secondary btn-lg" href={apiBaseUrl}>
                  API 루트 보기
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card api-summary-card border-0 shadow-sm">
                <div className="card-body">
                  <span className="api-panel-label d-block mb-2">Backend API</span>
                  <strong className="d-block api-url mb-3">{apiBaseUrl}</strong>
                  <p className="small mb-0 text-secondary">
                    로컬 환경에서는 localhost:8000, Codespaces 환경에서는
                    8000 포트를 사용하도록 자동으로 전환합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="card border-0 shadow-sm nav-card mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
            <div>
              <h2 className="h4 mb-1">메인 네비게이션</h2>
              <p className="text-secondary mb-0">
                모든 리소스 화면은 동일한 Bootstrap 기반 탐색과 데이터 표를 사용합니다.
              </p>
            </div>
          </div>

          <nav aria-label="OctoFit sections">
            <div className="nav nav-pills flex-column flex-md-row gap-2 primary-nav">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active fw-semibold' : 'nav-link fw-semibold'
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
          <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
          <Route
            path="/activities"
            element={<Activities apiBaseUrl={apiBaseUrl} />}
          />
          <Route
            path="/leaderboard"
            element={<Leaderboard apiBaseUrl={apiBaseUrl} />}
          />
          <Route
            path="/workouts"
            element={<Workouts apiBaseUrl={apiBaseUrl} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
