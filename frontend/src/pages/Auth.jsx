import { useState, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { Eye, EyeClosed, WarningCircle, User, Buildings, CheckCircle, XCircle } from '@phosphor-icons/react';
import Logo from '../components/Logo';

const Auth = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(!isSignup);
  const [userType, setUserType] = useState('candidate');
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const appliedInitRef = useRef(null);
  if (appliedInitRef.current == null) {
    appliedInitRef.current = true;
    setIsLoginMode(!isSignup);
  }

  // Password strength checks
  const pwChecks = useMemo(() => {
    const pw = formData.user_password;
    return [
      { label: 'At least 8 characters', pass: pw.length >= 8 },
      { label: 'One uppercase letter', pass: /[A-Z]/.test(pw) },
      { label: 'One number', pass: /[0-9]/.test(pw) },
      { label: 'One special character', pass: /[^A-Za-z0-9]/.test(pw) },
    ];
  }, [formData.user_password]);

  const allPwValid = pwChecks.every(c => c.pass);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginMode && !allPwValid) {
      setError('Please meet all password requirements.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        const userData = await login(formData.user_email, formData.user_password);
        // Redirect based on profile state
        if (!userData.profile_completed) {
          navigate(`/onboarding/${userData.user_type}`);
        } else {
          navigate(userData.user_type === 'employer' ? '/employer' : '/dashboard');
        }
      } else {
        const userData = await signup(formData.user_name, formData.user_email, formData.user_password, userType);
        // New user → always go to onboarding
        navigate(`/onboarding/${userType}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1.5px solid rgba(26,11,46,0.1)',
    background: 'rgba(255,255,255,0.8)',
    fontSize: '0.95rem',
    color: 'var(--jw-dark)',
    outline: 'none',
    fontFamily: 'var(--font-outfit)',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Logo + Tagline */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <Logo size="xl" />
          </Link>
          <p className="font-outfit" style={{ color: '#6b7280', fontSize: '1rem' }}>
            {isLoginMode ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 md:p-10 rounded-[28px] border border-white/60 shadow-[0_12px_40px_rgba(26,11,46,0.10)]" style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}>

          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', padding: '4px', background: 'rgba(26,11,46,0.04)', borderRadius: '14px' }}>
            <button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className="font-outfit"
              style={{
                flex: 1, padding: '11px', borderRadius: '11px', border: 'none',
                background: isLoginMode ? 'var(--jw-dark)' : 'transparent',
                color: isLoginMode ? 'white' : '#9ca3af',
                fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className="font-outfit"
              style={{
                flex: 1, padding: '11px', borderRadius: '11px', border: 'none',
                background: !isLoginMode ? 'var(--jw-dark)' : 'transparent',
                color: !isLoginMode ? 'white' : '#9ca3af',
                fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* User Type Toggle - Sign Up only */}
          <AnimatePresence>
            {!isLoginMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: '20px' }}
              >
                <p className="font-outfit" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>I am a</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { key: 'candidate', label: 'Candidate', icon: User },
                    { key: 'employer', label: 'Employer', icon: Buildings },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setUserType(key)}
                      className="font-outfit"
                      style={{
                        flex: 1, padding: '12px', borderRadius: '14px',
                        border: userType === key ? '2px solid var(--jw-coral)' : '1.5px solid rgba(26,11,46,0.1)',
                        background: userType === key ? 'rgba(255,107,107,0.06)' : 'white',
                        color: userType === key ? 'var(--jw-coral)' : '#6b7280',
                        fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      }}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-outfit"
                style={{
                  padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
                  background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)',
                  color: '#C62828', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <WarningCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {/* Username - Sign Up only */}
            <AnimatePresence>
              {!isLoginMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: '16px' }}
                >
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    placeholder="Enter a unique username"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--jw-coral)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,107,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(26,11,46,0.1)'; e.target.style.boxShadow = 'none'; }}
                    required={!isLoginMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email - Both Modes */}
            <div style={{ marginBottom: '16px' }}>
              <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--jw-coral)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,107,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(26,11,46,0.1)'; e.target.style.boxShadow = 'none'; }}
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: !isLoginMode ? '16px' : '28px', position: 'relative' }}>
              <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.user_password}
                onChange={(e) => setFormData({ ...formData, user_password: e.target.value })}
                placeholder="Enter your password"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--jw-coral)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,107,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(26,11,46,0.1)'; e.target.style.boxShadow = 'none'; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '40px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye weight="duotone" size={18} />}
              </button>
            </div>

            {/* Password strength - Sign Up only */}
            <AnimatePresence>
              {!isLoginMode && formData.user_password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: '24px' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {pwChecks.map(c => (
                      <div key={c.label} className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: c.pass ? '#10B981' : '#9ca3af' }}>
                        {c.pass ? <CheckCircle size={13} /> : <XCircle weight="duotone" size={13} />}
                        {c.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-outfit"
              style={{
                width: '100%', padding: '15px', fontSize: '0.95rem', fontWeight: 700,
                borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'var(--jw-dark)', color: 'white',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Please wait...
                </>
              ) : isLoginMode ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {/* Toggle link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p className="font-outfit" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
                className="font-outfit"
                style={{ background: 'none', border: 'none', color: 'var(--jw-coral)', fontWeight: 700, cursor: 'pointer', marginLeft: '4px' }}
              >
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;