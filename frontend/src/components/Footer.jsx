import { motion } from 'framer-motion';
import Logo from './Logo';
import { Envelope, MapPin } from '@phosphor-icons/react';

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
      className="section-dark"
      data-testid="footer"
      style={{ padding: '80px 40px 40px' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '40px' }}>
          {/* Brand Column */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: '24px', display: 'inline-block', background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '10px 14px' }}
            >
              <Logo size="lg" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-instrument"
              style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '20px' }}
            >
              &ldquo;Find work that fits.&rdquo;
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-outfit"
              style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.6 }}
            >
              AI-powered job matching that understands your skills, not just keywords.
              Upload your resume and discover opportunities tailored to you.
            </motion.p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="mailto:hello@jobwise.ai"
                className="font-outfit"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                <Envelope size={14} />
                hello@jobwise.ai
              </a>
              <span className="font-outfit" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                <MapPin weight="duotone" size={14} />
                Remote-first company
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <h4 className="font-bricolage" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '20px' }}>
                {category}
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-outfit"
                      style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Mega Wordmark — using logo image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '60px', marginBottom: '40px', overflow: 'hidden', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img
            src="/logo.png"
            alt=""
            style={{ height: 'clamp(100px, 15vw, 220px)', objectFit: 'contain', opacity: 0.15, filter: 'invert(1) grayscale(1) brightness(5)' }}
          />
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="font-outfit" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            &copy; {currentYear} <img src="/logo.png" alt="JobWise" style={{ height: '18px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.5 }} /> All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a
                key={item}
                href="#"
                className="font-outfit"
                style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;