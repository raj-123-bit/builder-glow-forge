// Highlight.io configuration for Neural Architecture Search debugging
// Built by Shaurya Upadhyay

export const HIGHLIGHT_PROJECT_ID = import.meta.env.VITE_HIGHLIGHT_PROJECT_ID || 'demo-project';

// Initialize Highlight.io with proper error handling
export const initializeHighlight = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamic import to handle potential export issues
    const highlightModule = await import('@highlight-run/react');
    const H = highlightModule.default || highlightModule.H;
    
    if (H && H.init) {
      H.init(HIGHLIGHT_PROJECT_ID, {
        serviceName: 'neuralarchsearch-frontend',
        serviceVersion: '2.0.0',
        environment: import.meta.env.MODE || 'development',
        networkRecording: {
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [
            'https://api.openai.com',
            'https://api.anthropic.com'
          ]
        },
        sessionShortcut: true,
        enableCanvasRecording: true,
        enablePerformanceRecording: true,
        metadata: {
          app: 'NeuralArchSearch',
          author: 'Shaurya Upadhyay',
          features: ['nas', 'ai-chat', 'supabase', 'vercel'],
          version: '2.0.0'
        },
        beforeSend: (event) => {
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
      return H;
    }
  } catch (error) {
    console.warn('Highlight.io failed to initialize:', error);
    return null;
  }
};

// Lazy-loaded H instance
let highlightInstance: any = null;

const getHighlightInstance = async () => {
  if (!highlightInstance) {
    highlightInstance = await initializeHighlight();
  }
  return highlightInstance;
};

// Custom error tracking for NAS operations
export const trackNASError = async (
  operation: string,
  error: Error,
  context?: Record<string, any>
) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.consumeError) {
      H.consumeError(error, 'nas-operation', {
        operation,
        timestamp: new Date().toISOString(),
        ...context
      });
    }
  } catch (err) {
    console.warn('Failed to track NAS error:', err);
  }
};

// Performance tracking for neural architecture operations
export const trackNASPerformance = async (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('nas-performance', {
        operation,
        duration_ms: duration,
        timestamp: new Date().toISOString(),
        ...metadata
      });
    }
  } catch (err) {
    console.warn('Failed to track NAS performance:', err);
  }
};

// Architecture evaluation tracking
export const trackArchitectureEvaluation = async (
  architecture: any,
  results: any,
  duration: number
) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('architecture-evaluation', {
        architecture_id: architecture.id || 'unknown',
        architecture_type: architecture.type || 'custom',
        accuracy: results.accuracy,
        latency: results.latency,
        parameters: results.parameters,
        evaluation_duration_ms: duration,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to track architecture evaluation:', err);
  }
};

// Search algorithm tracking
export const trackSearchAlgorithm = async (
  algorithm: string,
  progress: any,
  status: string
) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('search-algorithm', {
        algorithm,
        evaluations: progress.evaluations || 0,
        best_score: progress.bestScore || 0,
        convergence: progress.convergence || 0,
        status,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to track search algorithm:', err);
  }
};

// AI chat interaction tracking
export const trackAIInteraction = async (
  message: string,
  response: string,
  model: string,
  duration: number
) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('ai-interaction', {
        message_length: message.length,
        response_length: response.length,
        model,
        response_time_ms: duration,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to track AI interaction:', err);
  }
};

// Database operation tracking
export const trackDatabaseOperation = async (
  operation: string,
  table: string,
  success: boolean,
  duration: number,
  error?: string
) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('database-operation', {
        operation,
        table,
        success,
        duration_ms: duration,
        error: error || null,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to track database operation:', err);
  }
};

// Custom logging for development
export const debugLog = async (message: string, data?: any) => {
  if (import.meta.env.MODE === 'development') {
    console.log(`[NAS Debug] ${message}`, data);
  }
  
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('debug-log', {
        message,
        data: JSON.stringify(data),
        level: 'debug',
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to debug log:', err);
  }
};

// Session replay controls
export const startNASSession = async (experimentId?: string) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('nas-session-start', {
        experiment_id: experimentId,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to start NAS session:', err);
  }
};

export const endNASSession = async (experimentId?: string, results?: any) => {
  try {
    const H = await getHighlightInstance();
    if (H && H.track) {
      H.track('nas-session-end', {
        experiment_id: experimentId,
        results: JSON.stringify(results),
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to end NAS session:', err);
  }
};
