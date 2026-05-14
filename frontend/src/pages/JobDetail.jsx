import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import {
  MapPin, DollarSign, Briefcase, Building2, Send, CheckCircle,
  ArrowLeft, AlertCircle,
} from 'lucide-react';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await apiClient.get(`/job/${jobId}`);
        setJob(res.data);
      } catch {
        setError('Job not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();

    // Check if already applied
    if (user && user.user_type === 'candidate') {
      apiClient.get('/application/my-applications')
        .then(res => {
          if (res.data.some(a => a.job_id === parseInt(jobId))) setApplied(true);
        })
        .catch(() => {});
    }
  }, [jobId]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await apiClient.post(`/application/apply/${jobId}`);
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const statusColor = {
    open: { color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    paused: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    closed: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 60px' }}>

        <button onClick={() => navigate(-1)} className="font-outfit"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', cursor: 'pointer', color: 'var(--jw-dark)', fontWeight: 600, marginBottom: '24px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {loading ? (
          <div className="glass-card" style={{ padding: '60px', borderRadius: '24px', height: '300px', animation: 'pulse 1.5s ease-in-out infinite', background: 'rgba(255,255,255,0.5)' }} />
        ) : error ? (
          <div className="glass-card" style={{ padding: '60px', borderRadius: '24px', textAlign: 'center' }}>
            <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
            <h2 className="font-bricolage" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--jw-dark)' }}>{error}</h2>
          </div>
        ) : job && (
          <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <h1 className="font-bricolage" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--jw-dark)' }}>
                  {job.job_title}
                </h1>
                <span className="font-outfit" style={{
                  padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                  background: (statusColor[job.job_status] || statusColor.open).bg,
                  color: (statusColor[job.job_status] || statusColor.open).color,
                }}>{job.job_status}</span>
              </div>

              {job.company_name && (
                <p className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', color: '#6b7280', marginBottom: '16px' }}>
                  <Building2 size={18} /> {job.company_name}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#6b7280' }}><MapPin size={16} /> {job.job_location}</span>
                <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#6b7280' }}><DollarSign size={16} /> {job.salary_range}</span>
                <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#6b7280' }}><Briefcase size={16} /> {job.job_type}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(26,11,46,0.06)', margin: '24px 0' }} />

            {/* Skills */}
            <div style={{ marginBottom: '28px' }}>
              <h3 className="font-bricolage" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px' }}>Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(job.skills_required || []).map(skill => (
                  <span key={skill} className="font-outfit" style={{
                    padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600,
                    background: 'rgba(124,58,237,0.06)', color: '#7C3AED',
                  }}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h3 className="font-bricolage" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px' }}>Job Description</h3>
              <p className="font-outfit" style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {job.job_description}
              </p>
            </div>

            {/* Apply button */}
            {user?.user_type === 'candidate' && job.job_status === 'open' && (
              <div>
                {applied ? (
                  <span className="font-outfit" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 32px', borderRadius: '9999px', fontSize: '1rem', fontWeight: 600,
                    background: 'rgba(16,185,129,0.08)', color: '#059669',
                  }}>
                    <CheckCircle size={20} /> You&apos;ve applied to this job
                  </span>
                ) : (
                  <button onClick={handleApply} disabled={applying} className="btn-coral font-outfit"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '14px 32px', opacity: applying ? 0.7 : 1, cursor: applying ? 'not-allowed' : 'pointer' }}>
                    {applying ? (
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : (
                      <><Send size={18} /> Apply Now</>
                    )}
                  </button>
                )}
              </div>
            )}

            {!user && job.job_status === 'open' && (
              <button onClick={() => navigate('/login')} className="btn-coral font-outfit"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '14px 32px' }}>
                <Send size={18} /> Sign in to Apply
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
