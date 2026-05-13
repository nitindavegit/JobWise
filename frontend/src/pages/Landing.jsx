import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chip from '../components/Chip';
import MatchRing from '../components/MatchRing';
import {
  Upload, Target, TrendingUp, Zap, Shield,
  CheckCircle, Building2, ArrowRight, Star,
} from 'lucide-react';

/* ───────── LANDING ───────── */
const Landing = () => {
  const companyBadges = ['S', 'N', 'L', 'F', 'V', 'A', 'G', 'T'];
  const badgeColors = ['#FF6B6B', '#7C3AED', '#00E676', '#FFA726', '#1A0B2E', '#FF4081', '#2196F3', '#00BCD4'];

  return (
    <div style={{ background: 'var(--jw-bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        style={{
          backgroundImage: 'var(--mesh-bg)',
          backgroundColor: 'var(--jw-bg)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '140px',
          paddingBottom: '100px',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '60px', right: '40px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'var(--jw-peach)', opacity: 0.25, filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '40px', left: '20px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'var(--jw-lavender)', opacity: 0.2, filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left — Copy */}
            <div className="animate-fade-up" style={{ position: 'relative', zIndex: 10 }}>
              <Chip variant="default" style={{ marginBottom: '24px', display: 'inline-flex' }}>AI-Powered Matching</Chip>

              <h1 className="font-instrument" style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                color: 'var(--jw-dark)',
                lineHeight: 1.08,
                marginBottom: '24px',
              }}>
                Your skills deserve the{' '}
                <span style={{ fontStyle: 'italic', color: 'var(--jw-coral)' }}>right opportunity.</span>
              </h1>

              <p className="font-outfit" style={{
                fontSize: '1.125rem', color: '#6b7280',
                lineHeight: 1.7, marginBottom: '36px', maxWidth: '480px',
              }}>
                Upload your resume and let our AI find jobs that truly match your skills.
                No browsing, no guessing — just personalized matches.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
                <Link to="/signup">
                  <button className="btn-coral font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={18} /> Upload Resume
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="btn-dark font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={18} /> I&apos;m Hiring
                  </button>
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '48px' }}>
                {[
                  { value: '94%', label: 'Match accuracy' },
                  { value: '2.1k+', label: 'Jobs matched' },
                  { value: '< 30s', label: 'Time to match' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-bricolage" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--jw-dark)' }}>{s.value}</div>
                    <div className="font-outfit" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Match Demo */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
              {/* Main card */}
              <div className="glass-card animate-float-slow" style={{
                padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '340px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <MatchRing score={96} size={120} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-bricolage" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '4px' }}>Best Match</div>
                  <div className="font-outfit" style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '16px' }}>Senior Frontend Developer</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {['React', 'TypeScript', 'Node.js'].map((s) => (
                      <Chip key={s} variant="skill" style={{ fontSize: '0.65rem' }}>{s}</Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating skill card */}
              <div className="glass-card animate-float-x" style={{
                position: 'absolute', top: '20px', right: '-10px',
                padding: '12px 16px', borderRadius: '16px', zIndex: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E676' }} />
                  <span className="font-outfit" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--jw-dark)' }}>React — Expert</span>
                </div>
              </div>

              {/* Floating match card */}
              <div className="glass-card animate-float-x" style={{
                position: 'absolute', bottom: '40px', left: '-10px',
                padding: '12px 16px', borderRadius: '16px', zIndex: 20,
                animationDelay: '1.5s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MatchRing score={88} size={32} />
                  <span className="font-outfit" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--jw-dark)' }}>Full Stack Dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ LOGO STRIP ══════════════════ */}
      <div style={{
        padding: '48px 0', overflow: 'hidden',
        background: 'white',
        borderTop: '1px solid rgba(26,11,46,0.04)',
        borderBottom: '1px solid rgba(26,11,46,0.04)',
      }}>
        <p className="font-outfit" style={{
          fontSize: '0.7rem', textAlign: 'center',
          textTransform: 'uppercase', letterSpacing: '0.15em',
          color: '#9ca3af', marginBottom: '32px',
        }}>
          Trusted by companies worldwide
        </p>
        <div style={{ position: 'relative' }}>
          <div className="animate-marquee-scroll" style={{ display: 'flex', gap: '40px' }}>
            {[...companyBadges, ...companyBadges].map((letter, i) => (
              <div key={i} className="font-bricolage" style={{
                flexShrink: 0, width: '48px', height: '48px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.125rem', fontWeight: 700, color: 'white',
                background: badgeColors[i % badgeColors.length],
              }}>
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section id="features" style={{ padding: '100px 40px', background: 'var(--jw-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Chip variant="coral" style={{ marginBottom: '16px', display: 'inline-flex' }}>Why JobWise</Chip>
            <h2 className="font-instrument" style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--jw-dark)', marginBottom: '16px',
            }}>
              Not just another job board.
            </h2>
            <p className="font-outfit" style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              We don&apos;t let you scroll endlessly. Our AI reads your resume, understands your skills,
              and serves only the jobs that actually fit.
            </p>
          </div>

          {/* Feature cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: Target, iconBg: '#FFE8E0', iconColor: '#FF6B6B', title: 'AI Skill Matching', desc: 'TF-IDF vectorization and cosine similarity match your real skills to job requirements — not just keyword stuffing.' },
              { icon: Upload, iconBg: '#E0D4FF', iconColor: '#7C3AED', title: 'Resume Analysis', desc: 'Upload your PDF resume and we extract, understand, and map your skills automatically.' },
              { icon: TrendingUp, iconBg: 'rgba(0,230,118,0.1)', iconColor: '#00C853', title: 'Match Scores', desc: 'See exactly how well you fit each role with a transparent percentage score and skill breakdown.' },
              { icon: Zap, iconBg: '#FFF3E0', iconColor: '#FFA726', title: 'One-Click Apply', desc: 'Found your match? Apply instantly — your resume and skills are already on file.' },
              { icon: Shield, iconBg: '#FFD1DC', iconColor: '#C2185B', title: 'Quality Over Quantity', desc: 'No endless scrolling. Only curated, AI-recommended jobs that match your profile.' },
              { icon: Building2, iconBg: 'rgba(26,11,46,0.06)', iconColor: '#1A0B2E', title: 'For Employers Too', desc: 'Post jobs and see pre-scored candidates ranked by how well they match your requirements.' },
            ].map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
              <div key={title} className="glass-card" style={{
                padding: '36px 32px', borderRadius: '24px', textAlign: 'center',
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <Icon size={28} color={iconColor} />
                </div>
                <h3 className="font-bricolage" style={{
                  fontSize: '1.2rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px',
                }}>{title}</h3>
                <p className="font-outfit" style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section id="how-it-works" style={{ padding: '100px 40px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <Chip variant="success" style={{ marginBottom: '16px', display: 'inline-flex' }}>Simple Process</Chip>
            <h2 className="font-instrument" style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--jw-dark)',
            }}>
              Three steps to your <span style={{ fontStyle: 'italic', color: 'var(--jw-coral)' }}>perfect match.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: '36px', left: '20%', right: '20%', height: '2px',
              background: 'linear-gradient(90deg, var(--jw-lavender), var(--jw-peach), var(--jw-lavender))',
              display: 'none',
            }} className="md:!block" />

            {[
              { step: '01', icon: Upload, title: 'Upload Resume', desc: 'Upload your PDF resume or paste your skills and experience. Our AI extracts and maps your capabilities.', color: '#FF6B6B', bg: '#FFE8E0' },
              { step: '02', icon: Target, title: 'Get Matched', desc: 'Our TF-IDF engine compares your skills against every open role and ranks them by match percentage.', color: '#7C3AED', bg: '#E0D4FF' },
              { step: '03', icon: CheckCircle, title: 'Apply & Track', desc: 'Apply with one click to your best matches. Track application status in real-time.', color: '#00C853', bg: 'rgba(0,230,118,0.1)' },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', position: 'relative', zIndex: 10,
                }}>
                  <item.icon size={28} color={item.color} />
                </div>
                <div className="font-bricolage" style={{
                  fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.05em', color: item.color, marginBottom: '10px',
                }}>{item.step}</div>
                <h3 className="font-bricolage" style={{
                  fontSize: '1.25rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px',
                }}>{item.title}</h3>
                <p className="font-outfit" style={{
                  fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.65, maxWidth: '300px', margin: '0 auto',
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FOR EMPLOYERS ══════════════════ */}
      <section id="employers" style={{
        padding: '100px 40px', background: 'var(--jw-dark)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '40px', right: '80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: '#FF6B6B', opacity: 0.08, filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '40px', left: '40px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: '#7C3AED', opacity: 0.06, filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <Chip variant="coral" style={{ marginBottom: '24px', display: 'inline-flex' }}>For Employers</Chip>
              <h2 className="font-instrument" style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', marginBottom: '24px',
              }}>
                Find candidates who{' '}
                <span style={{ fontStyle: 'italic', color: 'var(--jw-coral)' }}>actually fit</span> your roles.
              </h2>
              <p className="font-outfit" style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '36px',
              }}>
                Stop sifting through hundreds of unqualified resumes. Post a job and see candidates
                pre-ranked by match score. Accept or reject with one click.
              </p>
              <Link to="/signup">
                <button className="btn-coral font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Start Hiring <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { value: '73%', label: 'Faster hiring', icon: Zap },
                { value: '4.2×', label: 'Better matches', icon: Target },
                { value: '89%', label: 'Accept rate', icon: CheckCircle },
                { value: '< 48h', label: 'Avg. time to fill', icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} style={{
                  padding: '28px 24px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <s.icon size={20} color="var(--jw-coral)" style={{ marginBottom: '16px' }} />
                  <div className="font-bricolage" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{s.value}</div>
                  <div className="font-outfit" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section style={{ padding: '100px 40px', background: 'var(--jw-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Chip variant="default" style={{ marginBottom: '16px', display: 'inline-flex' }}>Testimonials</Chip>
            <h2 className="font-instrument" style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--jw-dark)',
            }}>
              Loved by candidates &amp; employers.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { name: 'Priya Sharma', role: 'Frontend Developer', quote: 'I uploaded my resume and within seconds had 5 perfectly matched roles. Got hired in 2 weeks!', score: 94 },
              { name: 'Alex Johnson', role: 'HR Director, TechCorp', quote: 'The match scores saved us hours of resume screening. We only see candidates who actually fit.', score: 91 },
              { name: 'Rahul Patel', role: 'Full Stack Developer', quote: 'Unlike other platforms, JobWise showed me roles I was actually qualified for. No more applying blindly.', score: 88 },
            ].map((t) => (
              <div key={t.name} className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FFA726" color="#FFA726" />)}
                </div>
                <p className="font-outfit" style={{
                  fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '28px',
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="font-bricolage" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--jw-dark)' }}>{t.name}</div>
                    <div className="font-outfit" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t.role}</div>
                  </div>
                  <MatchRing score={t.score} size={44} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA BANNER ══════════════════ */}
      <section style={{ padding: '0 40px 100px' }}>
        <div style={{
          maxWidth: '1080px', margin: '0 auto', borderRadius: '40px',
          padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--jw-coral) 0%, #FF8A80 50%, #FFA726 100%)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 0px, transparent 50%), radial-gradient(circle at 80% 50%, white 0px, transparent 50%)',
          }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 className="font-instrument" style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'white', marginBottom: '16px',
            }}>
              Ready to find your <span style={{ fontStyle: 'italic' }}>perfect match?</span>
            </h2>
            <p className="font-outfit" style={{
              fontSize: '1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '36px',
              maxWidth: '520px', margin: '0 auto 36px',
            }}>
              Join thousands of candidates and employers who&apos;ve discovered smarter hiring with JobWise.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/signup">
                <button className="font-outfit" style={{
                  fontWeight: 600, padding: '16px 32px', borderRadius: '9999px',
                  background: 'white', color: 'var(--jw-coral)', border: 'none',
                  cursor: 'pointer', fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}>
                  Get Started Free
                </button>
              </Link>
              <Link to="/signup">
                <button className="font-outfit" style={{
                  fontWeight: 600, padding: '16px 32px', borderRadius: '9999px',
                  background: 'transparent', color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  cursor: 'pointer', fontSize: '1rem',
                }}>
                  I&apos;m Hiring
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;