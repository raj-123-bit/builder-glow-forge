import { useState, useEffect } from 'react';
import { NeuralArchSearchDB, NeuralArchitecture, SearchExperiment, SearchProgress } from '@/lib/supabase';

// Custom hooks for Neural Architecture Search data
// Built by Shaurya Upadhyay

export function useArchitectures(experimentId?: string) {
  const [architectures, setArchitectures] = useState<NeuralArchitecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArchitectures() {
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getArchitectures(experimentId);
        setArchitectures(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch architectures');
        console.error('Error fetching architectures:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArchitectures();
  }, [experimentId]);

  return { architectures, loading, error, refetch: () => fetchArchitectures() };
}

export function useTopArchitectures(limit: number = 10) {
  const [architectures, setArchitectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopArchitectures() {
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getTopArchitectures(limit);
        setArchitectures(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch top architectures');
        console.error('Error fetching top architectures:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopArchitectures();
  }, [limit]);

  return { architectures, loading, error };
}

export function useArchitecture(id: string) {
  const [architecture, setArchitecture] = useState<NeuralArchitecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArchitecture() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getArchitecture(id);
        setArchitecture(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch architecture');
        console.error('Error fetching architecture:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArchitecture();
  }, [id]);

  return { architecture, loading, error };
}

export function useExperiments() {
  const [experiments, setExperiments] = useState<SearchExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiments() {
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getExperiments();
        setExperiments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experiments');
        console.error('Error fetching experiments:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiments();
  }, []);

  return { experiments, loading, error, refetch: () => fetchExperiments() };
}

export function useExperiment(id: string) {
  const [experiment, setExperiment] = useState<SearchExperiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiment() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getExperiment(id);
        setExperiment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experiment');
        console.error('Error fetching experiment:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiment();
  }, [id]);

  return { experiment, loading, error };
}

export function useSearchProgress(experimentId: string) {
  const [progress, setProgress] = useState<SearchProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (!experimentId) return;
      
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getProgress(experimentId);
        setProgress(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch progress');
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [experimentId]);

  return { progress, loading, error };
}

export function useGlobalStats() {
  const [stats, setStats] = useState<{
    total_experiments: number;
    total_architectures: number;
    total_ai_conversations: number;
  }>({
    total_experiments: 0,
    total_architectures: 0,
    total_ai_conversations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await NeuralArchSearchDB.getGlobalStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// Hook for creating new experiments
export function useCreateExperiment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExperiment = async (experiment: Partial<SearchExperiment>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await NeuralArchSearchDB.createExperiment(experiment);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create experiment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createExperiment, loading, error };
}

// Hook for creating new architectures
export function useCreateArchitecture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArchitecture = async (architecture: Partial<NeuralArchitecture>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await NeuralArchSearchDB.createArchitecture(architecture);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create architecture';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createArchitecture, loading, error };
}

// Hook for recording search progress
export function useRecordProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordProgress = async (progress: Partial<SearchProgress>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await NeuralArchSearchDB.recordProgress(progress);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record progress';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { recordProgress, loading, error };
}

// Hook for saving AI conversations
export function useSaveConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveConversation = async (conversation: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await NeuralArchSearchDB.saveConversation(conversation);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save conversation';
      setError(errorMessage);
      console.error('Error saving conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  return { saveConversation, loading, error };
}
