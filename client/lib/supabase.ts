import { createClient } from "@supabase/supabase-js";

// Supabase configuration for Neural Architecture Search
// Built by Shaurya Upadhyay

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Create Supabase client with error handling
let supabase: any;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Database features will be disabled.');
    console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file');

    // Create a mock client for development
    supabase = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        eq: function() { return this; },
        order: function() { return this; },
        limit: function() { return this; },
        single: function() { return this; }
      }),
      channel: () => ({
        on: () => ({ subscribe: () => {} })
      })
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = null;
}

export { supabase };

// Database Types for Neural Architecture Search
export interface SearchExperiment {
  id: string;
  name: string;
  description?: string;
  strategy:
    | "evolutionary"
    | "reinforcement"
    | "gradient"
    | "bayesian"
    | "random";
  dataset: "imagenet" | "cifar10" | "cifar100" | "custom";
  search_budget: number;
  population_size: number;
  max_epochs: number;
  target_accuracy?: number;
  target_latency?: number;
  status: "pending" | "training" | "completed" | "failed" | "cancelled";
  created_by: string;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  total_architectures_tested: number;
  best_accuracy?: number;
  search_time_hours?: number;
  gpu_hours?: number;
  convergence_status: string;
}

export interface NeuralArchitecture {
  id: string;
  experiment_id: string;
  name: string;
  description?: string;
  architecture_json: any;
  layer_count?: number;
  total_parameters?: number;
  flops?: number;
  model_size_mb?: number;
  generation?: number;
  parent_ids?: string[];

  // Performance Metrics
  top1_accuracy?: number;
  top5_accuracy?: number;
  validation_loss?: number;
  training_time_hours?: number;
  inference_latency_ms?: number;
  memory_usage_mb?: number;
  energy_consumption_kwh?: number;

  // Scoring
  overall_score?: number;
  efficiency_ratio?: number;
  pareto_rank?: number;

  status: "pending" | "training" | "completed" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
  training_started_at?: string;
  training_completed_at?: string;
}

export interface ArchitectureLayer {
  id: string;
  architecture_id: string;
  layer_index: number;
  layer_type: string;
  layer_config: any;
  input_shape?: number[];
  output_shape?: number[];
  parameters_count?: number;
  flops_count?: number;
  created_at: string;
}

export interface SearchProgress {
  id: string;
  experiment_id: string;
  iteration: number;
  generation?: number;
  best_accuracy_so_far?: number;
  average_accuracy?: number;
  architectures_evaluated?: number;
  time_elapsed_hours?: number;
  cpu_usage_percent?: number;
  gpu_usage_percent?: number;
  memory_usage_gb?: number;
  convergence_metric?: number;
  notes?: string;
  created_at: string;
}

export interface AiConversation {
  id: string;
  experiment_id?: string;
  session_id?: string;
  message_role: "user" | "ai";
  message_content: string;
  ai_model: string;
  response_time_ms?: number;
  tokens_used?: number;
  user_id: string;
  created_at: string;
}

// Database Service Functions
export class NeuralArchSearchDB {
  // Search Experiments
  static async createExperiment(experiment: Partial<SearchExperiment>) {
    const { data, error } = await supabase
      .from("search_experiments")
      .insert([
        {
          ...experiment,
          created_by: "Shaurya Upadhyay",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getExperiments() {
    const { data, error } = await supabase
      .from("search_experiments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getExperiment(id: string) {
    const { data, error } = await supabase
      .from("search_experiments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateExperiment(
    id: string,
    updates: Partial<SearchExperiment>,
  ) {
    const { data, error } = await supabase
      .from("search_experiments")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Neural Architectures
  static async createArchitecture(architecture: Partial<NeuralArchitecture>) {
    const { data, error } = await supabase
      .from("neural_architectures")
      .insert([architecture])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getArchitectures(experimentId?: string) {
    let query = supabase.from("neural_architectures").select("*");

    if (experimentId) {
      query = query.eq("experiment_id", experimentId);
    }

    const { data, error } = await query
      .order("overall_score", { ascending: false, nullsLast: true })
      .order("top1_accuracy", { ascending: false, nullsLast: true });

    if (error) throw error;
    return data;
  }

  static async getTopArchitectures(limit: number = 10) {
    const { data, error } = await supabase
      .from("architecture_leaderboard")
      .select("*")
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async getArchitecture(id: string) {
    const { data, error } = await supabase
      .from("neural_architectures")
      .select(
        `
        *,
        architecture_layers(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Search Progress Tracking
  static async recordProgress(progress: Partial<SearchProgress>) {
    const { data, error } = await supabase
      .from("search_progress")
      .insert([progress])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProgress(experimentId: string) {
    const { data, error } = await supabase
      .from("search_progress")
      .select("*")
      .eq("experiment_id", experimentId)
      .order("iteration", { ascending: true });

    if (error) throw error;
    return data;
  }

  // AI Conversations
  static async saveConversation(conversation: Partial<AiConversation>) {
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert([
        {
          ...conversation,
          user_id: "Shaurya Upadhyay",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getConversations(sessionId: string) {
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Analytics and Statistics
  static async getExperimentSummary(experimentId: string) {
    const { data, error } = await supabase
      .from("experiment_summary")
      .select("*")
      .eq("id", experimentId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getGlobalStats() {
    const [experimentsResult, architecturesResult, conversationsResult] =
      await Promise.all([
        supabase
          .from("search_experiments")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("neural_architectures")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("ai_conversations")
          .select("id", { count: "exact", head: true }),
      ]);

    return {
      total_experiments: experimentsResult.count || 0,
      total_architectures: architecturesResult.count || 0,
      total_ai_conversations: conversationsResult.count || 0,
    };
  }
}

// Real-time subscriptions for live updates
export function subscribeToExperiment(
  experimentId: string,
  callback: (payload: any) => void,
) {
  return supabase
    .channel(`experiment-${experimentId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "neural_architectures",
        filter: `experiment_id=eq.${experimentId}`,
      },
      callback,
    )
    .subscribe();
}

export function subscribeToProgress(
  experimentId: string,
  callback: (payload: any) => void,
) {
  return supabase
    .channel(`progress-${experimentId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "search_progress",
        filter: `experiment_id=eq.${experimentId}`,
      },
      callback,
    )
    .subscribe();
}
