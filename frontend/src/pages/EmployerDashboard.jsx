import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, MapPin, Coins, ChartBar, Plus,
  ArrowLeft, X, RocketLaunch, Building, Buildings, CheckCircle, Clock,
  CurrencyInr, CurrencyEur, CurrencyGbp, CurrencyDollar,
  PlusCircle, SignOut, SealCheck, XCircle, Eye, PauseCircle, PlayCircle
} from '@phosphor-icons/react';

const getCurrencyIcon = (salaryStr) => {
  if (!salaryStr) return Coins;
  const str = salaryStr.toUpperCase();
  if (str.includes('INR')) return CurrencyInr;
  if (str.includes('EUR')) return CurrencyEur;
  if (str.includes('GBP')) return CurrencyGbp;
  if (str.includes('USD') || str.includes('CAD') || str.includes('AUD')) return CurrencyDollar;
  return Coins;
};

const STATUS_BADGE = {
  open: { label: 'Open', className: 'pro-badge-green' },
  paused: { label: 'Paused', className: 'pro-badge-yellow' },
  closed: { label: 'Closed', className: 'pro-badge-red' },
  pending: { label: 'Pending', className: 'pro-badge-yellow' },
  accepted: { label: 'Accepted', className: 'pro-badge-green' },
  rejected: { label: 'Rejected', className: 'pro-badge-red' },
};

const APP_STATUS = {
  applied: { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', label: 'Applied', icon: RocketLaunch },
  reviewing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'Reviewing', icon: Eye },
  accepted: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: 'Accepted', icon: SealCheck },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: 'Rejected', icon: XCircle },
};

const NAV_ITEMS = [
  { key: 'jobs', label: 'My Jobs', icon: Briefcase },
  { key: 'create', label: 'Post a Job', icon: PlusCircle },
  { key: 'profile', label: 'Company Profile', icon: Buildings },
];

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
    job_title: '', job_description: '', job_location: 'Remote',
    skills_required: '', min_salary: '', max_salary: '', currency: 'USD', job_type: 'Full-time',
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get('/job/my-jobs');
      setJobs(res.data);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchJobs();
  }, [user, navigate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.job_title || !form.job_description || !form.job_location || !form.min_salary || !form.max_salary || !form.skills_required) {
      setFormError('All fields are required.'); return;
    }
    setCreating(true);
    try {
      const compiledSalary = `${form.min_salary} - ${form.max_salary} ${form.currency}`;
      await apiClient.post('/job/create-job', {
        job_title: form.job_title,
        job_description: form.job_description,
        job_location: form.job_location,
        salary_range: compiledSalary,
        max_salary: parseFloat(form.max_salary.replace(/,/g, '')),
        job_type: form.job_type,
        skills_required: form.skills_required.split(/\s+/).map(s => s.trim()).filter(Boolean),
      });
      setForm({ job_title: '', job_description: '', job_location: 'Remote', skills_required: '', min_salary: '', max_salary: '', currency: 'USD', job_type: 'Full-time' });
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

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    border: '1.5px solid rgba(26,11,46,0.1)', background: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem', color: 'var(--pro-text-main)', outline: 'none',
    fontFamily: 'var(--font-outfit)', boxSizing: 'border-box',
  };

  const avatarUrl = user?.profile_picture_url || null;
  const initials = user?.first_name ? `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}` : user?.user_name?.[0]?.toUpperCase() || 'E';

  return (
    <div className="pro-dashboard" style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
      <Navbar />

      <div style={{ display: 'flex', paddingTop: '64px', minHeight: '100vh' }}>
        {/* SIDEBAR */}
        <aside style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', background: 'var(--pro-surface)', borderRight: '1px solid var(--pro-border)', display: 'flex', flexDirection: 'column', padding: '28px 16px 20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,107,107,0.25)', marginBottom: '12px' }} />
            ) : (
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--jw-coral),#FF8E53)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--pro-text-main)', fontFamily: 'var(--font-bricolage)', marginBottom: '12px', boxShadow: '0 4px 16px rgba(255,107,107,0.3)' }}>
                {initials}
              </div>
            )}
            <p className="font-bricolage" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--pro-text-main)', textAlign: 'center', lineHeight: 1.3 }}>
              {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.user_name || 'Employer'}
            </p>
            <p className="font-outfit" style={{ fontSize: '0.72rem', color: 'var(--pro-text-muted)', textAlign: 'center', marginTop: '2px' }}>Employer</p>
          </div>

          <div style={{ height: '1px', background: 'var(--pro-border)', marginBottom: '16px' }} />

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const isActive = view === key || (view === 'applicants' && key === 'jobs');
              return (
                <button key={key} onClick={() => {
                  if (key === 'profile') navigate('/profile/employer');
                  else setView(key);
                }} className="font-outfit"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, textAlign: 'left', width: '100%', background: isActive ? 'rgba(255,107,107,0.08)' : 'transparent', color: isActive ? 'var(--jw-coral)' : '#6b7280', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(26,11,46,0.04)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <Icon weight="duotone" size={20} />{label}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--pro-border)' }}>
            <button onClick={handleLogout} className="font-outfit"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, width: '100%', background: 'transparent', color: 'var(--pro-text-muted)', transition: 'all 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#EF4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}>
              <SignOut weight="duotone" size={20} />Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: '36px 32px 60px', minWidth: 0, maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 className="font-bricolage" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--pro-text-main)', marginBottom: '6px' }}>
              Welcome back, {user?.first_name || user?.user_name || 'Employer'}!
            </h1>
            <p className="font-outfit" style={{ fontSize: '0.95rem', color: 'var(--pro-text-muted)' }}>
              Manage your job listings and review applicants.
            </p>
          </div>

          {/* Stats Bar */}
          {view !== 'create' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
              {[
                { icon: Briefcase, label: 'Total Jobs', value: jobs.length, color: '#6366F1' },
                { icon: PlayCircle, label: 'Active Jobs', value: jobs.filter(j => j.job_status === 'open').length, color: '#10B981' },
                { icon: PauseCircle, label: 'Paused Jobs', value: jobs.filter(j => j.job_status === 'paused').length, color: '#F59E0B' },
                { icon: XCircle, label: 'Closed Jobs', value: jobs.filter(j => j.job_status === 'closed').length, color: '#EF4444' },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="pro-card" style={{ padding: '20px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon weight="duotone" size={28} color={color} />
                  </div>
                  <div>
                    <div className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pro-text-main)' }}>{value}</div>
                    <div className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)' }}>{label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ══════════ JOBS LIST ══════════ */}
          {view === 'jobs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 className="font-bricolage" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--pro-text-main)' }}>Your Postings</h2>
              </div>

              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="pro-card" style={{ padding: '24px 28px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="skeleton" style={{ height: '20px', width: '55%', borderRadius: '8px' }} />
                      <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '8px' }} />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        {[70, 70, 70].map((w, j) => <div key={j} className="skeleton" style={{ height: '24px', width: `${w}px`, borderRadius: '9999px' }} />)}
                      </div>
                    </div>
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div className="pro-card" style={{ padding: '60px 40px', borderRadius: '20px', textAlign: 'center' }}>
                  <Building weight="duotone" size={64} color="#9ca3af" style={{ marginBottom: '16px' }} />
                  <h3 className="font-bricolage" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--pro-text-main)', marginBottom: '8px' }}>No jobs posted yet</h3>
                  <p className="font-outfit" style={{ fontSize: '0.9rem', color: 'var(--pro-text-muted)', marginBottom: '20px' }}>Create your first job listing to start receiving applications.</p>
                  <button onClick={() => setView('create')} className="btn-coral font-outfit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><PlusCircle weight="bold" size={16} /> Post Your First Job</button>
                </div>
              ) : (
                jobs.map(job => {
                  const badge = STATUS_BADGE[job.job_status] || STATUS_BADGE.open;
                  return (
                    <div key={job.job_id} className="pro-card" style={{ padding: '24px 32px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', transition: 'transform 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pro-text-main)' }}>{job.job_title}</h3>
                          <span className={`font-outfit ${badge.className}`} style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{badge.label}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                          <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}><MapPin weight="duotone" size={16} /> {job.job_location}</span>
                          <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>
                            {(() => {
                              const Icon = getCurrencyIcon(job.salary_range);
                              return <Icon weight="duotone" size={16} />;
                            })()}
                            {job.salary_range}
                          </span>
                          <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}><Briefcase weight="duotone" size={16} /> {job.job_type}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                        <button onClick={() => viewApplicants(job)} className="font-outfit"
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', borderRadius: '9999px', background: 'rgba(99,102,241,0.08)', border: 'none', color: '#4F46E5', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Users weight="bold" size={16} /> Applicants
                        </button>
                        {job.job_status === 'open' && (
                          <button onClick={() => handleStatusChange(job.job_id, 'paused')} className="font-outfit"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(245,158,11,0.08)', border: 'none', color: '#D97706', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            <PauseCircle weight="bold" size={16} /> Pause 
                          </button>
                        )}
                        {job.job_status === 'paused' && (
                          <button onClick={() => handleStatusChange(job.job_id, 'open')} className="font-outfit"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.08)', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            <PlayCircle weight="bold" size={16} /> Resume
                          </button>
                        )}
                        {job.job_status !== 'closed' && (
                          <button onClick={() => handleStatusChange(job.job_id, 'closed')} className="font-outfit"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(239,68,68,0.06)', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            <XCircle weight="bold" size={16} /> Close
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* ══════════ CREATE JOB ══════════ */}
          {view === 'create' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pro-card" style={{ padding: '40px', borderRadius: '24px', maxWidth: '640px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h2 className="font-bricolage" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pro-text-main)' }}>Post a New Job</h2>
                <button onClick={() => { setView('jobs'); setFormError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X weight="bold" size={22} color="#9ca3af" /></button>
              </div>
              {formError && (
                <div className="font-outfit" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#C62828', fontSize: '0.85rem' }}>{formError}</div>
              )}
              <form onSubmit={handleCreateJob}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-text-main)', marginBottom: '8px' }}>Job Title</label>
                  <input type="text" value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Senior React Developer" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-text-main)', marginBottom: '8px' }}>Location</label>
                  <select value={form.job_location} onChange={e => setForm({ ...form, job_location: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Mumbai, India">Mumbai, India</option>
                    <option value="Bangalore, India">Bangalore, India</option>
                    <option value="Delhi, India">Delhi, India</option>
                    <option value="Pune, India">Pune, India</option>
                    <option value="Hyderabad, India">Hyderabad, India</option>
                    <option value="Chennai, India">Chennai, India</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-text-main)', marginBottom: '8px' }}>Salary Range</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" value={form.min_salary} onChange={e => setForm({ ...form, min_salary: e.target.value })} placeholder="Min (e.g. 80,000)" style={{ ...inputStyle, flex: 1 }} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
                    <span style={{ display: 'flex', alignItems: 'center', color: 'var(--pro-text-muted)' }}>-</span>
                    <input type="text" value={form.max_salary} onChange={e => setForm({ ...form, max_salary: e.target.value })} placeholder="Max (e.g. 120,000)" style={{ ...inputStyle, flex: 1 }} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
                    <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={{ ...inputStyle, width: '100px' }} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-text-main)', marginBottom: '8px' }}>Skills Required (space-separated)</label>
                  <input type="text" value={form.skills_required} onChange={e => setForm({ ...form, skills_required: e.target.value })} placeholder="e.g. React Node.js Python" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-text-main)', marginBottom: '8px' }}>Job Type</label>
                  <select value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })} className="font-outfit" style={inputStyle}>
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label className="font-outfit" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-text-main)', marginBottom: '8px' }}>Job Description</label>
                  <textarea value={form.job_description} onChange={e => setForm({ ...form, job_description: e.target.value })} placeholder="Describe the role, responsibilities, and requirements..." rows={5} className="font-outfit"
                    style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--jw-coral)'} onBlur={e => e.target.style.borderColor = 'rgba(26,11,46,0.1)'} />
                </div>
                <button type="submit" disabled={creating} className="btn-coral font-outfit"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: creating ? 0.7 : 1, cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    : <><PlusCircle weight="bold" size={18} /> Publish Job</>}
                </button>
              </form>
            </motion.div>
          )}

          {/* ══════════ APPLICANTS VIEW ══════════ */}
          {view === 'applicants' && selectedJob && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setView('jobs')} className="font-outfit"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', cursor: 'pointer', color: 'var(--pro-text-main)', fontWeight: 600, marginBottom: '24px', fontSize: '0.85rem' }}>
                <ArrowLeft weight="bold" size={16} /> Back to Jobs
              </button>
              <div className="pro-card" style={{ padding: '24px 32px', borderRadius: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="font-bricolage" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--pro-text-main)', marginBottom: '4px' }}>
                    Applicants for: {selectedJob.job_title}
                  </h2>
                  <p className="font-outfit" style={{ fontSize: '0.85rem', color: 'var(--pro-text-muted)' }}>
                    {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loadingApps ? (
                  [1, 2].map(i => <div key={i} className="pro-card" style={{ padding: '24px', borderRadius: '20px', height: '80px', animation: 'pulse 1.5s ease-in-out infinite', background: 'rgba(255,255,255,0.5)' }} />)
                ) : applicants.length === 0 ? (
                  <div className="pro-card" style={{ padding: '48px', borderRadius: '20px', textAlign: 'center' }}>
                    <Users weight="duotone" size={48} color="#9ca3af" style={{ marginBottom: '12px' }} />
                    <p className="font-outfit" style={{ color: 'var(--pro-text-muted)' }}>No applicants yet for this job.</p>
                  </div>
                ) : (
                  applicants.map(app => {
                    const cfg = APP_STATUS[app.status] || APP_STATUS.applied;
                    const Icon = cfg.icon;
                    return (
                      <div key={app.application_id} className="pro-card" style={{ padding: '20px 28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                          <h4 className="font-bricolage" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pro-text-main)', marginBottom: '4px' }}>
                            {app.candidate_name || 'Candidate'}
                          </h4>
                          <p className="font-outfit" style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>{app.candidate_email}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span className="font-outfit" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                              <Icon weight="bold" size={14} /> {cfg.label}
                            </span>
                            {app.match_score != null && (
                              <span className="font-outfit" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                                background: app.match_score >= 70 ? 'rgba(16,185,129,0.1)' : app.match_score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                                color: app.match_score >= 70 ? '#059669' : app.match_score >= 40 ? '#D97706' : '#4F46E5',
                              }}>
                                {Math.round(app.match_score)}% match
                              </span>
                            )}
                            <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--pro-text-muted)' }}>
                              <Clock weight="duotone" size={14} /> Applied {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        {(app.status === 'applied' || app.status === 'reviewing') && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {app.status === 'applied' && (
                              <button onClick={() => handleAppStatus(app.application_id, 'reviewing')} className="font-outfit"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(245,158,11,0.08)', border: 'none', color: '#D97706', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                <Eye weight="bold" size={16} /> Review
                              </button>
                            )}
                            <button onClick={() => handleAppStatus(app.application_id, 'accepted')} className="font-outfit"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.08)', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              <CheckCircle weight="bold" size={16} /> Accept
                            </button>
                            <button onClick={() => handleAppStatus(app.application_id, 'rejected')} className="font-outfit"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(239,68,68,0.06)', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              <XCircle weight="bold" size={16} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;