import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
            <h2 className="text-2xl font-black mb-2">Something went wrong</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              We encountered an unexpected issue. Don't worry, your statistics are preserved.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
