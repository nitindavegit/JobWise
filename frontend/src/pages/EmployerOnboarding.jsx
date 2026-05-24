import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';
import Logo from '../components/Logo';
import { Building, Signature, SealCheck, ArrowRight, ArrowLeft, User } from '@phosphor-icons/react';
import { useAuth } from '../context/useAuth';

const EmployerOnboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [step, setStep] = useState(1); // 1 = name, 2 = company
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    border: '1.5px solid rgba(26,11,46,0.1)', background: 'rgba(255,255,255,0.8)',
    fontSize: '0.95rem', color: 'var(--jw-dark)', outline: 'none',
    fontFamily: 'var(--font-outfit)', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const focusStyle = (e) => { e.target.style.borderColor = 'var(--jw-coral)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,107,0.1)'; };
  const blurStyle = (e) => { e.target.style.borderColor = 'rgba(26,11,46,0.1)'; e.target.style.boxShadow = 'none'; };

  const handleSubmit = async () => {
    if (!companyName.trim()) { setError('Company name is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const birdIndex = Math.floor(Math.random() * 6) + 1;
      const generatedPic = `/avatars/bird${birdIndex}.png`;

      await apiClient.patch('/employer/update-profile', {
        first_name: firstName || null,
        last_name: lastName || null,
        profile_picture_url: generatedPic,
        company_name: companyName.trim(),
        company_description: companyDescription.trim(),
      });

      updateUser({ profile_completed: true, first_name: firstName, last_name: lastName, profile_picture_url: generatedPic });
      navigate('/employer');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndicator = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
      {[1, 2].map(s => (
        <div key={s} style={{
          width: s === step ? '32px' : '10px', height: '10px', borderRadius: '9999px',
          background: s <= step ? 'var(--jw-coral)' : 'rgba(26,11,46,0.1)',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', backgroundImage: 'var(--mesh-bg)', backgroundColor: 'var(--jw-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--jw-lavender)', opacity: 0.25, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--jw-peach)', opacity: 0.25, filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/"><Logo size="xl" /></Link>
        </div>

        <div className="jw-form-card" style={{
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)'
        }}>
          {stepIndicator}

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#C62828', fontSize: '0.85rem' }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: Name */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,107,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <User weight="duotone" size={28} color="var(--jw-coral)" />
                </div>
                <h2 className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>What's your name?</h2>
                <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Tell us about yourself first.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <button onClick={() => setStep(2)} className="font-outfit" style={{
                width: '100%', padding: '15px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '14px',
                border: 'none', cursor: 'pointer', background: 'var(--jw-dark)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                Continue <ArrowRight weight="duotone" size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Company Info */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(26,11,46,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Building weight="duotone" size={28} color="var(--jw-dark)" />
                </div>
                <h2 className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>Set up your company</h2>
                <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Tell candidates about your company so they know who's hiring.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                <div>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>Company Name *</label>
                  <div style={{ position: 'relative' }}>
                    <Building weight="duotone" size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. TechCorp Inc." required style={{ ...inputStyle, paddingLeft: '40px' }} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>
                <div>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>Company Description</label>
                  <div style={{ position: 'relative' }}>
                    <Signature size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '16px' }} />
                    <textarea value={companyDescription} onChange={e => setCompanyDescription(e.target.value)}
                      placeholder="What makes your company a great place to work?" rows={4}
                      className="font-outfit" style={{ ...inputStyle, paddingLeft: '40px', resize: 'vertical', fontFamily: 'var(--font-outfit)' }} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(1)} className="font-outfit" style={{
                  flex: 1, padding: '14px', fontSize: '0.9rem', fontWeight: 600, borderRadius: '14px',
                  border: '1.5px solid rgba(26,11,46,0.1)', background: 'white', color: 'var(--jw-dark)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <ArrowLeft weight="duotone" size={16} /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="font-outfit" style={{
                  flex: 2, padding: '14px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '14px',
                  border: 'none', background: 'var(--jw-coral)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: loading ? 0.7 : 1, boxShadow: '0 6px 24px rgba(255,107,107,0.35)',
                }}>
                  {loading ? (
                    <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving...</>
                  ) : (
                    <><SealCheck weight="duotone" size={18} /> Complete Setup</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerOnboarding;
