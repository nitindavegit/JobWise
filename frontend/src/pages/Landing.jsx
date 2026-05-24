import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chip from '../components/Chip';
import MatchRing from '../components/MatchRing';
import { CloudArrowUp, Crosshair, Gauge, Lightning, Flame, SealCheck, Bank, RocketLaunch, ArrowRight, Sparkle } from '@phosphor-icons/react';

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

/* ── Scroll-triggered section ── */
const FadeSection = ({ children, style = {}, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const brandTiles = [
  { name: 'Acme Corp',   initials: 'AC', color: '#FF6B6B' },
  { name: 'Beam AI',     initials: 'BA', color: '#7C3AED' },
  { name: 'Cloudnine',   initials: 'CN', color: '#00BCD4' },
  { name: 'DevStudio',   initials: 'DS', color: '#FFA726' },
  { name: 'EdgeTech',    initials: 'ET', color: '#10B981' },
  { name: 'Flowbase',    initials: 'FB', color: '#EC4899' },
  { name: 'GitForge',    initials: 'GF', color: '#1A0B2E' },
  { name: 'Hoppr',       initials: 'Hp', color: '#2196F3' },
];

const features = [
  { icon: Crosshair, iconBg: '#FFE8E0', iconColor: '#FF6B6B', title: 'AI Skill Matching', desc: 'TF-IDF vectorization and cosine similarity match your real skills to job requirements — not just keyword stuffing.' },
  { icon: CloudArrowUp, iconBg: '#E0D4FF', iconColor: '#7C3AED', title: 'Resume Analysis', desc: 'Upload your PDF resume and we extract, understand, and map your skills automatically.' },
  { icon: Gauge, iconBg: 'rgba(0,230,118,0.1)', iconColor: '#00C853', title: 'Match Scores', desc: 'See exactly how well you fit each role with a transparent percentage score and skill breakdown.' },
  { icon: Lightning, iconBg: '#FFF3E0', iconColor: '#FFA726', title: 'One-Click Apply', desc: 'Found your match? Apply instantly — your resume and skills are already on file.' },
  { icon: Flame, iconBg: '#FFD1DC', iconColor: '#C2185B', title: 'Quality Over Quantity', desc: 'No endless scrolling. Only curated, AI-recommended jobs that match your profile.' },
  { icon: Bank, iconBg: 'rgba(26,11,46,0.06)', iconColor: '#1A0B2E', title: 'For Employers Too', desc: 'Post jobs and see pre-scored candidates ranked by how well they match your requirements.' },
];

const steps = [
  { step: '01', icon: CloudArrowUp, title: 'Upload Resume', desc: 'Upload your PDF resume or paste your skills. Our AI extracts and maps your capabilities.', color: '#FF6B6B', bg: '#FFE8E0' },
  { step: '02', icon: Crosshair, title: 'Get Matched', desc: 'Our TF-IDF engine compares your skills against every open role and ranks them by match %.', color: '#7C3AED', bg: '#E0D4FF' },
  { step: '03', icon: RocketLaunch, title: 'Apply & Track', desc: 'Apply with one click to your best matches. Track application status in real-time.', color: '#00C853', bg: 'rgba(0,230,118,0.1)' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Frontend Developer', quote: 'I uploaded my resume and within seconds had 5 perfectly matched roles. Got hired in 2 weeks!', score: 94 },
  { name: 'Alex Johnson', role: 'HR Director, TechCorp', quote: 'The match scores saved us hours of resume screening. We only see candidates who actually fit.', score: 91 },
  { name: 'Rahul Patel', role: 'Full Stack Developer', quote: 'Unlike other platforms, JobWise showed me roles I was actually qualified for. No more applying blindly.', score: 88 },
];

const employerStats = [
  { value: '73%', label: 'Faster hiring', icon: Lightning },
  { value: '4.2×', label: 'Better matches', icon: Crosshair },
  { value: '89%', label: 'Accept rate', icon: SealCheck },
  { value: '< 48h', label: 'Avg. time to fill', icon: Gauge },
];

const Landing = () => (
  <div style={{ background: 'var(--jw-bg)', minHeight: '100vh' }}>
    <Navbar />

    {/* ══ HERO ══ */}
    <section style={{ backgroundImage: 'var(--mesh-bg)', backgroundColor: 'var(--jw-bg)', position: 'relative', overflow: 'hidden', paddingTop: '140px', paddingBottom: '120px' }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'absolute', top: '60px', right: '40px', width: '360px', height: '360px', borderRadius: '50%', background: 'var(--jw-peach)', opacity: 0.3, filter: 'blur(90px)', pointerEvents: 'none' }} 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ position: 'absolute', bottom: '40px', left: '20px', width: '440px', height: '440px', borderRadius: '50%', background: 'var(--jw-lavender)', opacity: 0.25, filter: 'blur(90px)', pointerEvents: 'none' }} 
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 10 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <Chip variant="default" style={{ marginBottom: '24px', display: 'inline-flex' }}>✦ Skill-Based Matching</Chip>
            </motion.div>

            <h1 className="font-instrument" style={{ fontSize: 'clamp(2.8rem,5.5vw,4.8rem)', color: 'var(--jw-dark)', lineHeight: 1.06, marginBottom: '24px' }}>
              Your skills deserve the{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--jw-coral)' }}>right opportunity.</em>
            </h1>

            <p className="font-outfit" style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '40px', maxWidth: '480px' }}>
              Upload your resume and let our AI find jobs that truly match your skills.
              No browsing, no guessing — just personalized matches.
            </p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} style={{ display: 'flex', gap: '16px', marginBottom: '56px', flexWrap: 'wrap' }}>
              <Link to="/signup"><button className="btn-coral font-outfit" style={{ fontSize: '1rem' }}><CloudArrowUp weight="duotone" size={18} /> Upload Resume</button></Link>
              <Link to="/signup"><button className="btn-dark font-outfit" style={{ fontSize: '1rem' }}><Bank weight="duotone" size={18} /> I'm Hiring</button></Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} variants={fadeUp} style={{ display: 'flex', gap: '48px' }}>
              {/* Single-column stat panel — right of headline / left of deck */}
              <motion.div className="jw-hero-right-band" variants={fadeUp}>
                <div className="jw-band-stat">
                  <span className="jw-band-stat-val font-bricolage">94%</span>
                  <span className="jw-band-stat-lbl">Match Accuracy</span>
                </div>
                <div className="jw-band-stat">
                  <span className="jw-band-stat-val font-bricolage">2.1k+</span>
                  <span className="jw-band-stat-lbl">Jobs Matched</span>
                </div>
                <div className="jw-band-stat">
                  <span className="jw-band-stat-val font-bricolage">&lt; 30s</span>
                  <span className="jw-band-stat-lbl">Time to First Match</span>
                </div>
                <div className="jw-band-stat">
                  <span className="jw-band-stat-val font-bricolage">89%</span>
                  <span className="jw-band-stat-lbl">Avg. Interview Rate</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right — detailed job card matching reference */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="jw-hero-deck"
          >
            <div className="orbit-ring orbit-1" />
            <div className="orbit-ring orbit-2" />

            {/* Main detailed job card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="jw-deck-job"
              style={{ width: '340px', padding: '28px 26px' }}
            >
              {/* Top row: Best Match + Live match ring */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="deck-label">◆ BEST MATCH</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MatchRing score={96} size={28} />
                  <span className="font-outfit" style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--jw-dark)' }}>Live match</span>
                </div>
              </div>

              {/* Job title + bookmark */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <h3 className="font-bricolage" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--jw-dark)', lineHeight: 1.2 }}>
                  Senior Frontend<br/>Developer
                </h3>
                <span style={{ fontSize: '1.1rem', cursor: 'pointer', opacity: 0.4 }}>🔖</span>
              </div>

              {/* Company info row */}
              <div className="jw-deck-company" style={{ marginBottom: '14px' }}>
                <span className="c-icon">VF</span>
                <div style={{ flex: 1 }}>
                  <span className="font-bricolage" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--jw-dark)', display: 'block' }}>VercelForge</span>
                  <span className="font-outfit" style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Remote · Product Engineering · Series B</span>
                </div>
                <span className="font-outfit" style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600, whiteSpace: 'nowrap' }}>● Interview ready</span>
              </div>

              {/* Skill pills */}
              <div className="jw-deck-skills" style={{ marginBottom: '16px' }}>
                {['React', 'TypeScript', 'Node.js', 'Design Systems'].map(s => (
                  <span key={s} style={{ padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(26,11,46,0.12)', fontSize: '0.68rem', fontWeight: 500, color: 'var(--jw-dark)' }}>{s}</span>
                ))}
              </div>

              {/* Stats row: Match / Seniority / Posted */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {[{ label: 'MATCH', value: '96%' }, { label: 'SENIORITY', value: 'Senior' }, { label: 'POSTED', value: '2d ago' }].map(s => (
                  <div key={s.label} style={{ padding: '10px 8px', border: '1px solid rgba(26,11,46,0.08)', borderRadius: '12px', textAlign: 'center' }}>
                    <div className="font-outfit" style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: '2px' }}>{s.label}</div>
                    <div className="font-bricolage" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--jw-dark)' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Bottom row: salary + apply */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ padding: '8px 14px', borderRadius: '9999px', background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', fontSize: '0.76rem', fontWeight: 700 }}>$130k - $165k</span>
                <span style={{ padding: '8px 14px', borderRadius: '9999px', background: 'var(--jw-coral)', color: 'white', fontSize: '0.76rem', fontWeight: 700, marginLeft: 'auto', cursor: 'pointer' }}>Apply now</span>
              </div>
            </motion.div>

            {/* Floating: Profile Fit */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="jw-nudge-float"
              style={{ top: '8px', right: '-30px' }}
            >
              <div className="ring-icon">
                <div className="ring-inner"><MatchRing score={88} size={16} /></div>
              </div>
              <div>
                <div className="font-outfit" style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af' }}>PROFILE FIT</div>
                <div className="font-bricolage" style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--jw-dark)' }}>Full Stack · 88%</div>
              </div>
            </motion.div>

            {/* Floating: Interview Awaiting */}
            <motion.div
              animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="jw-nudge-float"
              style={{ bottom: '28px', left: '-28px' }}
            >
              <span className="status-dot" style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
              Interview Awaiting
            </motion.div>

            {/* Floating: Salary badge (dark) */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="jw-nudge-float"
              style={{ bottom: '44%', right: '-40px', padding: '10px 16px', background: 'var(--jw-dark)', color: 'white', borderRadius: '14px' }}
            >
              <div>
                <div style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', opacity: .6, marginBottom: 2 }}>SALARY</div>
                <span className="font-bricolage" style={{ fontWeight: 800, fontSize: '0.92rem' }}>$165k upper range</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

     {/* ══ LOGO / BRAND TILE STRIP ══ */}
     <div style={{ padding: '52px 0', overflow: 'hidden', background: 'white', borderTop: '1px solid rgba(26,11,46,0.05)', borderBottom: '1px solid rgba(26,11,46,0.05)' }}>
       <p className="font-outfit" style={{ fontSize: '0.68rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#c4c4c4', marginBottom: '32px' }}>
         Trusted by talent at
       </p>
       <div style={{ position: 'relative', overflow: 'hidden' }}>
         <div className="animate-marquee-scroll" style={{ display: 'flex', gap: '40px', width: 'max-content' }}>
           {[...brandTiles, ...brandTiles, ...brandTiles].map((b, ci) => (
             <span
               key={ci}
               className="jw-brand-tile"
               style={{
                 background: b.color,
                 boxShadow: `0 4px 14px ${b.color}44`,
               }}
               title={b.name}
             >
               <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '.03em' }}>{b.initials}</span>
               <span style={{ fontSize: '0.76rem', fontWeight: 500, opacity: 0.88 }}>{b.name}</span>
             </span>
           ))}
         </div>
       </div>
     </div>

    {/* ══ FEATURES (Bento Grid) ══ */}
    <section id="features" style={{ padding: '112px 40px', background: 'var(--jw-bg2)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <FadeSection style={{ textAlign: 'center', marginBottom: '72px' }}>
          <motion.div variants={fadeUp}>
            <Chip variant="coral" style={{ marginBottom: '16px', display: 'inline-flex' }}>Why JobWise</Chip>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-instrument" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: 'var(--jw-dark)', marginBottom: '16px' }}>
            Not just another job board.
          </motion.h2>
          <motion.p variants={fadeUp} className="font-outfit" style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
            We don't let you scroll endlessly. Our AI reads your resume, understands your skills,
            and serves only the jobs that actually fit.
          </motion.p>
        </FadeSection>

        {/* Bento Row 1: Large card (2-col) + 2 stacked cards */}
        <FadeSection style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Card 1: Semantic Resume Parsing - large */}
          <motion.div variants={fadeUp} style={{ background: '#FAF9FB', borderRadius: '24px', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px', border: '1px solid rgba(26,11,46,0.05)' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FFE8E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Crosshair weight="duotone" size={22} color="#FF6B6B" />
              </div>
              <h3 className="font-bricolage" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '10px' }}>Semantic resume parsing</h3>
              <p className="font-outfit" style={{ fontSize: '0.92rem', color: '#6b7280', lineHeight: 1.65, maxWidth: '380px' }}>
                We don't keyword match. We use TF-IDF vectorization and cosine similarity to read context — your projects, impact, and ambition.
              </p>
            </div>
          </motion.div>

          {/* Right stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Card 2: Honest Match Scoring */}
            <motion.div variants={fadeUp} style={{ background: '#FAF9FB', borderRadius: '24px', padding: '32px 28px', flex: 1, border: '1px solid rgba(26,11,46,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <SealCheck weight="duotone" size={22} color="#00C853" />
              </div>
              <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '8px' }}>Honest match scoring</h3>
              <p className="font-outfit" style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>Every job shows a real compatibility %, calibrated to your full profile.</p>
            </motion.div>

            {/* Card 3: One-Click Apply */}
            <motion.div variants={fadeUp} style={{ background: '#FAF9FB', borderRadius: '24px', padding: '32px 28px', flex: 1, border: '1px solid rgba(26,11,46,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#E0D4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Lightning weight="duotone" size={22} color="#7C3AED" />
              </div>
              <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '8px' }}>One-click apply</h3>
              <p className="font-outfit" style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>Pre-filled with your story. Apply in seconds, not hours.</p>
            </motion.div>
          </div>
        </FadeSection>

        {/* Bento Row 2: 3 equal cards, last one dark */}
        <FadeSection style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          <motion.div variants={fadeUp} style={{ background: '#FAF9FB', borderRadius: '24px', padding: '32px 28px', border: '1px solid rgba(26,11,46,0.05)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FFE8E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CloudArrowUp weight="duotone" size={22} color="#FF6B6B" />
            </div>
            <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '8px' }}>PDF resume upload</h3>
            <p className="font-outfit" style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>Drop your resume in. We do the rest.</p>
          </motion.div>

          <motion.div variants={fadeUp} style={{ background: '#FAF9FB', borderRadius: '24px', padding: '32px 28px', border: '1px solid rgba(26,11,46,0.05)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Gauge weight="duotone" size={22} color="#00C853" />
            </div>
            <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '8px' }}>Personalized feed</h3>
            <p className="font-outfit" style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>Recommendations get sharper every interaction.</p>
          </motion.div>

          {/* Dark accent card */}
          <motion.div variants={fadeUp} style={{ background: 'var(--jw-dark)', borderRadius: '24px', padding: '32px 28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Bank weight="duotone" size={22} color="#FF6B6B" />
            </div>
            <h3 className="font-bricolage" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Employer analytics</h3>
            <p className="font-outfit" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Hire smarter with applicant fit scores.</p>
          </motion.div>
        </FadeSection>
      </div>
    </section>

    {/* ══ HOW IT WORKS — sequential reveal ══ */}
    <section id="how-it-works" style={{ padding: '112px 40px', background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <FadeSection style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.div variants={fadeUp}>
            <Chip variant="success" style={{ marginBottom: '16px', display: 'inline-flex' }}>Simple Process</Chip>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-instrument" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: 'var(--jw-dark)' }}>
            Three steps to your{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--jw-coral)' }}>perfect match.</em>
          </motion.h2>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '48px', position: 'relative' }}>
          {/* Animated connector line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', top: '36px', left: 'calc(16.66% + 36px)', right: 'calc(16.66% + 36px)', height: '3px', background: 'linear-gradient(90deg,var(--jw-coral),var(--jw-lavender),var(--jw-lime))', zIndex: 0, transformOrigin: 'left center', borderRadius: '2px' }}
          />
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.3 * (idx + 1), ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 * (idx + 1) + 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08 }}
                style={{ width: '72px', height: '72px', borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: `0 8px 24px ${item.color}33` }}
              >
                <item.icon size={28} color={item.color} />
              </motion.div>
              <div className="font-bricolage" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: item.color, marginBottom: '10px' }}>{item.step}</div>
              <h3 className="font-bricolage" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--jw-dark)', marginBottom: '12px' }}>{item.title}</h3>
              <p className="font-outfit" style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.65, maxWidth: '280px', margin: '0 auto' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ FOR EMPLOYERS (dark) ══ */}
    <section id="employers" className="section-dark" style={{ padding: '112px 40px' }}>
      <div style={{ position: 'absolute', top: '40px', right: '80px', width: '320px', height: '320px', borderRadius: '50%', background: '#FF6B6B', opacity: 0.07, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '380px', height: '380px', borderRadius: '50%', background: '#7C3AED', opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <FadeSection>
            <motion.div variants={fadeLeft}>
              <Chip variant="coral" style={{ marginBottom: '24px', display: 'inline-flex' }}>For Employers</Chip>
            </motion.div>
            <motion.h2 variants={fadeLeft} className="font-instrument" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '24px', lineHeight: 1.15 }}>
              Find candidates who{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--jw-coral)' }}>actually fit</em> your roles.
            </motion.h2>
            <motion.p variants={fadeLeft} className="font-outfit" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: '36px' }}>
              Stop sifting through hundreds of unqualified resumes. Post a job and see candidates
              pre-ranked by match score. Accept or reject with one click.
            </motion.p>
            <motion.div variants={fadeLeft}>
              <Link to="/signup">
                <button className="btn-coral font-outfit" style={{ fontSize: '1rem' }}>
                  Start Hiring <ArrowRight weight="duotone" size={16} />
                </button>
              </Link>
            </motion.div>
          </FadeSection>

          <FadeSection style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {employerStats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} whileHover={{ scale: 1.03 }} style={{ padding: '28px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'default' }}>
                <s.icon size={20} color="var(--jw-coral)" style={{ marginBottom: '16px' }} />
                <div className="font-bricolage" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{s.value}</div>
                <div className="font-outfit" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </motion.div>
            ))}
          </FadeSection>
        </div>
      </div>
    </section>

    {/* ══ TESTIMONIALS ══ */}
    <section style={{ padding: '112px 40px', background: 'var(--jw-bg)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <FadeSection style={{ textAlign: 'center', marginBottom: '72px' }}>
          <motion.div variants={fadeUp}>
            <Chip variant="default" style={{ marginBottom: '16px', display: 'inline-flex' }}>Testimonials</Chip>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-instrument" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--jw-dark)' }}>
            Loved by candidates & employers.
          </motion.h2>
        </FadeSection>

        <FadeSection style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="glass-card" style={{ padding: '36px', borderRadius: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                {[...Array(5)].map((_, i) => <Sparkle weight="duotone" key={i} size={14} fill="#FFA726" color="#FFA726" />)}
              </div>
              <p className="font-outfit" style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '28px' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div className="font-bricolage" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--jw-dark)' }}>{t.name}</div>
                  <div className="font-outfit" style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{t.role}</div>
                </div>
                <MatchRing score={t.score} size={48} />
              </div>
            </motion.div>
          ))}
        </FadeSection>
      </div>
    </section>

    {/* ══ CTA BANNER — subtle gradient ══ */}
    <section style={{ padding: '0 40px 112px' }}>
      <FadeSection>
        <motion.div variants={fadeUp} style={{ maxWidth: '1080px', margin: '0 auto', borderRadius: '40px', padding: '72px 64px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--jw-dark) 0%, #2D1B4E 40%, #4A2040 70%, var(--jw-coral) 100%)' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 20% 50%,white 0px,transparent 50%),radial-gradient(circle at 85% 30%,white 0px,transparent 40%)' }} />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 className="font-instrument" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '12px', lineHeight: 1.1 }}>
                Your next role is already{' '}<em style={{ fontStyle: 'italic', color: 'var(--jw-peach)' }}>looking for you.</em>
              </h2>
              <p className="font-outfit" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '440px', lineHeight: 1.7 }}>
                Join thousands of candidates and employers who've discovered smarter hiring with JobWise.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.04, y: -2 }} className="font-outfit" style={{ fontWeight: 600, padding: '16px 32px', borderRadius: '9999px', background: 'var(--jw-peach)', color: 'var(--jw-dark)', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                  I'm looking for work
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.04, y: -2 }} className="font-outfit" style={{ fontWeight: 600, padding: '16px 32px', borderRadius: '9999px', background: 'var(--jw-dark)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.95rem' }}>
                  I'm hiring
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </FadeSection>
    </section>

    <Footer />
  </div>
);

export default Landing;