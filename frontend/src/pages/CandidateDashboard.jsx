import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import {
    Briefcase, MapPin, Coins, Sparkle, Clock, Scroll,
    SignOut, Crown, RocketLaunch, SealCheck, XCircle,
    Eye, Lightning, User, WarningCircle, Buildings,
    CurrencyInr, CurrencyEur, CurrencyGbp, CurrencyDollar, Target
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

const getScoreStyle = (score) => {
    return { bg: 'var(--pro-match-bg)', text: 'var(--jw-dark)', icon: 'var(--jw-dark)', border: '1px solid var(--pro-match-border)' };
};

const STATUS_CONFIG = {
    applied: { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', label: 'Applied', icon: RocketLaunch },
    reviewing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'Reviewing', icon: Eye },
    accepted: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: 'Accepted', icon: SealCheck },
    rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: 'Rejected', icon: XCircle },
};

const NAV_ITEMS = [
    { key: 'jobs', label: 'Recommended Jobs', icon: Sparkle },
    { key: 'applications', label: 'My Applications', icon: Scroll },
    { key: 'profile', label: 'Edit Profile', icon: User },
];

const matchBorder = (score) => {
    return '4px solid var(--jw-dark)';
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
    const [withdrawModal, setWithdrawModal] = useState({ show: false, appId: null });
    const [errorMessage, setErrorMessage] = useState('');

    const [jobPage, setJobPage] = useState(1);
    const [appPage, setAppPage] = useState(1);
    const [hasMoreJobs, setHasMoreJobs] = useState(true);
    const [hasMoreApps, setHasMoreApps] = useState(true);
    const JOB_LIMIT = 10;
    const APP_LIMIT = 10;

    const fetchJobs = async (page = 1) => {
        try {
            const res = await apiClient.get(`/candidate/recommend-jobs?limit=${JOB_LIMIT}&page=${page}`);
            if (page === 1) { setJobs(res.data); } else { setJobs((prev) => [...prev, ...res.data]); }
            setHasMoreJobs(res.data.length === JOB_LIMIT);
        } catch { setJobs([]); } finally { setLoadingJobs(false); }
    };

    const fetchApplications = async (page = 1) => {
        try {
            const res = await apiClient.get(`/application/my-applications?limit=${APP_LIMIT}&page=${page}`);
            if (page === 1) { setApplications(res.data); } else { setApplications((prev) => [...prev, ...res.data]); }
            setHasMoreApps(res.data.length === APP_LIMIT);
        } catch { setApplications([]); } finally { setLoadingApps(false); }
    };

    const fetchProfile = async () => {
        try { const res = await apiClient.get('/candidate/my-profile'); setProfile(res.data); }
        catch { setProfile(null); }
    };

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchJobs(1);
        fetchApplications(1);
        fetchProfile();
    }, [user, navigate]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleApply = async (jobId) => {
        setApplyingId(jobId);
        try {
            await apiClient.post(`/application/apply/${jobId}`);
            setJobPage(1); setAppPage(1);
            await Promise.all([fetchJobs(1), fetchApplications(1)]);
        } catch (err) { setErrorMessage(err.response?.data?.detail || 'Failed to apply'); }
        finally { setApplyingId(null); }
    };

    const requestWithdraw = (id) => setWithdrawModal({ show: true, appId: id });

    const confirmWithdraw = async () => {
        const { appId } = withdrawModal;
        if (!appId) return;
        setWithdrawModal({ show: false, appId: null });
        try { await apiClient.delete(`/application/${appId}`); setAppPage(1); await fetchApplications(1); }
        catch (err) { setErrorMessage(err.response?.data?.detail || 'Failed to withdraw'); }
    };

    const handleLogout = () => { logout(); navigate('/'); };
    const appliedJobIds = new Set(applications.map((a) => a.job_id));

    const avatarUrl = user?.profile_picture_url || null;
    const initials = ((user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')).toUpperCase()
        || (user?.user_name?.[0] || 'U').toUpperCase();

    const handleNavClick = (key) => {
        if (key === 'profile') { navigate('/profile/candidate'); }
        else { setActiveTab(key); }
    };

    return (
        <div className="pro-dashboard" style={{ minHeight: '100vh', backgroundColor: 'var(--jw-bg)', backgroundImage: 'var(--mesh-bg)' }}>
            <Navbar />

            {/* ── Error Toast ── */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#EF4444', color: 'var(--pro-text-main)', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(239,68,68,0.3)', fontFamily: 'var(--font-outfit)', fontWeight: 600, fontSize: '0.9rem' }}>
                        <WarningCircle weight="duotone" size={18} />
                        {errorMessage}
                        <button onClick={() => setErrorMessage('')} style={{ background: 'none', border: 'none', color: 'var(--pro-text-main)', cursor: 'pointer', marginLeft: '8px' }}>
                            <XCircle weight="bold" size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Withdraw Modal ── */}
            <AnimatePresence>
                {withdrawModal.show && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(26,11,46,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                            className="pro-card" style={{ padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <WarningCircle weight="duotone" size={28} color="#EF4444" />
                            </div>
                            <h3 className="font-bricolage" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pro-text-main)', marginBottom: '12px' }}>Withdraw Application?</h3>
                            <p className="font-outfit" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>Are you sure? This action cannot be undone.</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setWithdrawModal({ show: false, appId: null })} className="font-outfit"
                                    style={{ flex: 1, padding: '12px', borderRadius: '9999px', border: '1.5px solid rgba(26,11,46,0.1)', background: 'transparent', color: 'var(--pro-text-main)', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={confirmWithdraw} className="font-outfit"
                                    style={{ flex: 1, padding: '12px', borderRadius: '9999px', border: 'none', background: '#EF4444', color: 'var(--pro-text-main)', fontWeight: 600, cursor: 'pointer' }}>
                                    Withdraw
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Layout: sidebar + main ── */}
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
                            {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.user_name || 'Candidate'}
                        </p>
                        <p className="font-outfit" style={{ fontSize: '0.72rem', color: 'var(--pro-text-muted)', textAlign: 'center', marginTop: '2px' }}>Candidate</p>
                    </div>

                    <div style={{ height: '1px', background: 'var(--pro-border)', marginBottom: '16px' }} />

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                            const isActive = activeTab === key && key !== 'profile';
                            return (
                                <button key={key} onClick={() => handleNavClick(key)} className="font-outfit"
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, textAlign: 'left', width: '100%', background: isActive ? 'rgba(255,107,107,0.08)' : 'transparent', color: isActive ? 'var(--jw-coral)' : '#6b7280', transition: 'all 0.15s ease' }}
                                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(26,11,46,0.04)'; }}
                                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                                    <Icon weight="duotone" size={17} />{label}
                                </button>
                            );
                        })}
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--pro-border)' }}>
                        <button onClick={handleLogout} className="font-outfit"
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, width: '100%', background: 'transparent', color: 'var(--pro-text-muted)', transition: 'all 0.15s ease' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#EF4444'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}>
                            <SignOut weight="duotone" size={17} />Logout
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main style={{ flex: 1, padding: '36px 32px 60px', minWidth: 0 }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 className="font-bricolage" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--pro-text-main)', marginBottom: '6px' }}>
                            Welcome back, {user?.first_name || user?.user_name || 'Candidate'}!
                        </h1>
                        <p className="font-outfit" style={{ fontSize: '0.95rem', color: 'var(--pro-text-muted)' }}>
                            Here are your latest job recommendations based on your profile.
                        </p>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '36px' }}>
                        {[
                            { icon: Lightning, label: 'Matched Jobs', value: jobs.length, color: '#FF6B6B' },
                            { icon: RocketLaunch, label: 'Applications', value: applications.length, color: '#6366F1' },
                            { icon: SealCheck, label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#10B981' },
                            { icon: Crown, label: 'Skills', value: profile?.skills?.length || 0, color: '#F59E0B' },
                        ].map(({ icon: Icon, label, value, color }, i) => (
                            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                className="pro-card" style={{ padding: '20px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon weight="duotone" size={26} color={color} />
                                </div>
                                <div>
                                    <div className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pro-text-main)' }}>{value}</div>
                                    <div className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)' }}>{label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Jobs Tab ── */}
                    {activeTab === 'jobs' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {loadingJobs ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="pro-card" style={{ padding: '24px 28px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div className="skeleton" style={{ height: '20px', width: '55%', borderRadius: '8px' }} />
                                            <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '8px' }} />
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                {[70, 70, 70].map((w, j) => <div key={j} className="skeleton" style={{ height: '24px', width: `${w}px`, borderRadius: '9999px' }} />)}
                                            </div>
                                        </div>
                                        <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0 }} />
                                    </div>
                                ))
                            ) : jobs.length === 0 ? (
                                <div className="pro-card" style={{ padding: '60px 40px', borderRadius: '20px', textAlign: 'center' }}>
                                    <WarningCircle weight="duotone" size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                                    <h3 className="font-bricolage" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--pro-text-main)', marginBottom: '8px' }}>No matches yet</h3>
                                    <p className="font-outfit" style={{ fontSize: '0.9rem', color: 'var(--pro-text-muted)' }}>Upload a fresh resume or update your skills to get new matches.</p>
                                    <button onClick={() => navigate('/onboarding/candidate')} className="btn-coral font-outfit" style={{ marginTop: '20px' }}>
                                        Update Profile / Resume
                                    </button>
                                </div>
                            ) : (
                                jobs.map((job, index) => (
                                    <motion.div key={job.job_id}
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
                                        className="pro-card"
                                        style={{ padding: '24px 28px', borderRadius: '20px', borderLeft: matchBorder(job.match_score), display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '220px' }}>
                                            <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pro-text-main)', marginBottom: '4px' }}>
                                                {job.job_title}
                                            </h3>
                                            <div className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--pro-text-muted)', fontWeight: 500, marginBottom: '12px' }}>
                                                <Buildings weight="duotone" size={17} /> {job.company_name || 'Unknown Company'}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
                                                <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--pro-text-muted)' }}><MapPin weight="duotone" size={16} /> {job.job_location}</span>
                                                <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--pro-text-muted)' }}>
                                                    {(() => {
                                                        const Icon = getCurrencyIcon(job.salary_range);
                                                        return <Icon weight="duotone" size={16} />;
                                                    })()}
                                                    {job.salary_range}
                                                </span>
                                                <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--pro-text-muted)' }}><Briefcase weight="duotone" size={16} /> {job.job_type}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {(job.skills_required || []).slice(0, 5).map(skill => (
                                                    <span key={skill} className="font-outfit" style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(124,58,237,0.06)', color: '#7C3AED' }}>{skill}</span>
                                                ))}
                                                {(job.skills_required || []).length > 5 && (
                                                    <span className="font-outfit" style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', color: 'var(--pro-text-muted)' }}>+{job.skills_required.length - 5} more</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                {(() => {
                                                    const s = getScoreStyle(job.match_score);
                                                    return (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: s.bg, color: s.text, border: s.border, fontWeight: 700, fontSize: '0.88rem', fontFamily: 'var(--font-outfit)' }}>
                                                            <Target weight="duotone" size={18} color={s.icon} /> {job.match_score}% Match
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            {appliedJobIds.has(job.job_id) ? (
                                                <span className="font-outfit" style={{ padding: '10px 20px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600, background: 'rgba(16,185,129,0.08)', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <SealCheck weight="duotone" size={15} /> Applied
                                                </span>
                                            ) : (
                                                <button onClick={() => handleApply(job.job_id)} disabled={applyingId === job.job_id} className="font-outfit"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, opacity: applyingId === job.job_id ? 0.7 : 1, cursor: applyingId === job.job_id ? 'not-allowed' : 'pointer', padding: '10px 24px', borderRadius: '9999px', background: 'var(--pro-btn-dark)', color: 'var(--pro-btn-dark-text)', border: 'none', transition: 'all 0.2s ease' }}
                                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(31,41,55,0.15)'; e.currentTarget.style.background = 'var(--pro-btn-dark-hover)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--pro-btn-dark)'; }}>
                                                    {applyingId === job.job_id
                                                        ? <div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                        : 'Apply Now'}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {!loadingJobs && hasMoreJobs && jobs.length > 0 && (
                                <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                                    <button onClick={() => { const n = jobPage + 1; setJobPage(n); fetchJobs(n); }} className="font-outfit"
                                        style={{ padding: '10px 28px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', color: 'var(--pro-text-main)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--jw-coral)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,11,46,0.1)'}>
                                        Load More Jobs
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Applications Tab ── */}
                    {activeTab === 'applications' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {loadingApps ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="pro-card" style={{ padding: '24px 28px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div className="skeleton" style={{ height: '18px', width: '45%', borderRadius: '8px' }} />
                                            <div className="skeleton" style={{ height: '13px', width: '30%', borderRadius: '8px' }} />
                                            <div className="skeleton" style={{ height: '24px', width: '90px', borderRadius: '9999px', marginTop: '4px' }} />
                                        </div>
                                        <div className="skeleton" style={{ height: '34px', width: '90px', borderRadius: '9999px', flexShrink: 0 }} />
                                    </div>
                                ))
                            ) : applications.length === 0 ? (
                                <div className="pro-card" style={{ padding: '60px 40px', borderRadius: '20px', textAlign: 'center' }}>
                                    <Scroll weight="duotone" size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                                    <h3 className="font-bricolage" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--pro-text-main)', marginBottom: '8px' }}>No applications yet</h3>
                                    <p className="font-outfit" style={{ fontSize: '0.9rem', color: 'var(--pro-text-muted)' }}>Apply to recommended jobs and track your applications here.</p>
                                    <button onClick={() => setActiveTab('jobs')} className="btn-coral font-outfit" style={{ marginTop: '20px' }}>Browse Jobs</button>
                                </div>
                            ) : (
                                applications.map((app, index) => {
                                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                                    const Icon = cfg.icon;
                                    return (
                                        <motion.div key={app.application_id}
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
                                            className="pro-card"
                                            style={{ padding: '22px 28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1, minWidth: '220px' }}>
                                                <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pro-text-main)', marginBottom: '4px' }}>
                                                    {app.job_title || `Job #${app.job_id}`}
                                                </h3>
                                                <div className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--pro-text-muted)', fontWeight: 500, marginBottom: '12px' }}>
                                                    <Buildings weight="duotone" size={15} /> {app.company_name || 'Unknown Company'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', background: cfg.bg, color: cfg.color }}>
                                                        <Icon weight="bold" size={12} /> {cfg.label}
                                                    </span>
                                                    <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock weight="duotone" size={14} /> Applied on {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            {(app.status === 'applied' || app.status === 'reviewing') && (
                                                <button onClick={() => requestWithdraw(app.application_id)} className="font-outfit"
                                                    style={{ padding: '8px 18px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    Withdraw
                                                </button>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                            {!loadingApps && hasMoreApps && applications.length > 0 && (
                                <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                                    <button onClick={() => { const n = appPage + 1; setAppPage(n); fetchApplications(n); }} className="font-outfit"
                                        style={{ padding: '10px 28px', borderRadius: '9999px', background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)', color: 'var(--pro-text-main)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--jw-coral)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,11,46,0.1)'}>
                                        Load More Applications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CandidateDashboard;