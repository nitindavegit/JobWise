import { Component } from 'react';
import { WarningCircle } from '@phosphor-icons/react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'var(--mesh-bg)', backgroundColor: 'var(--jw-bg)', padding: '24px',
        }}>
          <div className="glass-card" style={{ padding: '48px', borderRadius: '28px', textAlign: 'center', maxWidth: '440px' }}>
            <WarningCircle weight="duotone" size={64} style={{ color: "var(--jw-coral)", marginBottom: "20px", display: "inline-block" }} />
            <h2 className="font-bricolage" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--jw-dark)', marginBottom: '8px' }}>
              Something went wrong
            </h2>
            <p className="font-outfit" style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '24px' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button onClick={() => window.location.reload()} className="btn-coral font-outfit">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
