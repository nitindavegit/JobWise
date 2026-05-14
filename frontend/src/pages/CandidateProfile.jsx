import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import {
  Upload, FileText, X, Plus, Sparkles, CheckCircle, ArrowLeft, User,
} from 'lucide-react';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/candidate/my-profile');
      setResumeText(res.data.resume_text || '');
      setSkills(res.data.skills || []);
    } catch { /* no profile yet */ }
    finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file); setError('');
    } else { setError('Please upload a PDF file.'); }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const res = await apiClient.post('/candidate/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeText(res.data.extracted_text_preview || '');
      setResumeFile(null);
      setSuccess('Resume updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume.');
    } finally { setUploading(false); }
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]); setSkillInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }
  };

  const handleSaveSkills = async () => {
    setSaving(true); setError('');
    try {
      await apiClient.patch('/candidate/update-profile', { skills });
      setSuccess('Skills saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="glass-card" style={{ height: '400px', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '100px 24px 60px' }}>

        <button onClick={() => navigate('/dashboard')} className="font-outfit"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', cursor: 'pointer', color: 'var(--jw-dark)', fontWeight: 600, marginBottom: '24px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,107,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={24} color="var(--jw-coral)" />
            </div>
            <div>
              <h1 className="font-bricolage" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--jw-dark)' }}>Edit Profile</h1>
              <p className="font-outfit" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{user?.user_email}</p>
            </div>
          </div>

          {/* Feedback */}
          {error && <div className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#C62828', fontSize: '0.85rem' }}>{error}</div>}
          {success && <div className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} /> {success}</div>}

          {/* Resume Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 className="font-bricolage" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px' }}>Resume</h3>
            {resumeText && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', marginBottom: '12px', maxHeight: '80px', overflow: 'hidden' }}>
                <p className="font-outfit" style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>{resumeText}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label htmlFor="resume-edit" className="font-outfit" style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '9999px',
                background: 'rgba(26,11,46,0.04)', border: '1px solid rgba(26,11,46,0.08)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)',
              }}>
                <Upload size={14} /> {resumeFile ? resumeFile.name : 'Choose PDF'}
                <input id="resume-edit" type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              {resumeFile && (
                <button onClick={handleUploadResume} disabled={uploading} className="btn-coral font-outfit" style={{ fontSize: '0.8rem', padding: '10px 20px', opacity: uploading ? 0.6 : 1 }}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(26,11,46,0.06)', margin: '0 0 28px' }} />

          {/* Skills Section */}
          <div>
            <h3 className="font-bricolage" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px' }}>Skills</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Add a skill..." className="font-outfit"
                style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(26,11,46,0.1)', background: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', color: 'var(--jw-dark)', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7C3AED'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
              <button type="button" onClick={handleAddSkill} style={{ padding: '12px 16px', borderRadius: '14px', background: 'var(--jw-dark)', color: 'white', border: 'none', cursor: 'pointer' }}>
                <Plus size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '40px', marginBottom: '20px' }}>
              {skills.map(skill => (
                <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '9999px', background: 'rgba(124,58,237,0.08)', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-outfit)' }}>
                  {skill}
                  <button onClick={() => setSkills(skills.filter(s => s !== skill))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#7C3AED' }}><X size={14} /></button>
                </span>
              ))}
              {skills.length === 0 && <span className="font-outfit" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No skills added yet</span>}
            </div>
            <button onClick={handleSaveSkills} disabled={saving} className="btn-coral font-outfit"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : <><CheckCircle size={16} /> Save Skills</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
