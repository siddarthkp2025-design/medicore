import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'An error occurred while loading data.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-destructive">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="mt-2 text-sm max-w-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
