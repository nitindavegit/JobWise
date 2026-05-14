import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import {
  Briefcase, MapPin, DollarSign, Sparkles, Clock, FileText,
  ChevronRight, LogOut, Star, Send, CheckCircle, XCircle,
  Eye, Zap, User, AlertCircle,
} from 'lucide-react';

const STATUS_CONFIG = {
  applied:   { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', label: 'Applied', icon: Send },
  reviewing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'Reviewing', icon: Eye },
  accepted:  { color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: 'Accepted', icon: CheckCircle },
  rejected:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  label: 'Rejected', icon: XCircle },
};

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchJobs();
    fetchApplications();
    fetchProfile();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get('/candidate/recommend-jobs?limit=20');
      setJobs(res.data);
    } catch {
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await apiClient.get('/application/my-applications');
      setApplications(res.data);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/candidate/my-profile');
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      await apiClient.post(`/application/apply/${jobId}`);
      // Refresh both lists
      await Promise.all([fetchJobs(), fetchApplications()]);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await apiClient.delete(`/application/${applicationId}`);
      await fetchApplications();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to withdraw');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check which jobs the user already applied to
  const appliedJobIds = new Set(applications.map((a) => a.job_id));

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: 'var(--jw-bg)',
      backgroundImage: 'var(--mesh-bg)',
    }}>
      <Navbar />

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '100px 24px 60px',
      }}>
        {/* ─── Welcome Header ─── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '16px', marginBottom: '40px',
        }}>
          <div>
            <h1 className="font-bricolage" style={{
              fontSize: '2rem', fontWeight: 800, color: 'var(--jw-dark)',
              marginBottom: '8px',
            }}>
              Welcome back, {user?.user_name || 'Candidate'} 👋
            </h1>
            <p className="font-outfit" style={{ fontSize: '1rem', color: '#6b7280' }}>
              Here are your personalized job matches powered by AI.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="font-outfit"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(26,11,46,0.04)', border: '1px solid rgba(26,11,46,0.08)',
              cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem', fontWeight: 600,
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* ─── Stats Row ─── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '40px',
        }}>
          {[
            { icon: Zap, label: 'Matched Jobs', value: jobs.length, color: '#FF6B6B' },
            { icon: Send, label: 'Applications', value: applications.length, color: '#6366F1' },
            { icon: CheckCircle, label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#10B981' },
            { icon: Star, label: 'Skills', value: profile?.skills?.length || 0, color: '#F59E0B' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card" style={{
              padding: '20px 24px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${color}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div className="font-bricolage" style={{
                  fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)',
                }}>{value}</div>
                <div className="font-outfit" style={{
                  fontSize: '0.75rem', color: '#9ca3af',
                }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Tab Switcher ─── */}
        <div style={{
          display: 'flex', gap: '4px', padding: '4px',
          background: 'rgba(26,11,46,0.04)', borderRadius: '14px',
          marginBottom: '28px', width: 'fit-content',
        }}>
          {[
            { key: 'jobs', label: 'Recommended Jobs', icon: Sparkles },
            { key: 'applications', label: 'My Applications', icon: FileText },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="font-outfit"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                background: activeTab === key ? 'white' : 'transparent',
                color: activeTab === key ? 'var(--jw-dark)' : '#9ca3af',
                boxShadow: activeTab === key ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* ─── Recommended Jobs Tab ─── */}
        {activeTab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loadingJobs ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card" style={{
                  padding: '28px 32px', borderRadius: '20px',
                  height: '120px', animation: 'pulse 1.5s ease-in-out infinite',
                  background: 'rgba(255,255,255,0.5)',
                }} />
              ))
            ) : jobs.length === 0 ? (
              <div className="glass-card" style={{
                padding: '60px 40px', borderRadius: '20px', textAlign: 'center',
              }}>
                <AlertCircle size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                <h3 className="font-bricolage" style={{
                  fontSize: '1.2rem', fontWeight: 700, color: 'var(--jw-dark)',
                  marginBottom: '8px',
                }}>No matches yet</h3>
                <p className="font-outfit" style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                  Upload your resume and add skills to get AI-powered job matches.
                </p>
                <button
                  onClick={() => navigate('/onboarding/candidate')}
                  className="btn-coral font-outfit"
                  style={{ marginTop: '20px' }}
                >
                  Complete Profile
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.job_id} className="glass-card" style={{
                  padding: '28px 32px', borderRadius: '20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: '20px', flexWrap: 'wrap',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,11,46,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Job Info */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 className="font-bricolage" style={{
                        fontSize: '1.15rem', fontWeight: 700, color: 'var(--jw-dark)',
                      }}>
                        {job.job_title}
                      </h3>
                      {/* Match score badge */}
                      <span className="font-outfit" style={{
                        padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem',
                        fontWeight: 700,
                        background: job.match_score >= 70 ? 'rgba(16,185,129,0.1)' :
                                    job.match_score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                        color: job.match_score >= 70 ? '#059669' :
                               job.match_score >= 40 ? '#D97706' : '#4F46E5',
                      }}>
                        {job.match_score}% match
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '16px',
                      marginBottom: '12px',
                    }}>
                      <span className="font-outfit" style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.8rem', color: '#6b7280',
                      }}>
                        <MapPin size={14} /> {job.job_location}
                      </span>
                      <span className="font-outfit" style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.8rem', color: '#6b7280',
                      }}>
                        <DollarSign size={14} /> {job.salary_range}
                      </span>
                      <span className="font-outfit" style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.8rem', color: '#6b7280',
                      }}>
                        <Briefcase size={14} /> {job.job_type}
                      </span>
                    </div>
                    {/* Skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(job.skills_required || []).slice(0, 5).map((skill) => (
                        <span key={skill} className="font-outfit" style={{
                          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem',
                          fontWeight: 600, background: 'rgba(124,58,237,0.06)', color: '#7C3AED',
                        }}>
                          {skill}
                        </span>
                      ))}
                      {(job.skills_required || []).length > 5 && (
                        <span className="font-outfit" style={{
                          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem',
                          color: '#9ca3af',
                        }}>
                          +{job.skills_required.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apply button */}
                  <div style={{ flexShrink: 0 }}>
                    {appliedJobIds.has(job.job_id) ? (
                      <span className="font-outfit" style={{
                        padding: '10px 24px', borderRadius: '9999px', fontSize: '0.85rem',
                        fontWeight: 600, background: 'rgba(16,185,129,0.08)',
                        color: '#059669', display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <CheckCircle size={16} /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job.job_id)}
                        disabled={applyingId === job.job_id}
                        className="btn-coral font-outfit"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '0.85rem', opacity: applyingId === job.job_id ? 0.6 : 1,
                          cursor: applyingId === job.job_id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {applyingId === job.job_id ? (
                          <div style={{
                            width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }} />
                        ) : (
                          <><Send size={16} /> Apply</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── My Applications Tab ─── */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loadingApps ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card" style={{
                  padding: '28px 32px', borderRadius: '20px',
                  height: '100px', animation: 'pulse 1.5s ease-in-out infinite',
                  background: 'rgba(255,255,255,0.5)',
                }} />
              ))
            ) : applications.length === 0 ? (
              <div className="glass-card" style={{
                padding: '60px 40px', borderRadius: '20px', textAlign: 'center',
              }}>
                <FileText size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                <h3 className="font-bricolage" style={{
                  fontSize: '1.2rem', fontWeight: 700, color: 'var(--jw-dark)',
                  marginBottom: '8px',
                }}>No applications yet</h3>
                <p className="font-outfit" style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                  Apply to recommended jobs and track your applications here.
                </p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="btn-coral font-outfit"
                  style={{ marginTop: '20px' }}
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              applications.map((app) => {
                const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                const StatusIcon = config.icon;
                return (
                  <div key={app.application_id} className="glass-card" style={{
                    padding: '24px 32px', borderRadius: '20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '16px', flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 className="font-bricolage" style={{
                        fontSize: '1.1rem', fontWeight: 700, color: 'var(--jw-dark)',
                        marginBottom: '4px',
                      }}>
                        {app.job_title || `Job #${app.job_id}`}
                      </h3>
                      {app.company_name && (
                        <p className="font-outfit" style={{
                          fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px',
                        }}>
                          at {app.company_name}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem',
                          fontWeight: 700, fontFamily: 'var(--font-outfit)',
                          background: config.bg, color: config.color,
                        }}>
                          <StatusIcon size={12} /> {config.label}
                        </span>
                        <span className="font-outfit" style={{
                          fontSize: '0.75rem', color: '#9ca3af',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                          <Clock size={12} />
                          {new Date(app.applied_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Withdraw button (only for applied/reviewing) */}
                    {(app.status === 'applied' || app.status === 'reviewing') && (
                      <button
                        onClick={() => handleWithdraw(app.application_id)}
                        className="font-outfit"
                        style={{
                          padding: '8px 18px', borderRadius: '9999px',
                          background: 'transparent', border: '1.5px solid rgba(239,68,68,0.2)',
                          color: '#EF4444', fontSize: '0.8rem', fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;