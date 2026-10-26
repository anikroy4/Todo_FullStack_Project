import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import Registration from './pages/Registration';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Todos from './pages/Todos';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { useToast } from './context/ToastContext';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Todos />} />
          </Route>

          {/* Public-Only Auth Routes (redirect to / if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/registration" element={<Registration />} />
          </Route>

          {/* General Public Routes */}
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Container */}
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto mb-2">
              <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
