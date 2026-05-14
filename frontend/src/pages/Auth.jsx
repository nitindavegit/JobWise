import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Briefcase, UserCheck } from 'lucide-react';

const Auth = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState(isSignup ? 'signup' : 'login');
  const [userType, setUserType] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userData;
      if (mode === 'login') {
        userData = await login(username, password);
      } else {
        userData = await signup(username, email, password, userType);
      }

      // Route based on user type
      if (userData.user_type === 'employer') {
        navigate('/employer');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'var(--mesh-bg)',
      backgroundColor: 'var(--jw-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'var(--jw-lavender)', opacity: 0.3, filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'var(--jw-peach)', opacity: 0.3, filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size="lg" />
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card" style={{
          padding: '44px 40px', borderRadius: '28px',
          boxShadow: '0 16px 64px rgba(26,11,46,0.08)',
        }}>
          {/* Title */}
          <h1 className="font-bricolage" style={{
            fontSize: '1.75rem', fontWeight: 800, color: 'var(--jw-dark)',
            textAlign: 'center', marginBottom: '8px',
          }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="font-outfit" style={{
            fontSize: '0.9rem', color: '#9ca3af', textAlign: 'center', marginBottom: '32px',
          }}>
            {mode === 'login'
              ? 'Sign in to access your personalized matches'
              : 'Start your AI-powered job matching journey'}
          </p>

          {/* User type selector (signup only) */}
          {mode === 'signup' && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
              marginBottom: '28px',
            }}>
              {[
                { type: 'candidate', icon: UserCheck, label: 'Candidate', desc: 'Find jobs' },
                { type: 'employer', icon: Briefcase, label: 'Employer', desc: 'Hire talent' },
              ].map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  style={{
                    padding: '16px', borderRadius: '16px', border: '2px solid',
                    borderColor: userType === type ? 'var(--jw-coral)' : 'rgba(26,11,46,0.08)',
                    background: userType === type ? 'rgba(255,107,107,0.06)' : 'transparent',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon
                    size={24}
                    color={userType === type ? 'var(--jw-coral)' : '#9ca3af'}
                    style={{ marginBottom: '8px' }}
                  />
                  <div className="font-bricolage" style={{
                    fontSize: '0.9rem', fontWeight: 700,
                    color: userType === type ? 'var(--jw-dark)' : '#6b7280',
                  }}>{label}</div>
                  <div className="font-outfit" style={{
                    fontSize: '0.7rem', color: '#9ca3af',
                  }}>{desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="font-outfit" style={{
              padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)',
              color: '#C62828', fontSize: '0.85rem', textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '16px' }}>
              <label className="font-outfit" style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--jw-dark)', marginBottom: '8px',
              }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#9ca3af" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                  className="font-outfit"
                  style={{
                    width: '100%', padding: '14px 14px 14px 44px',
                    borderRadius: '14px', border: '1.5px solid rgba(26,11,46,0.1)',
                    background: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                    color: 'var(--jw-dark)', outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--jw-coral)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}
                />
              </div>
            </div>

            {/* Email (signup only) */}
            {mode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label className="font-outfit" style={{
                  display: 'block', fontSize: '0.8rem', fontWeight: 600,
                  color: 'var(--jw-dark)', marginBottom: '8px',
                }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9ca3af" style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="font-outfit"
                    style={{
                      width: '100%', padding: '14px 14px 14px 44px',
                      borderRadius: '14px', border: '1.5px solid rgba(26,11,46,0.1)',
                      background: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                      color: 'var(--jw-dark)', outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--jw-coral)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label className="font-outfit" style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--jw-dark)', marginBottom: '8px',
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9ca3af" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="font-outfit"
                  style={{
                    width: '100%', padding: '14px 48px 14px 44px',
                    borderRadius: '14px', border: '1.5px solid rgba(26,11,46,0.1)',
                    background: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                    color: 'var(--jw-dark)', outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--jw-coral)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                  }}
                >
                  {showPassword
                    ? <EyeOff size={18} color="#9ca3af" />
                    : <Eye size={18} color="#9ca3af" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-coral font-outfit"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', fontSize: '1rem', opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <div style={{
                  width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,11,46,0.08)' }} />
            <span className="font-outfit" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,11,46,0.08)' }} />
          </div>

          {/* Toggle mode */}
          <p className="font-outfit" style={{
            textAlign: 'center', fontSize: '0.9rem', color: '#6b7280',
          }}>
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--jw-coral)', fontWeight: 700, fontSize: '0.9rem',
                    fontFamily: 'var(--font-outfit)',
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--jw-coral)', fontWeight: 700, fontSize: '0.9rem',
                    fontFamily: 'var(--font-outfit)',
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Back to home */}
        <p className="font-outfit" style={{
          textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: '#9ca3af',
        }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>
            ← Back to JobWise
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
