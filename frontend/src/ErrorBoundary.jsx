import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#222', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>React Crash Detected</h2>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ background: '#000', padding: '1rem', overflowX: 'auto', fontSize: '12px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
