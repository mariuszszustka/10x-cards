-- Migration: Add Leitner System Functions
-- Description: This migration adds stored procedures and functions to support 
-- the Leitner system's review process.

-- Create a function to update flashcard review results
CREATE OR REPLACE FUNCTION update_flashcard_review_result(
    p_flashcard_id INTEGER,
    p_user_id UUID,
    p_is_correct BOOLEAN,
    p_previous_box INTEGER,
    p_new_box INTEGER,
    p_review_time_ms INTEGER DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_next_review_at TIMESTAMP WITH TIME ZONE;
    v_result JSONB;
BEGIN
    -- Get the next review date based on the new Leitner box
    v_next_review_at := calculate_next_review_date(p_new_box);
    
    -- Begin transaction
    BEGIN
        -- 1. Update the flashcard learning progress
        UPDATE flashcard_learning_progress
        SET leitner_box = p_new_box,
            last_reviewed_at = CURRENT_TIMESTAMP,
            next_review_at = v_next_review_at,
            consecutive_correct_answers = CASE 
                WHEN p_is_correct THEN consecutive_correct_answers + 1
                ELSE 0
            END
        WHERE flashcard_id = p_flashcard_id 
          AND user_id = p_user_id;
          
        -- 2. Add entry to review history
        INSERT INTO review_history (
            user_id,
            flashcard_id,
            is_correct,
            previous_box,
            new_box,
            review_time_ms
        ) VALUES (
            p_user_id,
            p_flashcard_id,
            p_is_correct,
            p_previous_box,
            p_new_box,
            p_review_time_ms
        );
    END;
    
    -- Create result JSON with the next review date
    v_result := jsonb_build_object(
        'success', TRUE,
        'flashcard_id', p_flashcard_id,
        'previous_box', p_previous_box,
        'new_box', p_new_box,
        'is_correct', p_is_correct,
        'next_review_at', v_next_review_at
    );
    
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return error information
        RAISE NOTICE 'Error in update_flashcard_review_result: %', SQLERRM;
        
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

-- Create a function to update review session with results
CREATE OR REPLACE FUNCTION update_review_session_with_results(
    p_session_id INTEGER,
    p_user_id UUID,
    p_results JSONB,
    p_mark_completed BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_review_record JSONB;
    v_correct_count INTEGER := 0;
    v_total_count INTEGER := jsonb_array_length(p_results);
BEGIN
    -- Process each review result
    FOR i IN 0..(v_total_count - 1) LOOP
        v_review_record := p_results->i;
        
        -- Call the review result function for each flashcard
        PERFORM update_flashcard_review_result(
            (v_review_record->>'flashcard_id')::INTEGER,
            p_user_id,
            (v_review_record->>'is_correct')::BOOLEAN,
            (v_review_record->>'previous_box')::INTEGER,
            (v_review_record->>'new_box')::INTEGER,
            (v_review_record->>'review_time_ms')::INTEGER
        );
        
        -- Count correct answers
        IF (v_review_record->>'is_correct')::BOOLEAN THEN
            v_correct_count := v_correct_count + 1;
        END IF;
    END LOOP;
    
    -- Update the review session
    UPDATE review_sessions
    SET cards_reviewed = cards_reviewed + v_total_count,
        correct_answers = correct_answers + v_correct_count,
        incorrect_answers = incorrect_answers + (v_total_count - v_correct_count),
        completed_at = CASE WHEN p_mark_completed THEN CURRENT_TIMESTAMP ELSE completed_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_session_id
      AND user_id = p_user_id;
      
    -- Return result
    SELECT json_build_object(
        'success', TRUE,
        'session_id', p_session_id,
        'processed_reviews', v_total_count,
        'correct_answers', v_correct_count,
        'incorrect_answers', v_total_count - v_correct_count,
        'completed', p_mark_completed
    ) INTO v_result;
    
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return error information
        RAISE NOTICE 'Error in update_review_session_with_results: %', SQLERRM;
        
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get learning statistics for a user
CREATE OR REPLACE FUNCTION get_user_learning_stats(
    p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_total_cards INTEGER;
    v_cards_by_box JSONB;
    v_cards_to_review INTEGER;
    v_review_success_rate NUMERIC;
    v_avg_cards_per_session NUMERIC;
    v_total_sessions INTEGER;
    v_total_reviews INTEGER;
BEGIN
    -- Get total cards count
    SELECT COUNT(*) INTO v_total_cards
    FROM flashcard_learning_progress
    WHERE user_id = p_user_id;
    
    -- Get cards by Leitner box
    SELECT jsonb_object_agg(leitner_box, count) INTO v_cards_by_box
    FROM (
        SELECT leitner_box, COUNT(*) as count
        FROM flashcard_learning_progress
        WHERE user_id = p_user_id
        GROUP BY leitner_box
    ) as box_counts;
    
    -- Get cards to review today
    SELECT COUNT(*) INTO v_cards_to_review
    FROM flashcard_learning_progress
    WHERE user_id = p_user_id
      AND next_review_at <= CURRENT_TIMESTAMP;
      
    -- Get review success rate
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100, 1)
            ELSE 0
        END INTO v_review_success_rate
    FROM review_history
    WHERE user_id = p_user_id;
    
    -- Get session stats
    SELECT 
        COUNT(*),
        COALESCE(SUM(cards_reviewed), 0),
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COALESCE(SUM(cards_reviewed), 0)::NUMERIC / COUNT(*)), 1)
            ELSE 0
        END
    INTO v_total_sessions, v_total_reviews, v_avg_cards_per_session
    FROM review_sessions
    WHERE user_id = p_user_id;
    
    -- Build result JSON
    v_result := jsonb_build_object(
        'total_cards', v_total_cards,
        'cards_by_box', COALESCE(v_cards_by_box, '{}'::JSONB),
        'cards_to_review_today', v_cards_to_review,
        'review_success_rate', v_review_success_rate,
        'avg_cards_per_session', v_avg_cards_per_session,
        'total_review_sessions', v_total_sessions,
        'total_reviews', v_total_reviews
    );
    
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return error information
        RAISE NOTICE 'Error in get_user_learning_stats: %', SQLERRM;
        
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql; 