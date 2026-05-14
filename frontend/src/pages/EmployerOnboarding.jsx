import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Logo from '../components/Logo';
import {
  Building2, FileText, ArrowRight, CheckCircle,
} from 'lucide-react';

const EmployerOnboarding = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.patch('/employer/update-profile', {
        company_name: companyName.trim(),
        company_description: companyDescription.trim(),
      });

      // Update user in localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.profile_completed = true;
      localStorage.setItem('user', JSON.stringify(stored));

      navigate('/employer');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'var(--mesh-bg)',
      backgroundColor: 'var(--jw-bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'var(--jw-lavender)', opacity: 0.25, filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-40px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'var(--jw-peach)', opacity: 0.25, filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '520px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="glass-card" style={{
          padding: '44px 40px', borderRadius: '28px',
          boxShadow: '0 16px 64px rgba(26,11,46,0.08)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(26,11,46,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Building2 size={28} color="var(--jw-dark)" />
            </div>
            <h2 className="font-bricolage" style={{
              fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)',
              marginBottom: '8px',
            }}>Set up your company</h2>
            <p className="font-outfit" style={{
              fontSize: '0.9rem', color: '#9ca3af',
            }}>
              Tell candidates about your company so they know who&apos;s hiring.
            </p>
          </div>

          {/* Error */}
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
            {/* Company Name */}
            <div style={{ marginBottom: '20px' }}>
              <label className="font-outfit" style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--jw-dark)', marginBottom: '8px',
              }}>Company Name *</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="#9ca3af" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                }} />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TechCorp Inc."
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

            {/* Company Description */}
            <div style={{ marginBottom: '28px' }}>
              <label className="font-outfit" style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--jw-dark)', marginBottom: '8px',
              }}>Company Description</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} color="#9ca3af" style={{
                  position: 'absolute', left: '14px', top: '16px',
                }} />
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Tell candidates what your company does, your culture, and what makes you a great place to work..."
                  rows={4}
                  className="font-outfit"
                  style={{
                    width: '100%', padding: '14px 14px 14px 44px',
                    borderRadius: '14px', border: '1.5px solid rgba(26,11,46,0.1)',
                    background: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                    color: 'var(--jw-dark)', outline: 'none', resize: 'vertical',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'var(--font-outfit)',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--jw-coral)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}
                />
              </div>
            </div>

            {/* Submit */}
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
                  <CheckCircle size={18} /> Complete Setup
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerOnboarding;
