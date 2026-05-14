import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import CandidateOnboarding from './pages/CandidateOnboarding';
import EmployerOnboarding from './pages/EmployerOnboarding';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth isSignup />} />
          <Route path="/onboarding/candidate" element={<CandidateOnboarding />} />
          <Route path="/onboarding/employer" element={<EmployerOnboarding />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;