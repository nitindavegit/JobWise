import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUp, Plus, X, SealCheck, ArrowRight, ArrowLeft, User, Sparkle, MagnifyingGlass } from '@phosphor-icons/react';
import apiClient from '../api/client';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo';

/* ── Skill suggestions pool ── */
const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'Swift',
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Bootstrap',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Adobe XD',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision',
  'REST API', 'GraphQL', 'WebSockets', 'Microservices', 'System Design',
  'Agile', 'Scrum', 'Project Management', 'Leadership', 'Communication',
  'Data Analysis', 'Data Engineering', 'ETL', 'Power BI', 'Tableau', 'Excel',
  'iOS Development', 'Android Development', 'React Native', 'Flutter',
  'Cybersecurity', 'Penetration Testing', 'Linux', 'Networking',
  'Blockchain', 'Solidity', 'Web3', 'Smart Contracts',
  'UI/UX Design', 'Product Design', 'Wireframing', 'Prototyping',
];

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [step, setStep] = useState(1); // 1 = name, 2 = resume, 3 = skills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Name
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Step 2: Resume
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeSkills, setResumeSkills] = useState([]); // skills extracted after upload

  // Step 3: Skills
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)
  ).slice(0, 8);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError('');
    } else {
      setError('Please upload a PDF file.');
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const res = await apiClient.post('/candidate/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeUploaded(true);

      // Try to fetch profile to get any skills already on file
      try {
        const profileRes = await apiClient.get('/candidate/my-profile');
        if (profileRes.data.skills && profileRes.data.skills.length > 0) {
          setResumeSkills(profileRes.data.skills);
        }
      } catch { /* profile may not exist yet */ }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  // When moving to step 3, pre-populate skills from resume
  const goToSkills = () => {
    if (resumeSkills.length > 0 && skills.length === 0) {
      setSkills([...resumeSkills]);
    }
    setStep(3);
  };

  const handleAddSkill = (skill) => {
    const s = (skill || skillInput).trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      const birdIndex = Math.floor(Math.random() * 6) + 1;
      const generatedPic = `/avatars/bird${birdIndex}.png`;

      await apiClient.patch('/candidate/update-profile', {
        first_name: firstName || null,
        last_name: lastName || null,
        profile_picture_url: generatedPic,
        skills,
      });

      updateUser({
        profile_completed: true,
        first_name: firstName,
        last_name: lastName,
        profile_picture_url: generatedPic,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    border: '1.5px solid rgba(26,11,46,0.1)', background: 'rgba(255,255,255,0.8)',
    fontSize: '0.95rem', color: 'var(--jw-dark)', outline: 'none',
    fontFamily: 'var(--font-outfit)', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const stepIndicator = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
      {[1, 2, 3].map(s => (
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
      padding: '40px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--jw-lavender)', opacity: 0.25, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--jw-peach)', opacity: 0.25, filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/"><Logo size="xl" /></Link>
        </div>

        <div className="p-6 md:p-10 rounded-[28px] border border-white/60 shadow-[0_16px_64px_rgba(26,11,46,0.10)]" style={{
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
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,107,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <User weight="duotone" size={28} color="var(--jw-coral)" />
                </div>
                <h2 className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>What's your name?</h2>
                <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#9ca3af' }}>We'll use this to personalize your experience.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--jw-coral)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,107,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(26,11,46,0.1)'; e.target.style.boxShadow = 'none'; }} />
                <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--jw-coral)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,107,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(26,11,46,0.1)'; e.target.style.boxShadow = 'none'; }} />
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

          {/* STEP 2: Resume Upload */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CloudArrowUp weight="duotone" size={28} color="#7C3AED" />
                </div>
                <h2 className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>Upload your resume</h2>
                <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Our AI will extract your skills and match you to jobs.</p>
              </div>

              <div style={{
                border: '2px dashed rgba(26,11,46,0.12)', borderRadius: '20px', padding: '36px 24px',
                textAlign: 'center', marginBottom: '20px',
                background: resumeUploaded ? 'rgba(16,185,129,0.04)' : 'rgba(26,11,46,0.02)',
                borderColor: resumeUploaded ? '#10B981' : 'rgba(26,11,46,0.12)',
              }}>
                {resumeUploaded ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <SealCheck weight="duotone" size={36} color="#10B981" />
                    <p className="font-outfit" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10B981' }}>Resume uploaded successfully!</p>
                  </div>
                ) : (
                  <>
                    <label htmlFor="resume-onboard" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <CloudArrowUp weight="duotone" size={32} color="#9ca3af" />
                      <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#6b7280' }}>
                        {resumeFile ? resumeFile.name : 'Click to choose a PDF file'}
                      </p>
                      <input id="resume-onboard" type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                    {resumeFile && (
                      <button onClick={handleUploadResume} disabled={uploading} className="btn-coral font-outfit" style={{ marginTop: '12px', fontSize: '0.85rem', padding: '10px 24px', opacity: uploading ? 0.6 : 1 }}>
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(1)} className="font-outfit" style={{
                  flex: 1, padding: '14px', fontSize: '0.9rem', fontWeight: 600, borderRadius: '14px',
                  border: '1.5px solid rgba(26,11,46,0.1)', background: 'white', color: 'var(--jw-dark)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <ArrowLeft weight="duotone" size={16} /> Back
                </button>
                <button onClick={goToSkills} className="font-outfit" style={{
                  flex: 2, padding: '14px', fontSize: '0.9rem', fontWeight: 700, borderRadius: '14px',
                  border: 'none', background: 'var(--jw-dark)', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  {resumeUploaded ? 'Continue' : 'Skip for now'} <ArrowRight weight="duotone" size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Skills with dropdown */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 className="font-bricolage" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>Add your skills</h2>
                <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Search or type to add — we'll use these to find your best matches.</p>
              </div>

              {/* Skill input with dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <MagnifyingGlass weight="duotone" size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input type="text" value={skillInput}
                      onChange={(e) => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search skills..."
                      style={{ ...inputStyle, flex: 1, paddingLeft: '40px' }} />
                  </div>
                  <button type="button" onClick={() => handleAddSkill()} style={{ padding: '14px 16px', borderRadius: '14px', background: 'var(--jw-dark)', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                    <Plus size={18} />
                  </button>
                </div>

                {/* Dropdown suggestions */}
                <AnimatePresence>
                  {showSuggestions && skillInput.length > 0 && filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0, right: '56px', marginTop: '4px',
                        background: 'white', borderRadius: '14px', border: '1px solid rgba(26,11,46,0.08)',
                        boxShadow: '0 8px 32px rgba(26,11,46,0.12)', zIndex: 50, overflow: 'hidden',
                      }}
                    >
                      {filteredSuggestions.map(s => (
                        <button key={s} onClick={() => handleAddSkill(s)} className="font-outfit" style={{
                          width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                          textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--jw-dark)',
                          transition: 'background 0.1s ease', display: 'flex', alignItems: 'center', gap: '8px',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resume skills notice */}
              {resumeSkills.length > 0 && (
                <div className="font-outfit" style={{ fontSize: '0.75rem', color: '#7C3AED', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkle weight="duotone" size={13} /> {resumeSkills.length} skills imported from your resume
                </div>
              )}

              {/* Skill pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '44px', marginBottom: '24px', padding: '12px', borderRadius: '14px', background: 'rgba(26,11,46,0.02)' }}>
                {skills.map(skill => (
                  <span key={skill} className="font-outfit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '9999px', background: 'rgba(124,58,237,0.08)', color: '#7C3AED', fontSize: '0.82rem', fontWeight: 600 }}>
                    {skill}
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#7C3AED' }}><X weight="duotone" size={14} /></button>
                  </span>
                ))}
                {skills.length === 0 && <span className="font-outfit" style={{ fontSize: '0.82rem', color: '#9ca3af' }}>No skills added yet — you can always add them later</span>}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(2)} className="font-outfit" style={{
                  flex: 1, padding: '14px', fontSize: '0.9rem', fontWeight: 600, borderRadius: '14px',
                  border: '1.5px solid rgba(26,11,46,0.1)', background: 'white', color: 'var(--jw-dark)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <ArrowLeft weight="duotone" size={16} /> Back
                </button>
                <button onClick={handleFinish} disabled={loading} className="font-outfit" style={{
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

export default CandidateOnboarding;