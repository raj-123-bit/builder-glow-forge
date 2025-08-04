-- Supabase Authentication Setup for Neural Architecture Search
-- Built by Shaurya Upadhyay

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_by VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Neural Architecture Search specific fields
    total_experiments INTEGER DEFAULT 0,
    total_architectures INTEGER DEFAULT 0,
    best_accuracy DECIMAL(5,2),
    preferred_dataset dataset_type DEFAULT 'imagenet',
    preferred_strategy search_strategy DEFAULT 'evolutionary'
);

-- Enable RLS on user profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user profiles
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Update existing tables to link to users
ALTER TABLE search_experiments 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE neural_architectures 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE ai_conversations 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Create policies for search experiments
CREATE POLICY "Users can view own experiments"
    ON search_experiments FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create experiments"
    ON search_experiments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiments"
    ON search_experiments FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for neural architectures
CREATE POLICY "Users can view own architectures"
    ON neural_architectures FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create architectures"
    ON neural_architectures FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for AI conversations
CREATE POLICY "Users can view own conversations"
    ON ai_conversations FOR SELECT
    USING (auth.uid() = auth_user_id OR auth_user_id IS NULL);

CREATE POLICY "Users can create conversations"
    ON ai_conversations FOR INSERT
    WITH CHECK (auth.uid() = auth_user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update user profile stats function
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user profile with latest stats
    UPDATE user_profiles 
    SET 
        total_experiments = (
            SELECT COUNT(*) 
            FROM search_experiments 
            WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
        ),
        total_architectures = (
            SELECT COUNT(*) 
            FROM neural_architectures 
            WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
        ),
        best_accuracy = (
            SELECT MAX(top1_accuracy) 
            FROM neural_architectures 
            WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.user_id, OLD.user_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to update user stats
DROP TRIGGER IF EXISTS update_user_stats_on_experiment ON search_experiments;
CREATE TRIGGER update_user_stats_on_experiment
    AFTER INSERT OR UPDATE OR DELETE ON search_experiments
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS update_user_stats_on_architecture ON neural_architectures;
CREATE TRIGGER update_user_stats_on_architecture
    AFTER INSERT OR UPDATE OR DELETE ON neural_architectures
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Create leaderboard view with user information
CREATE OR REPLACE VIEW user_leaderboard AS
SELECT 
    up.id,
    up.full_name,
    up.email,
    up.total_experiments,
    up.total_architectures,
    up.best_accuracy,
    up.created_at,
    RANK() OVER (ORDER BY up.best_accuracy DESC NULLS LAST) as accuracy_rank,
    RANK() OVER (ORDER BY up.total_architectures DESC) as architecture_rank
FROM user_profiles up
WHERE up.total_experiments > 0
ORDER BY up.best_accuracy DESC NULLS LAST;

-- Insert sample authenticated user data (optional)
-- This will only work if you have existing users
INSERT INTO user_profiles (id, email, full_name, total_experiments, total_architectures, best_accuracy)
SELECT 
    gen_random_uuid(),
    'shaurya@neuralarchsearch.com',
    'Shaurya Upadhyay',
    5,
    15,
    96.2
WHERE NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'shaurya@neuralarchsearch.com');

-- Enable realtime for user profiles
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

SELECT 'Supabase Authentication Setup Complete! 🚀' as message;
