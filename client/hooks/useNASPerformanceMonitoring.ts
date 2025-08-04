import { useEffect, useRef, useCallback } from "react";
import {
  trackNASPerformance,
  trackArchitectureEvaluation,
  trackSearchAlgorithm,
  trackDatabaseOperation,
  debugLog,
} from "@/lib/highlight";

// Performance monitoring hook for Neural Architecture Search operations
export function useNASPerformanceMonitoring() {
  const operationTimers = useRef<Map<string, number>>(new Map());

  const startOperation = useCallback(
    (operationId: string, operationType: string) => {
      const startTime = performance.now();
      operationTimers.current.set(operationId, startTime);

      debugLog("NAS Operation Started", {
        operationId,
        operationType,
        startTime,
      });
    },
    [],
  );

  const endOperation = useCallback(
    (
      operationId: string,
      operationType: string,
      metadata?: Record<string, any>,
    ) => {
      const startTime = operationTimers.current.get(operationId);
      if (!startTime) {
        console.warn(`No start time found for operation: ${operationId}`);
        return;
      }

      const duration = performance.now() - startTime;
      operationTimers.current.delete(operationId);

      trackNASPerformance(operationType, duration, {
        operationId,
        ...metadata,
      });

      debugLog("NAS Operation Completed", {
        operationId,
        operationType,
        duration,
        metadata,
      });

      return duration;
    },
    [],
  );

  const measureOperation = useCallback(
    async <T>(
      operationType: string,
      operation: () => Promise<T>,
      metadata?: Record<string, any>,
    ): Promise<T> => {
      const operationId = `${operationType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      startOperation(operationId, operationType);

      try {
        const result = await operation();
        endOperation(operationId, operationType, {
          ...metadata,
          success: true,
        });
        return result;
      } catch (error) {
        endOperation(operationId, operationType, {
          ...metadata,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    },
    [startOperation, endOperation],
  );

  return {
    startOperation,
    endOperation,
    measureOperation,
  };
}

// Specialized hook for architecture evaluation monitoring
export function useArchitectureEvaluationMonitoring() {
  const { measureOperation } = useNASPerformanceMonitoring();

  const evaluateArchitecture = useCallback(
    async (architecture: any, evaluationFunction: () => Promise<any>) => {
      const operationType = "architecture-evaluation";
      const metadata = {
        architecture_id: architecture.id || "unknown",
        architecture_type: architecture.type || "custom",
        layer_count: architecture.layers?.length || 0,
        parameters: architecture.parameters || 0,
      };

      const result = await measureOperation(
        operationType,
        evaluationFunction,
        metadata,
      );

      // Track specific architecture evaluation metrics
      trackArchitectureEvaluation(architecture, result, 0); // Duration handled by measureOperation

      return result;
    },
    [measureOperation],
  );

  return { evaluateArchitecture };
}

// Hook for search algorithm monitoring
export function useSearchAlgorithmMonitoring() {
  const progressRef = useRef<any>({});

  const trackProgress = useCallback(
    (
      algorithm: string,
      progress: {
        evaluations: number;
        bestScore: number;
        convergence: number;
      },
      status: string,
    ) => {
      const prevProgress = progressRef.current[algorithm] || {};

      // Only track if there's meaningful progress
      if (
        progress.evaluations !== prevProgress.evaluations ||
        progress.bestScore !== prevProgress.bestScore ||
        status !== prevProgress.status
      ) {
        trackSearchAlgorithm(algorithm, progress, status);
        progressRef.current[algorithm] = { ...progress, status };

        debugLog("Search Algorithm Progress", {
          algorithm,
          progress,
          status,
          progressDelta: {
            evaluations: progress.evaluations - (prevProgress.evaluations || 0),
            scoreDelta: progress.bestScore - (prevProgress.bestScore || 0),
          },
        });
      }
    },
    [],
  );

  return { trackProgress };
}

// Hook for database operation monitoring
export function useDatabaseMonitoring() {
  const { measureOperation } = useNASPerformanceMonitoring();

  const monitorDatabaseOperation = useCallback(
    async <T>(
      operation: string,
      table: string,
      databaseFunction: () => Promise<T>,
    ): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await databaseFunction();
        const duration = performance.now() - startTime;

        trackDatabaseOperation(operation, table, true, duration);

        debugLog("Database Operation Success", {
          operation,
          table,
          duration,
          success: true,
        });

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        trackDatabaseOperation(operation, table, false, duration, errorMessage);

        debugLog("Database Operation Failed", {
          operation,
          table,
          duration,
          success: false,
          error: errorMessage,
        });

        throw error;
      }
    },
    [],
  );

  return { monitorDatabaseOperation };
}

// Memory usage monitoring hook
export function useMemoryMonitoring() {
  const memoryUsageRef = useRef<number[]>([]);

  const recordMemoryUsage = useCallback(() => {
    if ("memory" in performance) {
      const memInfo = (performance as any).memory;
      const usage = {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        limit: memInfo.jsHeapSizeLimit,
        timestamp: Date.now(),
      };

      memoryUsageRef.current.push(usage.used);

      // Keep only last 100 readings
      if (memoryUsageRef.current.length > 100) {
        memoryUsageRef.current = memoryUsageRef.current.slice(-100);
      }

      debugLog("Memory Usage Recorded", usage);

      return usage;
    }
    return null;
  }, []);

  const getMemoryTrend = useCallback(() => {
    const readings = memoryUsageRef.current;
    if (readings.length < 2) return null;

    const recent = readings.slice(-10);
    const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const trend = recent[recent.length - 1] - recent[0];

    return {
      current: readings[readings.length - 1],
      average,
      trend,
      isIncreasing: trend > 0,
      readingCount: readings.length,
    };
  }, []);

  // Auto-record memory usage every 30 seconds when component is mounted
  useEffect(() => {
    const interval = setInterval(recordMemoryUsage, 30000);
    recordMemoryUsage(); // Initial reading

    return () => clearInterval(interval);
  }, [recordMemoryUsage]);

  return {
    recordMemoryUsage,
    getMemoryTrend,
  };
}

// Real-time performance monitoring dashboard data
export function usePerformanceDashboard() {
  const { getMemoryTrend } = useMemoryMonitoring();

  const getPerformanceSnapshot = useCallback(() => {
    const memoryTrend = getMemoryTrend();

    return {
      timestamp: new Date().toISOString(),
      memory: memoryTrend,
      connection: navigator.onLine ? "online" : "offline",
      performance: {
        // These would be populated by other operations
        averageResponseTime: 0,
        totalOperations: 0,
        errorRate: 0,
      },
    };
  }, [getMemoryTrend]);

  return { getPerformanceSnapshot };
}
