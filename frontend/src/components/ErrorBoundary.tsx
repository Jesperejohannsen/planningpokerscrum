import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any): void {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You could send this to an error tracking service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
    
    // Optionally reload the page
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
          <div className="cyber-card rounded-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-3">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-400 mb-6">
              The application encountered an unexpected error. Don't worry, your session data is safe.
            </p>
            
            {/* REMOVE process.env check - just always show in dev mode based on import.meta.env */}
            {import.meta.env.DEV && this.state.error && (
              <div className="glass rounded-lg p-4 mb-6 text-left">
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReset}
              className="neon-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Application
            </button>
            
            <p className="text-xs text-gray-500 mt-6">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;