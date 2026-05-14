import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import {
  Plus, Briefcase, MapPin, DollarSign, Users, ChevronRight,
  LogOut, CheckCircle, XCircle, Eye, Clock, X, Send, Pause, Play,
  AlertCircle, ArrowLeft,
} from 'lucide-react';

const STATUS_BADGE = {
  open:   { color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: 'Open' },
  paused: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'Paused' },
  closed: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  label: 'Closed' },
};

const APP_STATUS = {
  applied:   { color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  label: 'Applied',   icon: Send },
  reviewing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  label: 'Reviewing', icon: Eye },
  accepted:  { color: '#10B981', bg: 'rgba(16,185,129,0.08)',   label: 'Accepted',  icon: CheckCircle },
  rejected:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',    label: 'Rejected',  icon: XCircle },
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('jobs'); // 'jobs' | 'create' | 'applicants'
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Create job form
  const [form, setForm] = useState({
    job_title: '', job_description: '', job_location: '',
    skills_required: '', salary_range: '', job_type: 'Full-time',
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get('/job/my-jobs');
      setJobs(res.data);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.job_title || !form.job_description || !form.job_location || !form.salary_range || !form.skills_required) {
      setFormError('All fields are required.'); return;
    }
    setCreating(true);
    try {
      await apiClient.post('/job/create-job', {
        ...form,
        skills_required: form.skills_required.split(',').map(s => s.trim()).filter(Boolean),
      });
      setForm({ job_title: '', job_description: '', job_location: '', skills_required: '', salary_range: '', job_type: 'Full-time' });
      setView('jobs');
      await fetchJobs();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create job.');
    } finally { setCreating(false); }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await apiClient.patch(`/job/update-job-status/${jobId}`, { job_status: newStatus });
      await fetchJobs();
    } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    setView('applicants');
    setLoadingApps(true);
    try {
      const res = await apiClient.get(`/application/job/${job.job_id}/applicants`);
      setApplicants(res.data);
    } catch { setApplicants([]); }
    finally { setLoadingApps(false); }
  };

  const handleAppStatus = async (appId, status) => {
    try {
      await apiClient.patch(`/application/${appId}/status`, { status });
      if (selectedJob) await viewApplicants(selectedJob);
    } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Shared input style ──
  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    border: '1.5px solid rgba(26,11,46,0.1)', background: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem', color: 'var(--jw-dark)', outline: 'none',
    fontFamily: 'var(--font-outfit)', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <div>
            <h1 className="font-bricolage" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>
              Employer Dashboard 🏢
            </h1>
            <p className="font-outfit" style={{ fontSize: '1rem', color: '#6b7280' }}>
              Manage your job listings and review applicants.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {view !== 'create' && (
              <button onClick={() => setView('create')} className="btn-coral font-outfit"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <Plus size={16} /> Post Job
              </button>
            )}
            <button onClick={handleLogout} className="font-outfit"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '9999px', background: 'rgba(26,11,46,0.04)', border: '1px solid rgba(26,11,46,0.08)', cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem', fontWeight: 600 }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        {view === 'jobs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { icon: Briefcase, label: 'Total Jobs', value: jobs.length, color: '#6366F1' },
              { icon: Play, label: 'Active', value: jobs.filter(j => j.job_status === 'open').length, color: '#10B981' },
              { icon: Pause, label: 'Paused', value: jobs.filter(j => j.job_status === 'paused').length, color: '#F59E0B' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-card" style={{ padding: '20px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={color} />
                </div>
                <div>
                  <div className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)' }}>{value}</div>
                  <div className="font-outfit" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ JOBS LIST ══════════ */}
        {view === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              [1,2,3].map(i => <div key={i} className="glass-card" style={{ padding: '28px', borderRadius: '20px', height: '100px', animation: 'pulse 1.5s ease-in-out infinite', background: 'rgba(255,255,255,0.5)' }} />)
            ) : jobs.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px 40px', borderRadius: '20px', textAlign: 'center' }}>
                <Briefcase size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                <h3 className="font-bricolage" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '8px' }}>No jobs posted yet</h3>
                <p className="font-outfit" style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '20px' }}>Create your first job listing to start receiving applications.</p>
                <button onClick={() => setView('create')} className="btn-coral font-outfit"><Plus size={16} /> Post Your First Job</button>
              </div>
            ) : (
              jobs.map(job => {
                const badge = STATUS_BADGE[job.job_status] || STATUS_BADGE.open;
                return (
                  <div key={job.job_id} className="glass-card" style={{ padding: '24px 32px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', transition: 'transform 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jw-dark)' }}>{job.job_title}</h3>
                        <span className="font-outfit" style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: badge.bg, color: badge.color }}>{badge.label}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                        <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6b7280' }}><MapPin size={14} /> {job.job_location}</span>
                        <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6b7280' }}><DollarSign size={14} /> {job.salary_range}</span>
                        <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6b7280' }}><Briefcase size={14} /> {job.job_type}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      <button onClick={() => viewApplicants(job)} className="font-outfit"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', borderRadius: '9999px', background: 'rgba(99,102,241,0.08)', border: 'none', color: '#4F46E5', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Users size={14} /> Applicants
                      </button>
                      {job.job_status === 'open' && (
                        <button onClick={() => handleStatusChange(job.job_id, 'paused')} className="font-outfit"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(245,158,11,0.08)', border: 'none', color: '#D97706', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Pause size={14} /> Pause
                        </button>
                      )}
                      {job.job_status === 'paused' && (
                        <button onClick={() => handleStatusChange(job.job_id, 'open')} className="font-outfit"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.08)', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Play size={14} /> Resume
                        </button>
                      )}
                      {job.job_status !== 'closed' && (
                        <button onClick={() => handleStatusChange(job.job_id, 'closed')} className="font-outfit"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(239,68,68,0.06)', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          <XCircle size={14} /> Close
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ══════════ CREATE JOB ══════════ */}
        {view === 'create' && (
          <div className="glass-card" style={{ padding: '40px', borderRadius: '24px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 className="font-bricolage" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--jw-dark)' }}>Post a New Job</h2>
              <button onClick={() => { setView('jobs'); setFormError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="#9ca3af" /></button>
            </div>
            {formError && (
              <div className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#C62828', fontSize: '0.85rem' }}>{formError}</div>
            )}
            <form onSubmit={handleCreateJob}>
              {[
                { key: 'job_title', label: 'Job Title', placeholder: 'e.g. Senior React Developer' },
                { key: 'job_location', label: 'Location', placeholder: 'e.g. Remote, New York, Bangalore' },
                { key: 'salary_range', label: 'Salary Range', placeholder: 'e.g. $80k - $120k' },
                { key: 'skills_required', label: 'Skills (comma-separated)', placeholder: 'e.g. React, Node.js, TypeScript' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>{label}</label>
                  <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
                </div>
              ))}
              <div style={{ marginBottom: '16px' }}>
                <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>Job Type</label>
                <select value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })} className="font-outfit" style={inputStyle}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '8px' }}>Job Description</label>
                <textarea value={form.job_description} onChange={e => setForm({ ...form, job_description: e.target.value })} placeholder="Describe the role, responsibilities, and requirements..." rows={5} className="font-outfit"
                  style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
              </div>
              <button type="submit" disabled={creating} className="btn-coral font-outfit"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: creating ? 0.7 : 1, cursor: creating ? 'not-allowed' : 'pointer' }}>
                {creating ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <><Plus size={18} /> Publish Job</>}
              </button>
            </form>
          </div>
        )}

        {/* ══════════ APPLICANTS VIEW ══════════ */}
        {view === 'applicants' && selectedJob && (
          <div>
            <button onClick={() => setView('jobs')} className="font-outfit"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', cursor: 'pointer', color: 'var(--jw-dark)', fontWeight: 600, marginBottom: '24px', fontSize: '0.85rem' }}>
              <ArrowLeft size={16} /> Back to Jobs
            </button>
            <div className="glass-card" style={{ padding: '24px 32px', borderRadius: '20px', marginBottom: '24px' }}>
              <h2 className="font-bricolage" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '4px' }}>
                Applicants for: {selectedJob.job_title}
              </h2>
              <p className="font-outfit" style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loadingApps ? (
                [1,2].map(i => <div key={i} className="glass-card" style={{ padding: '24px', borderRadius: '20px', height: '80px', animation: 'pulse 1.5s ease-in-out infinite', background: 'rgba(255,255,255,0.5)' }} />)
              ) : applicants.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', borderRadius: '20px', textAlign: 'center' }}>
                  <Users size={40} color="#9ca3af" style={{ marginBottom: '12px' }} />
                  <p className="font-outfit" style={{ color: '#9ca3af' }}>No applicants yet for this job.</p>
                </div>
              ) : (
                applicants.map(app => {
                  const cfg = APP_STATUS[app.status] || APP_STATUS.applied;
                  const Icon = cfg.icon;
                  return (
                    <div key={app.application_id} className="glass-card" style={{ padding: '20px 28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <h4 className="font-bricolage" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '4px' }}>
                          {app.candidate_name || 'Candidate'}
                        </h4>
                        <p className="font-outfit" style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px' }}>{app.candidate_email}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="font-outfit" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                            <Icon size={12} /> {cfg.label}
                          </span>
                          <span className="font-outfit" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                            Applied {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      {(app.status === 'applied' || app.status === 'reviewing') && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {app.status === 'applied' && (
                            <button onClick={() => handleAppStatus(app.application_id, 'reviewing')} className="font-outfit"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(245,158,11,0.08)', border: 'none', color: '#D97706', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              <Eye size={14} /> Review
                            </button>
                          )}
                          <button onClick={() => handleAppStatus(app.application_id, 'accepted')} className="font-outfit"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.08)', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            <CheckCircle size={14} /> Accept
                          </button>
                          <button onClick={() => handleAppStatus(app.application_id, 'rejected')} className="font-outfit"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(239,68,68,0.06)', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;