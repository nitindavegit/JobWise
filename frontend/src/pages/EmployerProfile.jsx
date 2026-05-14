import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import { Building2, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

const EmployerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/employer/my-profile');
      setCompanyName(res.data.company_name || '');
      setCompanyDescription(res.data.company_description || '');
    } catch { /* no profile */ }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) { setError('Company name is required.'); return; }
    setSaving(true); setError('');
    try {
      await apiClient.patch('/employer/update-profile', {
        company_name: companyName.trim(),
        company_description: companyDescription.trim(),
      });
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save.');
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    border: '1.5px solid rgba(26,11,46,0.1)', background: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem', color: 'var(--jw-dark)', outline: 'none',
    fontFamily: 'var(--font-outfit)', boxSizing: 'border-box',
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="glass-card" style={{ height: '350px', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '100px 24px 60px' }}>

        <button onClick={() => navigate('/employer')} className="font-outfit"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', cursor: 'pointer', color: 'var(--jw-dark)', fontWeight: 600, marginBottom: '24px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(26,11,46,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} color="var(--jw-dark)" />
            </div>
            <div>
              <h1 className="font-bricolage" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--jw-dark)' }}>Company Profile</h1>
              <p className="font-outfit" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{user?.user_email}</p>
            </div>
          </div>

          {error && <div className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#C62828', fontSize: '0.85rem' }}>{error}</div>}
          {success && <div className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} /> {success}</div>}

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '20px' }}>
              <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>Company Name *</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. TechCorp Inc." required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>Company Description</label>
              <textarea value={companyDescription} onChange={e => setCompanyDescription(e.target.value)} placeholder="What does your company do?" rows={4} className="font-outfit"
                style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
            </div>
            <button type="submit" disabled={saving} className="btn-coral font-outfit"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : <><CheckCircle size={16} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
