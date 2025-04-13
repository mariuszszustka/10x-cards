-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable unaccent extension
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create Polish text search configuration
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_ts_config WHERE cfgname = 'polish'
    ) THEN
        CREATE TEXT SEARCH CONFIGURATION polish (COPY = simple);
        ALTER TEXT SEARCH CONFIGURATION polish ALTER MAPPING FOR word, asciiword WITH unaccent, simple;
    END IF;
END
$$;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    encrypted_password VARCHAR(255) NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create generations table
CREATE TABLE generations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model VARCHAR(255) NOT NULL,
    generated_count INTEGER NOT NULL DEFAULT 0,
    accepted_unedited_count INTEGER NOT NULL DEFAULT 0,
    accepted_edited_count INTEGER NOT NULL DEFAULT 0,
    source_text_hash VARCHAR(64) NOT NULL,
    source_text_length INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    generation_duration INTEGER NOT NULL
);

-- Create flashcards table
CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    front VARCHAR(200) NOT NULL,
    back VARCHAR(500) NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual')),
    generation_id INTEGER REFERENCES generations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create generation_error_logs table
CREATE TABLE generation_error_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model VARCHAR(255) NOT NULL,
    source_text_hash VARCHAR(64) NOT NULL,
    source_text_length INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000),
    error_code VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_generations_generated_count ON generations(generated_count);
CREATE INDEX idx_generations_accepted_unedited_count ON generations(accepted_unedited_count);
CREATE INDEX idx_generations_accepted_edited_count ON generations(accepted_edited_count);
CREATE INDEX idx_generations_user_id ON generations(user_id);

CREATE INDEX idx_flashcards_front_gin ON flashcards USING gin(to_tsvector('polish', front));
CREATE INDEX idx_flashcards_back_gin ON flashcards USING gin(to_tsvector('polish', back));
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_generation_id ON flashcards(generation_id);

CREATE INDEX idx_generation_error_logs_user_id ON generation_error_logs(user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_flashcards_updated_at
    BEFORE UPDATE ON flashcards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generations_updated_at
    BEFORE UPDATE ON generations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generation_error_logs_updated_at
    BEFORE UPDATE ON generation_error_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_error_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY users_policy ON users 
    FOR ALL 
    USING (id = current_setting('app.current_user_id')::uuid);

CREATE POLICY user_flashcards_policy ON flashcards 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY user_generations_policy ON generations 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY user_generation_error_logs_policy ON generation_error_logs 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid); 