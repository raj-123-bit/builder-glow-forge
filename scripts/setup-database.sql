-- Neural Architecture Search Database Setup
-- Built by Shaurya Upadhyay
-- Run this in Supabase SQL Editor

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data validation
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'search_strategy') THEN
        CREATE TYPE search_strategy AS ENUM (
            'evolutionary',
            'reinforcement',
            'gradient',
            'bayesian',
            'random'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'architecture_status') THEN
        CREATE TYPE architecture_status AS ENUM (
            'pending',
            'training',
            'completed',
            'failed',
            'cancelled'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dataset_type') THEN
        CREATE TYPE dataset_type AS ENUM (
            'imagenet',
            'cifar10',
            'cifar100',
            'custom'
        );
    END IF;
END $$;

-- 1. Search Experiments Table
CREATE TABLE IF NOT EXISTS search_experiments (
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
CREATE TABLE IF NOT EXISTS neural_architectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES search_experiments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    architecture_json JSONB NOT NULL,
    layer_count INTEGER,
    total_parameters BIGINT,
    flops BIGINT,
    model_size_mb DECIMAL(10,2),
    generation INTEGER DEFAULT 1,
    parent_ids UUID[],
    
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

-- 3. AI Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES search_experiments(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    message_role VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    ai_model VARCHAR(100) DEFAULT 'shaurya-ai',
    response_time_ms INTEGER,
    tokens_used INTEGER,
    user_id VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experiments_created_at ON search_experiments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON search_experiments(status);
CREATE INDEX IF NOT EXISTS idx_architectures_experiment_id ON neural_architectures(experiment_id);
CREATE INDEX IF NOT EXISTS idx_architectures_accuracy ON neural_architectures(top1_accuracy DESC);
CREATE INDEX IF NOT EXISTS idx_architectures_score ON neural_architectures(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON ai_conversations(session_id);

-- Create view for architecture leaderboard
CREATE OR REPLACE VIEW architecture_leaderboard AS
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

-- Insert sample experiment data
INSERT INTO search_experiments (
    name, description, strategy, dataset, search_budget, population_size, 
    status, total_architectures_tested, best_accuracy, search_time_hours, 
    gpu_hours, convergence_status
) VALUES 
(
    'Shaurya ImageNet Search', 
    'Finding optimal architectures for ImageNet classification built by Shaurya Upadhyay',
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
) ON CONFLICT DO NOTHING;

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
) SELECT 
    se.id,
    'EfficientNet-B7',
    'Compound scaled CNN architecture optimized by Shaurya Upadhyay',
    '{"architecture": "efficientnet", "version": "b7", "layers": [], "built_by": "Shaurya Upadhyay"}',
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
FROM search_experiments se 
WHERE se.name = 'Shaurya ImageNet Search'
ON CONFLICT DO NOTHING;

-- Insert welcome AI conversation
INSERT INTO ai_conversations (
    session_id,
    message_role,
    message_content,
    ai_model,
    user_id
) VALUES 
(
    'welcome-session',
    'ai',
    'Welcome to Neural Architecture Search! I am Shaurya, your AI assistant built by Shaurya Upadhyay. Your database is now connected and ready for neural architecture experiments!',
    'shaurya-ai',
    'Shaurya Upadhyay'
) ON CONFLICT DO NOTHING;

-- Enable Row Level Security (Optional - uncomment if needed)
-- ALTER TABLE search_experiments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE neural_architectures ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

SELECT 'Neural Architecture Search Database Setup Complete!' as status;
