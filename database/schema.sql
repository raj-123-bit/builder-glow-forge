-- Neural Architecture Search Database Schema
-- Built by Shaurya Upadhyay

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data validation
CREATE TYPE search_strategy AS ENUM (
  'evolutionary',
  'reinforcement',
  'gradient',
  'bayesian',
  'random'
);

CREATE TYPE architecture_status AS ENUM (
  'pending',
  'training',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE dataset_type AS ENUM (
  'imagenet',
  'cifar10',
  'cifar100',
  'custom'
);

-- 1. Search Experiments Table
-- Stores information about each neural architecture search session
CREATE TABLE search_experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  strategy search_strategy NOT NULL DEFAULT 'evolutionary',
  dataset dataset_type NOT NULL DEFAULT 'imagenet',
  search_budget INTEGER DEFAULT 100,
  population_size INTEGER DEFAULT 50,
  max_epochs INTEGER DEFAULT 200,
  target_accuracy DECIMAL(5,2),
  target_latency DECIMAL(8,2),
  status architecture_status DEFAULT 'pending',
  created_by VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_architectures_tested INTEGER DEFAULT 0,
  best_accuracy DECIMAL(5,2),
  search_time_hours DECIMAL(8,2),
  gpu_hours DECIMAL(8,2),
  convergence_status VARCHAR(50) DEFAULT 'running'
);

-- 2. Neural Architectures Table  
-- Stores details of each generated/discovered architecture
CREATE TABLE neural_architectures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES search_experiments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  architecture_json JSONB NOT NULL, -- Store full architecture definition
  layer_count INTEGER,
  total_parameters BIGINT,
  flops BIGINT,
  model_size_mb DECIMAL(10,2),
  generation INTEGER DEFAULT 1, -- Which generation in evolutionary search
  parent_ids UUID[], -- Array of parent architecture IDs for tracking lineage
  
  -- Performance Metrics
  top1_accuracy DECIMAL(5,2),
  top5_accuracy DECIMAL(5,2),
  validation_loss DECIMAL(10,6),
  training_time_hours DECIMAL(8,2),
  inference_latency_ms DECIMAL(8,2),
  memory_usage_mb DECIMAL(10,2),
  energy_consumption_kwh DECIMAL(10,3),
  
  -- Scoring and Ranking
  overall_score DECIMAL(5,2),
  efficiency_ratio DECIMAL(8,4),
  pareto_rank INTEGER,
  
  status architecture_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  training_started_at TIMESTAMP WITH TIME ZONE,
  training_completed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Architecture Layers Table
-- Detailed breakdown of each architecture's layers
CREATE TABLE architecture_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  architecture_id UUID REFERENCES neural_architectures(id) ON DELETE CASCADE,
  layer_index INTEGER NOT NULL,
  layer_type VARCHAR(100) NOT NULL, -- Conv2D, MBConv, Dense, etc.
  layer_config JSONB NOT NULL, -- Store layer-specific configuration
  input_shape INTEGER[],
  output_shape INTEGER[],
  parameters_count INTEGER,
  flops_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Search Progress Table
-- Track search progress over time for visualization
CREATE TABLE search_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES search_experiments(id) ON DELETE CASCADE,
  iteration INTEGER NOT NULL,
  generation INTEGER,
  best_accuracy_so_far DECIMAL(5,2),
  average_accuracy DECIMAL(5,2),
  architectures_evaluated INTEGER,
  time_elapsed_hours DECIMAL(8,2),
  cpu_usage_percent DECIMAL(5,2),
  gpu_usage_percent DECIMAL(5,2),
  memory_usage_gb DECIMAL(8,2),
  convergence_metric DECIMAL(10,6),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Interactions Table
-- Track user inputs and configuration changes
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES search_experiments(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL, -- 'config_change', 'search_start', 'search_stop', etc.
  action_data JSONB, -- Store the interaction details
  user_id VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AI Chat Conversations Table
-- Store Shaurya AI chat interactions
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES search_experiments(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  message_role VARCHAR(20) NOT NULL, -- 'user' or 'ai'
  message_content TEXT NOT NULL,
  ai_model VARCHAR(100) DEFAULT 'shaurya-ai',
  response_time_ms INTEGER,
  tokens_used INTEGER,
  user_id VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Performance Benchmarks Table
-- Store hardware-specific performance benchmarks
CREATE TABLE performance_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  architecture_id UUID REFERENCES neural_architectures(id) ON DELETE CASCADE,
  hardware_type VARCHAR(100) NOT NULL, -- 'GPU_RTX3080', 'CPU_Intel_i7', etc.
  batch_size INTEGER NOT NULL,
  inference_time_ms DECIMAL(8,2),
  throughput_fps DECIMAL(8,2),
  memory_peak_mb DECIMAL(10,2),
  power_consumption_w DECIMAL(8,2),
  temperature_celsius DECIMAL(5,2),
  benchmark_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_experiments_created_at ON search_experiments(created_at DESC);
CREATE INDEX idx_experiments_status ON search_experiments(status);
CREATE INDEX idx_architectures_experiment_id ON neural_architectures(experiment_id);
CREATE INDEX idx_architectures_accuracy ON neural_architectures(top1_accuracy DESC);
CREATE INDEX idx_architectures_score ON neural_architectures(overall_score DESC);
CREATE INDEX idx_layers_architecture_id ON architecture_layers(architecture_id);
CREATE INDEX idx_progress_experiment_id ON search_progress(experiment_id);
CREATE INDEX idx_progress_iteration ON search_progress(experiment_id, iteration);
CREATE INDEX idx_interactions_experiment_id ON user_interactions(experiment_id);
CREATE INDEX idx_conversations_session ON ai_conversations(session_id);
CREATE INDEX idx_benchmarks_architecture ON performance_benchmarks(architecture_id);

-- Create views for common queries
CREATE VIEW architecture_leaderboard AS
SELECT 
  na.id,
  na.name,
  na.top1_accuracy,
  na.total_parameters,
  na.flops,
  na.inference_latency_ms,
  na.overall_score,
  na.pareto_rank,
  se.name as experiment_name,
  se.dataset,
  na.created_at
FROM neural_architectures na
JOIN search_experiments se ON na.experiment_id = se.id
WHERE na.status = 'completed'
ORDER BY na.overall_score DESC, na.top1_accuracy DESC;

CREATE VIEW experiment_summary AS
SELECT 
  se.*,
  COUNT(na.id) as total_architectures,
  MAX(na.top1_accuracy) as best_accuracy_found,
  AVG(na.top1_accuracy) as average_accuracy,
  MIN(na.inference_latency_ms) as fastest_latency,
  MAX(na.created_at) as last_architecture_created
FROM search_experiments se
LEFT JOIN neural_architectures na ON se.id = na.experiment_id
GROUP BY se.id;

-- Row Level Security (RLS) policies
ALTER TABLE search_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE architecture_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
CREATE POLICY "Allow all operations for authenticated users" ON search_experiments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON neural_architectures
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON architecture_layers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON search_progress
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON user_interactions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON ai_conversations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON performance_benchmarks
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data for testing
INSERT INTO search_experiments (
  name, description, strategy, dataset, search_budget, population_size, 
  status, total_architectures_tested, best_accuracy, search_time_hours, 
  gpu_hours, convergence_status
) VALUES 
(
  'ImageNet Efficiency Search', 
  'Finding optimal architectures for ImageNet classification with efficiency constraints',
  'evolutionary', 
  'imagenet', 
  100, 
  50, 
  'completed', 
  247, 
  94.8, 
  2.23, 
  8.7, 
  'stable'
);

-- Insert sample architecture data
INSERT INTO neural_architectures (
  experiment_id,
  name,
  description,
  architecture_json,
  layer_count,
  total_parameters,
  flops,
  model_size_mb,
  top1_accuracy,
  top5_accuracy,
  validation_loss,
  inference_latency_ms,
  overall_score,
  efficiency_ratio,
  pareto_rank,
  status
) VALUES 
(
  (SELECT id FROM search_experiments WHERE name = 'ImageNet Efficiency Search'),
  'EfficientNet-B7',
  'Compound scaled CNN architecture optimized for efficiency and accuracy trade-off',
  '{"architecture": "efficientnet", "version": "b7", "layers": []}',
  88,
  66000000,
  37100000000,
  256.5,
  94.8,
  97.2,
  0.184,
  14.2,
  87.3,
  4.2,
  1,
  'completed'
),
(
  (SELECT id FROM search_experiments WHERE name = 'ImageNet Efficiency Search'),
  'ResNet-152',
  'Deep residual network with 152 layers',
  '{"architecture": "resnet", "depth": 152, "layers": []}',
  152,
  60000000,
  11600000000,
  230.1,
  93.2,
  96.8,
  0.212,
  8.1,
  85.1,
  3.8,
  2,
  'completed'
),
(
  (SELECT id FROM search_experiments WHERE name = 'ImageNet Efficiency Search'),
  'MobileNetV3-Large',
  'Mobile-optimized architecture with neural architecture search',
  '{"architecture": "mobilenet", "version": "v3", "variant": "large", "layers": []}',
  42,
  5400000,
  219000000,
  21.2,
  91.7,
  95.1,
  0.289,
  2.3,
  92.4,
  8.1,
  3,
  'completed'
);
