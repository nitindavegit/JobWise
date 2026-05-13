import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  // Track scroll to add shadow when not at top
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Landing page anchor links
  const landingLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Employers', href: '#employers' },
  ];

  const handleAnchorClick = (e, href) => {
    if (isLanding) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setMobileOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      data-testid="navbar"
    >
      {/* Pill Container */}
      <div
        className="mx-auto max-w-6xl rounded-full px-6 py-3 flex items-center justify-between transition-shadow duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(26, 11, 46, 0.12)'
            : '0 4px 16px rgba(26, 11, 46, 0.06)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex-shrink-0" data-testid="navbar-logo">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {isLanding &&
            landingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="font-outfit text-sm font-medium transition-colors duration-200 hover:text-[var(--jw-coral)]"
                style={{ color: 'var(--jw-text)' }}
                data-testid={`navbar-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
        </div>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.user_type === 'employer' ? '/employer' : '/dashboard'}
                className="flex items-center gap-2 font-outfit text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--jw-dark)',
                  color: 'white',
                }}
                data-testid="navbar-dashboard-btn"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 font-outfit text-sm font-medium px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer"
                style={{
                  color: 'var(--jw-text)',
                  background: 'transparent',
                  border: 'none',
                }}
                data-testid="navbar-logout-btn"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-outfit text-sm font-medium px-4 py-2.5 rounded-full transition-colors duration-200 hover:text-[var(--jw-coral)]"
                style={{ color: 'var(--jw-text)' }}
                data-testid="navbar-signin-btn"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="font-outfit text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--jw-coral)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(255, 107, 107, 0.35)',
                }}
                data-testid="navbar-getstarted-btn"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 cursor-pointer"
          style={{
            background: mobileOpen ? 'var(--jw-bg2)' : 'transparent',
            border: 'none',
            color: 'var(--jw-text)',
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          data-testid="navbar-hamburger"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className="md:hidden mx-auto max-w-6xl mt-2 rounded-3xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 12px 40px rgba(26, 11, 46, 0.12)',
          maxHeight: mobileOpen ? '400px' : '0',
          opacity: mobileOpen ? 1 : 0,
          padding: mobileOpen ? '1.5rem' : '0 1.5rem',
        }}
      >
        {/* Mobile Nav Links */}
        {isLanding && (
          <div className="flex flex-col gap-1 mb-4">
            {landingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="font-outfit text-base font-medium px-4 py-3 rounded-2xl transition-colors duration-200"
                style={{ color: 'var(--jw-text)' }}
                data-testid={`navbar-mobile-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Mobile Divider */}
        <div
          className="my-2"
          style={{
            height: '1px',
            background: 'rgba(26, 11, 46, 0.08)',
          }}
        />

        {/* Mobile Auth Actions */}
        <div className="flex flex-col gap-2 mt-3">
          {user ? (
            <>
              <Link
                to={user.user_type === 'employer' ? '/employer' : '/dashboard'}
                className="flex items-center justify-center gap-2 font-outfit text-sm font-semibold px-5 py-3 rounded-full transition-all duration-200"
                style={{
                  background: 'var(--jw-dark)',
                  color: 'white',
                }}
                data-testid="navbar-mobile-dashboard"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-center gap-2 font-outfit text-sm font-medium px-5 py-3 rounded-full cursor-pointer"
                style={{
                  color: 'var(--jw-coral)',
                  background: 'rgba(255, 107, 107, 0.08)',
                  border: 'none',
                }}
                data-testid="navbar-mobile-logout"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-outfit text-sm font-medium text-center px-5 py-3 rounded-full transition-colors duration-200"
                style={{
                  color: 'var(--jw-text)',
                  background: 'rgba(26, 11, 46, 0.04)',
                }}
                onClick={() => setMobileOpen(false)}
                data-testid="navbar-mobile-signin"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="font-outfit text-sm font-semibold text-center px-5 py-3 rounded-full transition-all duration-200"
                style={{
                  background: 'var(--jw-coral)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(255, 107, 107, 0.35)',
                }}
                onClick={() => setMobileOpen(false)}
                data-testid="navbar-mobile-getstarted"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;