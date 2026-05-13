import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Features', href: '/#features' },
      { label: 'For Employers', href: '/#employers' },
    ],
    Company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer
      data-testid="footer"
      style={{
        background: 'var(--jw-dark)',
        color: 'rgba(255, 255, 255, 0.75)',
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo size="lg" />
            </div>
            <p
              className="font-instrument text-xl italic mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              &ldquo;Find work that fits.&rdquo;
            </p>
            <p
              className="font-outfit text-sm leading-relaxed mb-8 max-w-sm"
              style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            >
              AI-powered job matching that understands your skills, not just keywords.
              Upload your resume and discover opportunities tailored to you.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@jobwise.ai"
                className="flex items-center gap-2 font-outfit text-sm transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                <Mail size={14} />
                hello@jobwise.ai
              </a>
              <span
                className="flex items-center gap-2 font-outfit text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                <MapPin size={14} />
                Remote-first company
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="font-bricolage text-sm font-semibold uppercase tracking-wider mb-5"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-outfit text-sm transition-colors duration-200 hover:text-white"
                      style={{
                        color: 'rgba(255, 255, 255, 0.45)',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mega Wordmark */}
        <div
          className="mt-20 mb-8 overflow-hidden select-none"
          style={{ opacity: 0.04 }}
        >
          <div className="flex items-center justify-center" style={{ gap: '8px' }}>
            <span
              className="font-bricolage"
              style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1,
              }}
            >
              Job
            </span>
            <span
              className="font-instrument"
              style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontStyle: 'italic',
                color: 'white',
                lineHeight: 1,
              }}
            >
              Wise
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p
            className="font-outfit text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.35)' }}
          >
            &copy; {currentYear} JobWise. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-outfit text-xs transition-colors duration-200 hover:text-white"
              style={{
                color: 'rgba(255, 255, 255, 0.35)',
                textDecoration: 'none',
              }}
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-outfit text-xs transition-colors duration-200 hover:text-white"
              style={{
                color: 'rgba(255, 255, 255, 0.35)',
                textDecoration: 'none',
              }}
            >
              Terms
            </a>
            <a
              href="#"
              className="font-outfit text-xs transition-colors duration-200 hover:text-white"
              style={{
                color: 'rgba(255, 255, 255, 0.35)',
                textDecoration: 'none',
              }}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
