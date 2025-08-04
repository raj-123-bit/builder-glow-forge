import { Context } from "@netlify/edge-functions";

interface DebugLogRequest {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

export default async (request: Request, context: Context) => {
  const { pathname } = new URL(request.url);
  
  // CORS headers for debugging API
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Debug endpoint for client-side logging
    if (pathname === '/api/debug/log' && request.method === 'POST') {
      const logData: DebugLogRequest = await request.json();
      
      // Enhanced server-side logging for Neural Architecture Search
      const enhancedLog = {
        ...logData,
        server_timestamp: new Date().toISOString(),
        request_id: context.requestId,
        geo: context.geo,
        ip: context.ip,
        user_agent: request.headers.get('user-agent'),
        environment: Deno.env.get('CONTEXT') || 'unknown',
        app: 'neuralarchsearch',
        author: 'shaurya-upadhyay'
      };

      // Log to console for Netlify logs
      console.log(`[NAS Debug ${logData.level.toUpperCase()}]`, JSON.stringify(enhancedLog, null, 2));

      // In production, you could send this to external logging services
      // like Datadog, LogRocket, or store in Supabase

      return new Response(
        JSON.stringify({ 
          success: true, 
          logged: true,
          request_id: context.requestId 
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Performance metrics endpoint
    if (pathname === '/api/debug/performance' && request.method === 'POST') {
      const perfData = await request.json();
      
      const enhancedPerfData = {
        ...perfData,
        server_timestamp: new Date().toISOString(),
        request_id: context.requestId,
        environment: Deno.env.get('CONTEXT') || 'unknown',
        geo_location: context.geo?.city || 'unknown'
      };

      console.log('[NAS Performance]', JSON.stringify(enhancedPerfData, null, 2));

      return new Response(
        JSON.stringify({ 
          success: true, 
          recorded: true,
          request_id: context.requestId 
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Error reporting endpoint
    if (pathname === '/api/debug/error' && request.method === 'POST') {
      const errorData = await request.json();
      
      const enhancedErrorData = {
        ...errorData,
        server_timestamp: new Date().toISOString(),
        request_id: context.requestId,
        geo: context.geo,
        ip: context.ip,
        user_agent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        environment: Deno.env.get('CONTEXT') || 'unknown',
        severity: errorData.level || 'error'
      };

      // Critical errors get special attention
      if (errorData.level === 'error') {
        console.error('[NAS CRITICAL ERROR]', JSON.stringify(enhancedErrorData, null, 2));
      } else {
        console.warn('[NAS ERROR]', JSON.stringify(enhancedErrorData, null, 2));
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          error_id: `nas_error_${context.requestId}`,
          request_id: context.requestId 
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Session analytics endpoint
    if (pathname === '/api/debug/session' && request.method === 'POST') {
      const sessionData = await request.json();
      
      const enhancedSessionData = {
        ...sessionData,
        server_timestamp: new Date().toISOString(),
        request_id: context.requestId,
        geo: context.geo,
        session_duration: sessionData.end_time - sessionData.start_time,
        page_views: sessionData.page_views || 1,
        nas_operations: sessionData.nas_operations || 0
      };

      console.log('[NAS Session Analytics]', JSON.stringify(enhancedSessionData, null, 2));

      return new Response(
        JSON.stringify({ 
          success: true, 
          session_recorded: true,
          request_id: context.requestId 
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Debug info endpoint
    if (pathname === '/api/debug/info' && request.method === 'GET') {
      const debugInfo = {
        timestamp: new Date().toISOString(),
        request_id: context.requestId,
        environment: Deno.env.get('CONTEXT') || 'unknown',
        geo: context.geo,
        headers: Object.fromEntries(request.headers.entries()),
        url: request.url,
        method: request.method,
        app_info: {
          name: 'NeuralArchSearch',
          version: '2.0.0',
          author: 'Shaurya Upadhyay',
          debug_enabled: true,
          highlight_integration: true,
          netlify_functions: true
        }
      };

      return new Response(
        JSON.stringify(debugInfo, null, 2),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Default response for unknown debug endpoints
    return new Response(
      JSON.stringify({ 
        error: 'Debug endpoint not found',
        available_endpoints: [
          '/api/debug/log - POST - Client-side logging',
          '/api/debug/performance - POST - Performance metrics',
          '/api/debug/error - POST - Error reporting',
          '/api/debug/session - POST - Session analytics',
          '/api/debug/info - GET - Debug information'
        ]
      }),
      { 
        status: 404, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('[Debug Logger Edge Function Error]', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal debug service error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
};

export const config = {
  path: "/api/debug/*"
};
