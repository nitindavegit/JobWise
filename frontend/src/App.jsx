import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { RequireAuth, RequireProfile, GuestOnly } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import CandidateOnboarding from './pages/CandidateOnboarding';
import EmployerOnboarding from './pages/EmployerOnboarding';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import JobDetail from './pages/JobDetail';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/job/:jobId" element={<JobDetail />} />

            {/* Guest only — redirect if already logged in */}
            <Route path="/login" element={<GuestOnly><Auth /></GuestOnly>} />
            <Route path="/signup" element={<GuestOnly><Auth isSignup /></GuestOnly>} />

            {/* Onboarding — requires login */}
            <Route path="/onboarding/candidate" element={<RequireAuth><CandidateOnboarding /></RequireAuth>} />
            <Route path="/onboarding/employer" element={<RequireAuth><EmployerOnboarding /></RequireAuth>} />

            {/* Dashboards — requires login + profile + correct role */}
            <Route path="/dashboard" element={<RequireProfile role="candidate"><CandidateDashboard /></RequireProfile>} />
            <Route path="/employer" element={<RequireProfile role="employer"><EmployerDashboard /></RequireProfile>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;