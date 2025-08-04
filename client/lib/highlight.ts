import { H } from '@highlight-run/react';

// Highlight.io configuration for Neural Architecture Search debugging
// Built by Shaurya Upadhyay

export const HIGHLIGHT_PROJECT_ID = import.meta.env.VITE_HIGHLIGHT_PROJECT_ID || 'demo-project';

export const initializeHighlight = () => {
  if (typeof window !== 'undefined') {
    H.init(HIGHLIGHT_PROJECT_ID, {
      serviceName: 'neuralarchsearch-frontend',
      serviceVersion: '2.0.0',
      environment: import.meta.env.MODE || 'development',
      networkRecording: {
        enabled: true,
        recordHeadersAndBody: true,
        urlBlocklist: [
          // Block sensitive URLs from recording
          'https://api.openai.com',
          'https://api.anthropic.com'
        ]
      },
      sessionShortcut: true,
      enableCanvasRecording: true,
      enablePerformanceRecording: true,
      // NAS-specific configurations
      metadata: {
        app: 'NeuralArchSearch',
        author: 'Shaurya Upadhyay',
        features: ['nas', 'ai-chat', 'supabase', 'vercel'],
        version: '2.0.0'
      },
      // Custom error filtering for NAS application
      beforeSend: (event) => {
        // Filter out known non-critical errors
        if (event.message?.includes('ResizeObserver loop limit exceeded')) {
          return false;
        }
        if (event.message?.includes('Non-Error promise rejection captured')) {
          return false;
        }
        return true;
      }
    });

    // Set user context for debugging
    H.identify('shaurya-user', {
      name: 'Shaurya Upadhyay',
      email: 'shaurya@neuralarchsearch.com',
      role: 'developer',
      app_version: '2.0.0'
    });

    console.log('🔍 Highlight.io initialized for NeuralArchSearch debugging');
  }
};

// Custom error tracking for NAS operations
export const trackNASError = (
  operation: string,
  error: Error,
  context?: Record<string, any>
) => {
  H.consumeError(error, 'nas-operation', {
    operation,
    timestamp: new Date().toISOString(),
    ...context
  });
};

// Performance tracking for neural architecture operations
export const trackNASPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  H.track('nas-performance', {
    operation,
    duration_ms: duration,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

// Architecture evaluation tracking
export const trackArchitectureEvaluation = (
  architecture: any,
  results: any,
  duration: number
) => {
  H.track('architecture-evaluation', {
    architecture_id: architecture.id || 'unknown',
    architecture_type: architecture.type || 'custom',
    accuracy: results.accuracy,
    latency: results.latency,
    parameters: results.parameters,
    evaluation_duration_ms: duration,
    timestamp: new Date().toISOString()
  });
};

// Search algorithm tracking
export const trackSearchAlgorithm = (
  algorithm: string,
  progress: any,
  status: string
) => {
  H.track('search-algorithm', {
    algorithm,
    evaluations: progress.evaluations || 0,
    best_score: progress.bestScore || 0,
    convergence: progress.convergence || 0,
    status,
    timestamp: new Date().toISOString()
  });
};

// AI chat interaction tracking
export const trackAIInteraction = (
  message: string,
  response: string,
  model: string,
  duration: number
) => {
  H.track('ai-interaction', {
    message_length: message.length,
    response_length: response.length,
    model,
    response_time_ms: duration,
    timestamp: new Date().toISOString()
  });
};

// Database operation tracking
export const trackDatabaseOperation = (
  operation: string,
  table: string,
  success: boolean,
  duration: number,
  error?: string
) => {
  H.track('database-operation', {
    operation,
    table,
    success,
    duration_ms: duration,
    error: error || null,
    timestamp: new Date().toISOString()
  });
};

// Custom logging for development
export const debugLog = (message: string, data?: any) => {
  if (import.meta.env.MODE === 'development') {
    console.log(`[NAS Debug] ${message}`, data);
  }
  
  H.track('debug-log', {
    message,
    data: JSON.stringify(data),
    level: 'debug',
    timestamp: new Date().toISOString()
  });
};

// Session replay controls
export const startNASSession = (experimentId?: string) => {
  H.track('nas-session-start', {
    experiment_id: experimentId,
    timestamp: new Date().toISOString()
  });
};

export const endNASSession = (experimentId?: string, results?: any) => {
  H.track('nas-session-end', {
    experiment_id: experimentId,
    results: JSON.stringify(results),
    timestamp: new Date().toISOString()
  });
};
