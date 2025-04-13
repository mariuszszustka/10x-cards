-- Insert test user
INSERT INTO users (id, email, encrypted_password, confirmed_at, created_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'test@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NXFp/XAL.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert test generation
INSERT INTO generations (
    user_id,
    model,
    generated_count,
    accepted_unedited_count,
    accepted_edited_count,
    source_text_hash,
    source_text_length,
    generation_duration
)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'gpt-4',
    10,
    5,
    3,
    'abc123',
    1500,
    120
);

-- Insert test flashcards
INSERT INTO flashcards (user_id, front, back, source, generation_id)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Co to jest PostgreSQL?', 'PostgreSQL to system zarządzania relacyjnymi bazami danych', 'ai-full', 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Co to jest Supabase?', 'Supabase to platforma open-source będąca alternatywą dla Firebase', 'manual', NULL);

-- Insert test error log
INSERT INTO generation_error_logs (
    user_id,
    model,
    source_text_hash,
    source_text_length,
    error_code,
    error_message
)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'gpt-4',
    'def456',
    2000,
    'TIMEOUT_ERROR',
    'Request timed out after 60 seconds'
); 