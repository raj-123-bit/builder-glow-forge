// Error handling utilities for Neural Architecture Search
// Built by Shaurya Upadhyay

export function extractErrorMessage(error: unknown): string {
  console.log("Raw error object:", error);
  console.log("Error type:", typeof error);
  console.log("Error constructor:", error?.constructor?.name);
  
  // Handle null/undefined
  if (error === null || error === undefined) {
    return "Unknown error occurred";
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle Error instances
  if (error instanceof Error) {
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    return error.message || "Error occurred";
  }
  
  // Handle objects
  if (typeof error === 'object') {
    console.log("Object keys:", Object.keys(error));
    console.log("Object values:", Object.values(error));
    
    // Try different common error properties
    const obj = error as any;
    
    // Supabase error patterns
    if (obj.message) {
      console.log("Found .message:", obj.message);
      return String(obj.message);
    }
    
    if (obj.error) {
      console.log("Found .error:", obj.error);
      if (typeof obj.error === 'string') {
        return obj.error;
      } else if (obj.error.message) {
        return obj.error.message;
      }
    }
    
    if (obj.details) {
      console.log("Found .details:", obj.details);
      return String(obj.details);
    }
    
    if (obj.hint) {
      console.log("Found .hint:", obj.hint);
      return String(obj.hint);
    }
    
    if (obj.code) {
      console.log("Found .code:", obj.code);
      return `Error code: ${obj.code}${obj.message ? ` - ${obj.message}` : ''}`;
    }
    
    // PostgreSQL/Supabase specific errors
    if (obj.statusCode || obj.status) {
      const status = obj.statusCode || obj.status;
      const message = obj.statusText || obj.message || 'Unknown error';
      return `HTTP ${status}: ${message}`;
    }
    
    // Try to get meaningful info from the object
    try {
      const stringified = JSON.stringify(error, null, 2);
      console.log("Stringified error:", stringified);
      
      // If JSON is too long, truncate it
      if (stringified.length > 200) {
        return `Error: ${stringified.substring(0, 200)}...`;
      }
      return `Error: ${stringified}`;
    } catch (jsonError) {
      console.log("JSON stringify failed:", jsonError);
      
      // Last resort - try toString
      try {
        return String(error);
      } catch (toStringError) {
        return "Unknown error (could not serialize)";
      }
    }
  }
  
  // Fallback for other types
  try {
    return String(error);
  } catch (e) {
    return "Unknown error occurred";
  }
}

export function logError(context: string, error: unknown) {
  console.group(`🔴 Error in ${context}`);
  console.log("Error object:", error);
  console.log("Error type:", typeof error);
  console.log("Error message:", extractErrorMessage(error));
  
  if (error && typeof error === 'object') {
    console.log("Error properties:");
    try {
      for (const [key, value] of Object.entries(error)) {
        console.log(`  ${key}:`, value);
      }
    } catch (e) {
      console.log("Could not enumerate error properties");
    }
  }
  
  console.groupEnd();
}
