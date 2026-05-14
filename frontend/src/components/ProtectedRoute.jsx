import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Requires login — redirects to /login if not authenticated
export const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Requires login + completed profile — redirects to onboarding if needed
export const RequireProfile = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role guard
  if (role && user.user_type !== role) {
    return <Navigate to={user.user_type === 'employer' ? '/employer' : '/dashboard'} replace />;
  }

  // Profile not completed → onboarding
  if (!user.profile_completed) {
    return <Navigate to={`/onboarding/${user.user_type}`} replace />;
  }

  return children;
};

// Redirect logged-in users away from login/signup pages
export const GuestOnly = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (!user.profile_completed) {
      return <Navigate to={`/onboarding/${user.user_type}`} replace />;
    }
    return <Navigate to={user.user_type === 'employer' ? '/employer' : '/dashboard'} replace />;
  }
  return children;
};
