import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import Logo from './Logo';
import { useAuth } from '../context/useAuth';

// ── Nav items — only shown on the landing page ──
const LANDING_LINKS = [
  { label: 'Features',      key: 'features',      href: '#features' },
  { label: 'How It Works',  key: 'how-it-works',  href: '#how-it-works' },
  { label: 'For Employers', key: 'for-employers',  href: '#employers' },
];

// ── Colour tokens ──
const CORAL = '#f07060';
const MUTED = '#555555';
const RADIUS = 60;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { user, logout } = useAuth();
  const location    = useLocation();
  const prevPathRef = useRef(location.pathname);
  const lastScrollY = useRef(0);
  const isLanding   = location.pathname === '/';

  // hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close mobile panel when route changes
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname;
      setMobileOpen(false);
    }
  }, [location.pathname]);

  // smooth anchor scroll (only on landing page)
  const handleAnchorClick = (e, href) => {
    if (isLanding && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  // initials for logged-in avatar circle
  const initials = (
    (user?.first_name?.[0] || '') +
    (user?.last_name?.[0]  || '') ||
    (user?.user_name?.[0]  || 'U')
  ).toUpperCase();

  return (
    // ── outer shell: fixed, inset from viewport edges ──
    // `flex justify-center` makes the pill sit dead-centre horizontally
    <nav
      className="jw-navbar-container"
      data-testid="navbar"
      aria-label="Primary navigation"
      style={{
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        transform: hidden ? 'translateY(-120%)' : 'translateY(0)',
      }}
    >
      {/* ── THE PILL ──
          `font-outfit` class → sets font-family here; all children inherit. */}
      <div
        className="font-outfit"
        style={{
          display         : 'flex',
          alignItems      : 'center',
          justifyContent  : 'space-between',
          gap             : '28px',
          padding         : '14px 36px',
          borderRadius    : `${RADIUS}px`,
          background      : '#ffffff',
          boxShadow       : '0 4px 6px rgba(0, 0, 0, 0.05)',
          border          : 'none',
          flexShrink      : 0,
        }}
      >

        {/* ─── Logo ─── */}
        <Link to="/" className="shrink-0" data-testid="navbar-logo" aria-label="JobWise home">
          <Logo size="md" />
        </Link>

        {/* ─── Centred nav links (hidden on mobile, only on landing) ─── */}
        {isLanding && (
        <div className="hidden md:flex items-center flex-1 justify-center" style={{ gap: '36px' }}>
          {LANDING_LINKS.map(({ label, key, href }) => (
                <a
                  key={key}
                  href={href}
                  onClick={(e) => handleAnchorClick(e, href)}
                  data-testid={`navbar-link-${key}`}
                  style={{
                    color           : MUTED,
                    fontWeight      : 500,
                    fontSize        : '15px',
                    textDecoration  : 'none',
                    transition      : 'color 0.18s ease',
                    fontFamily      : 'inherit',
                    cursor          : 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = CORAL; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = MUTED; }}
                >
                  {label}
                </a>
          ))}
        </div>
        )}
        {!isLanding && <div style={{ flex: 1 }} />}

        {/* ─── Auth / Profile (desktop) ─── */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          {!user ? (
            // ── Logged out: Get started only ──
            <Link
              to="/signup"
              data-testid="navbar-getstarted-btn"
              style={{
                display        : 'inline-block',
                background     : CORAL,
                color          : '#ffffff',
                fontWeight     : 600,
                fontSize       : '15px',
                borderRadius    : '20px',
                padding        : '10px 22px',
                fontFamily     : 'inherit',
                textDecoration : 'none',
              }}
            >
              Get started
            </Link>
          ) : (
            // ── Logged in: avatar + Log out ──
            <>
              <Link
                to="/dashboard"
                data-testid="navbar-avatar-btn"
                aria-label={`Profile — ${user.user_name}`}
                title={user.user_name}
                style={{
                  width          : '38px',
                  height         : '38px',
                  borderRadius    : '50%',
                  overflow       : 'hidden',
                  display        : 'flex',
                  alignItems     : 'center',
                  justifyContent : 'center',
                  textDecoration : 'none',
                  flexShrink     : 0,
                  border         : `2px solid ${CORAL}`,
                  background     : user?.profile_picture_url ? 'transparent' : CORAL,
                  color          : '#ffffff',
                  fontWeight     : 700,
                  fontSize       : '0.8rem',
                  fontFamily     : 'inherit',
                }}
              >
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : initials}
              </Link>

              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                data-testid="navbar-logout-btn"
                aria-label="Log out"
                style={{
                  color          : MUTED,
                  fontWeight     : 500,
                  fontSize       : '15px',
                  fontFamily     : 'inherit',
                  background     : 'none',
                  border         : 'none',
                  cursor         : 'pointer',
                  padding        : '8px 14px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = CORAL; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = MUTED; }}
              >
                Log out
              </button>
            </>
          )}
        </div>

        {/* ─── Mobile: show avatar if logged in ─── */}
        {user && (
          <Link
            to="/dashboard"
            className="jw-mobile-avatar"
            aria-label={`Profile — ${user.user_name}`}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              border: `2px solid ${CORAL}`,
              background: user?.profile_picture_url ? 'transparent' : CORAL,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.7rem',
              fontFamily: 'inherit',
            }}
          >
            {user?.profile_picture_url ? (
              <img src={user.profile_picture_url} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : initials}
          </Link>
        )}

        {/* ─── Mobile hamburger ─── */}
        <button
          className="jw-mobile-hamburger"
          style={{
            width         : '40px',
            height        : '40px',
            borderRadius   : '50%',
            border         : 'none',
            background     : 'transparent',
            color          : MUTED,
            cursor         : 'pointer',
            padding        : 0,
            display        : 'none',
            alignItems     : 'center',
            justifyContent : 'center',
            flexShrink     : 0,
          }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          data-testid="navbar-hamburger"
        >
          {mobileOpen ? <X weight="duotone" size={24} color="var(--jw-dark)" /> : <List weight="duotone" size={24} color="var(--jw-dark)" />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div
          className="md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{
            margin         : '8px auto 0',
            maxWidth       : 'fit-content',
            width          : 'fit-content',
            borderRadius    : '24px',
            background     : '#ffffff',
            padding        : '20px 18px',
            boxShadow      : '0 8px 32px rgba(0,0,0,0.08)',
            fontFamily     : 'var(--font-outfit), Outfit, sans-serif',
          }}
        >
          {/* mobile nav links — only on landing */}
          {isLanding && (
          <div className="flex flex-col gap-4">
            {LANDING_LINKS.map(({ label, key, href }) => (
                  <a
                    key={key}
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    data-testid={`navbar-mobile-${key}`}
                    style={{
                      color          : MUTED,
                      fontWeight     : 600,
                      fontSize       : '15px',
                      textDecoration : 'none',
                      padding        : '10px 8px',
                      borderRadius    : '14px',
                      fontFamily     : 'inherit',
                    }}
                  >
                    {label}
                  </a>
            ))}
          </div>
          )}

          {/* divider */}
          <div style={{ height: '1px', background: '#e5e7eb', margin: '10px 0' }} />

          {/* auth buttons */}
          <div className="flex flex-col gap-4">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    background     : CORAL,
                    color          : '#ffffff',
                    fontWeight     : 600,
                    fontSize       : '15px',
                    textAlign      : 'center',
                    textDecoration : 'none',
                    fontFamily     : 'inherit',
                    padding        : '12px 14px',
                    borderRadius    : '14px',
                  }}
                >
                  Get started
                </Link>
              </>
            ) : (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                style={{
                  background     : '#f9fafb',
                  color          : CORAL,
                  fontWeight     : 600,
                  fontSize       : '15px',
                  textAlign      : 'center',
                  border         : 'none',
                  fontFamily     : 'inherit',
                  padding        : '12px 14px',
                  borderRadius    : '14px',
                  cursor         : 'pointer',
                }}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
