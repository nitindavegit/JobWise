import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import Logo from '../components/Logo';
import {
  Upload, FileText, X, Plus, Sparkles, ArrowRight, ArrowLeft, CheckCircle,
} from 'lucide-react';

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1); // 1 = Resume, 2 = Skills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Skills state
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

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
    if (!resumeFile) {
      setError('Please select a PDF file first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const response = await apiClient.post('/candidate/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeText(response.data.extracted_text_preview || '');
      setUploadSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.patch('/candidate/update-profile', {
        resume_text: resumeText || null,
        skills: skills,
      });

      // Update user context state
      updateUser({ profile_completed: true });

      navigate('/dashboard');
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
        position: 'absolute', top: '-60px', right: '-60px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'var(--jw-peach)', opacity: 0.25, filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-40px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'var(--jw-lavender)', opacity: 0.25, filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '560px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Logo size="lg" />
        </div>

        {/* Progress indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '12px', marginBottom: '32px',
        }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700,
                fontFamily: 'var(--font-bricolage)',
                background: step >= s ? 'var(--jw-coral)' : 'rgba(26,11,46,0.06)',
                color: step >= s ? 'white' : '#9ca3af',
                transition: 'all 0.3s ease',
              }}>
                {step > s ? <CheckCircle size={18} /> : s}
              </div>
              {s < 2 && (
                <div style={{
                  width: '80px', height: '2px',
                  background: step > 1
                    ? 'var(--jw-coral)'
                    : 'rgba(26,11,46,0.08)',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card" style={{
          padding: '44px 40px', borderRadius: '28px',
          boxShadow: '0 16px 64px rgba(26,11,46,0.08)',
        }}>
          {/* ─── Step 1: Resume ─── */}
          {step === 1 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(255,107,107,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <FileText size={28} color="var(--jw-coral)" />
                </div>
                <h2 className="font-bricolage" style={{
                  fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)',
                  marginBottom: '8px',
                }}>Upload your resume</h2>
                <p className="font-outfit" style={{
                  fontSize: '0.9rem', color: '#9ca3af',
                }}>
                  We&apos;ll extract your skills and experience to find perfect matches.
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

              {/* Upload zone */}
              {!uploadSuccess ? (
                <>
                  <label
                    htmlFor="resume-upload"
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: '40px 24px', borderRadius: '20px',
                      border: '2px dashed',
                      borderColor: resumeFile ? 'var(--jw-coral)' : 'rgba(26,11,46,0.12)',
                      background: resumeFile ? 'rgba(255,107,107,0.03)' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer', marginBottom: '20px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Upload size={32} color={resumeFile ? 'var(--jw-coral)' : '#9ca3af'} style={{ marginBottom: '12px' }} />
                    {resumeFile ? (
                      <span className="font-outfit" style={{
                        fontSize: '0.9rem', fontWeight: 600, color: 'var(--jw-dark)',
                      }}>
                        {resumeFile.name}
                      </span>
                    ) : (
                      <>
                        <span className="font-outfit" style={{
                          fontSize: '0.9rem', fontWeight: 600, color: 'var(--jw-dark)', marginBottom: '4px',
                        }}>
                          Click to upload PDF
                        </span>
                        <span className="font-outfit" style={{
                          fontSize: '0.75rem', color: '#9ca3af',
                        }}>
                          Max 10MB • PDF only
                        </span>
                      </>
                    )}
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <button
                    onClick={handleUploadResume}
                    disabled={!resumeFile || loading}
                    className="btn-coral font-outfit"
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', opacity: (!resumeFile || loading) ? 0.5 : 1,
                      cursor: (!resumeFile || loading) ? 'not-allowed' : 'pointer',
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
                        <Sparkles size={18} /> Extract Skills from Resume
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Success state */
                <div style={{
                  padding: '24px', borderRadius: '16px', marginBottom: '20px',
                  background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,200,83,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <CheckCircle size={20} color="#00C853" />
                    <span className="font-bricolage" style={{
                      fontSize: '1rem', fontWeight: 700, color: '#00C853',
                    }}>Resume uploaded successfully!</span>
                  </div>
                  {resumeText && (
                    <p className="font-outfit" style={{
                      fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.6,
                      maxHeight: '80px', overflow: 'hidden',
                    }}>
                      {resumeText}
                    </p>
                  )}
                </div>
              )}

              {/* Skip / Next */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: '24px',
              }}>
                <button
                  onClick={() => { setStep(2); setError(''); }}
                  className="font-outfit"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9ca3af', fontSize: '0.85rem',
                  }}
                >
                  Skip for now →
                </button>
                {uploadSuccess && (
                  <button
                    onClick={() => { setStep(2); setError(''); }}
                    className="btn-dark font-outfit"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </>
          )}

          {/* ─── Step 2: Skills ─── */}
          {step === 2 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(124,58,237,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Sparkles size={28} color="#7C3AED" />
                </div>
                <h2 className="font-bricolage" style={{
                  fontSize: '1.5rem', fontWeight: 800, color: 'var(--jw-dark)',
                  marginBottom: '8px',
                }}>Add your skills</h2>
                <p className="font-outfit" style={{
                  fontSize: '0.9rem', color: '#9ca3af',
                }}>
                  Add the skills you want employers to match against. Type and press Enter.
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

              {/* Skill input */}
              <div style={{
                display: 'flex', gap: '10px', marginBottom: '20px',
              }}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Python, React, SQL..."
                  className="font-outfit"
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: '14px',
                    border: '1.5px solid rgba(26,11,46,0.1)',
                    background: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                    color: 'var(--jw-dark)', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(26,11,46,0.1)'}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  style={{
                    padding: '14px 18px', borderRadius: '14px',
                    background: 'var(--jw-dark)', color: 'white', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Skills tags */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '10px',
                minHeight: '60px', padding: '16px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(26,11,46,0.05)',
                marginBottom: '28px',
              }}>
                {skills.length === 0 && (
                  <span className="font-outfit" style={{
                    fontSize: '0.8rem', color: '#9ca3af', alignSelf: 'center',
                  }}>
                    Your skills will appear here...
                  </span>
                )}
                {skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '9999px',
                      background: 'rgba(124,58,237,0.08)', color: '#7C3AED',
                      fontSize: '0.8rem', fontWeight: 600,
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0', display: 'flex', color: '#7C3AED',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setStep(1); setError(''); }}
                  className="font-outfit"
                  style={{
                    padding: '14px 24px', borderRadius: '9999px',
                    background: 'transparent', border: '1.5px solid rgba(26,11,46,0.1)',
                    cursor: 'pointer', color: 'var(--jw-dark)', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="btn-coral font-outfit"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', opacity: loading ? 0.7 : 1,
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
                      <CheckCircle size={18} /> Complete Profile
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Step labels */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '100px',
          marginTop: '16px',
        }}>
          <span className="font-outfit" style={{
            fontSize: '0.75rem', color: step === 1 ? 'var(--jw-dark)' : '#9ca3af',
            fontWeight: step === 1 ? 600 : 400,
          }}>Resume</span>
          <span className="font-outfit" style={{
            fontSize: '0.75rem', color: step === 2 ? 'var(--jw-dark)' : '#9ca3af',
            fontWeight: step === 2 ? 600 : 400,
          }}>Skills</span>
        </div>
      </div>
    </div>
  );
};

export default CandidateOnboarding;
