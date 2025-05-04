-- Migration: Add Leitner System Tables
-- Description: This migration adds tables for the Leitner spaced repetition system, allowing for
-- tracking user progress, review history, and session data.
-- Affected tables: flashcard_learning_progress, review_history, review_sessions

-- Create flashcard_learning_progress table to track learning status of each flashcard
CREATE TABLE flashcard_learning_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flashcard_id INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    leitner_box INTEGER NOT NULL DEFAULT 1 CHECK (leitner_box BETWEEN 1 AND 5),
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    next_review_at TIMESTAMP WITH TIME ZONE,
    consecutive_correct_answers INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, flashcard_id)
);

-- Create review_history table to track each review event
CREATE TABLE review_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flashcard_id INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    previous_box INTEGER NOT NULL,
    new_box INTEGER NOT NULL,
    review_time_ms INTEGER, -- optional, time taken to answer in milliseconds
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create review_sessions table to track study sessions
CREATE TABLE review_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    cards_reviewed INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    total_review_time_ms INTEGER, -- optional, total session time in milliseconds
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for optimized queries
-- flashcard_learning_progress indexes
CREATE INDEX idx_flashcard_learning_progress_user_id 
    ON flashcard_learning_progress(user_id);
CREATE INDEX idx_flashcard_learning_progress_flashcard_id 
    ON flashcard_learning_progress(flashcard_id);
CREATE INDEX idx_flashcard_learning_progress_leitner_box 
    ON flashcard_learning_progress(leitner_box);
CREATE INDEX idx_flashcard_learning_progress_next_review_at 
    ON flashcard_learning_progress(next_review_at);

-- review_history indexes
CREATE INDEX idx_review_history_user_id 
    ON review_history(user_id);
CREATE INDEX idx_review_history_flashcard_id 
    ON review_history(flashcard_id);
CREATE INDEX idx_review_history_created_at 
    ON review_history(created_at);

-- review_sessions indexes
CREATE INDEX idx_review_sessions_user_id 
    ON review_sessions(user_id);
CREATE INDEX idx_review_sessions_started_at 
    ON review_sessions(started_at);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_flashcard_learning_progress_updated_at
    BEFORE UPDATE ON flashcard_learning_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_sessions_updated_at
    BEFORE UPDATE ON review_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for new tables
ALTER TABLE flashcard_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
-- Each user can only access their own learning progress
CREATE POLICY user_flashcard_learning_progress_policy ON flashcard_learning_progress 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Each user can only access their own review history
CREATE POLICY user_review_history_policy ON review_history 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Each user can only access their own review sessions
CREATE POLICY user_review_sessions_policy ON review_sessions 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Add a function to calculate next review date based on Leitner box level
CREATE OR REPLACE FUNCTION calculate_next_review_date(leitner_box INTEGER)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
    days_interval INTEGER;
BEGIN
    -- Define intervals for each Leitner box
    CASE leitner_box
        WHEN 1 THEN days_interval := 1;  -- Review daily
        WHEN 2 THEN days_interval := 2;  -- Review every 2 days
        WHEN 3 THEN days_interval := 5;  -- Review every 5 days
        WHEN 4 THEN days_interval := 8;  -- Review every 8 days
        WHEN 5 THEN days_interval := 14; -- Review every 14 days
        ELSE days_interval := 1;         -- Default to daily
    END CASE;
    
    RETURN CURRENT_TIMESTAMP + (days_interval || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Create a function to initialize learning progress for a new flashcard
CREATE OR REPLACE FUNCTION initialize_flashcard_learning_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a learning progress record for the new flashcard
    INSERT INTO flashcard_learning_progress (
        user_id, 
        flashcard_id, 
        leitner_box, 
        next_review_at
    ) VALUES (
        NEW.user_id, 
        NEW.id, 
        1, -- Start at box 1
        calculate_next_review_date(1) -- Calculate next review date
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically initialize learning progress when a flashcard is created
CREATE TRIGGER initialize_flashcard_learning_progress_trigger
    AFTER INSERT ON flashcards
    FOR EACH ROW
    EXECUTE FUNCTION initialize_flashcard_learning_progress();

-- Add a comment explaining the Leitner system implementation
COMMENT ON TABLE flashcard_learning_progress IS 
'Tracks flashcard progress through the Leitner system with 5 boxes:
Box 1: New or difficult cards (reviewed daily)
Box 2: Basic knowledge (reviewed every 2 days)
Box 3: Good knowledge (reviewed every 5 days)
Box 4: Very good knowledge (reviewed every 8 days)
Box 5: Mastered cards (reviewed every 14 days)
Cards move up a box when answered correctly and back to Box 1 when answered incorrectly.'; 