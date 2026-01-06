import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  const handleGoToWorkspace = () => {
    window.location.href = ROUTES.WORKSPACE;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
        </div>

        <p className="text-muted-foreground">
          An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
        </p>

        {error && process.env.NODE_ENV === 'development' && (
          <details className="text-xs bg-muted p-3 rounded">
            <summary className="cursor-pointer font-medium">Error Details (Dev Only)</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
          <Button
            variant="outline"
            onClick={handleGoToWorkspace}
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Workspace
          </Button>
        </div>
      </Card>
    </div>
  );
}

