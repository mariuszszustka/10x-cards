# Schemat bazy danych - 10x-cards

## 1. Tabele i kolumny

### Tabela: users
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `email` VARCHAR(255) NOT NULL UNIQUE
- `encrypted_password` VARCHAR(255) NOT NULL
- `confirmed_at` TIMESTAMP WITH TIME ZONE
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: flashcards
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `front` VARCHAR(200) NOT NULL
- `back` VARCHAR(500) NOT NULL
- `source` VARCHAR(20) NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual'))
- `generation_id` INTEGER NULL REFERENCES generations(id) ON DELETE SET NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: generations
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `model` VARCHAR(255) NOT NULL
- `generated_count` INTEGER NOT NULL DEFAULT 0
- `accepted_unedited_count` INTEGER NOT NULL DEFAULT 0
- `accepted_edited_count` INTEGER NOT NULL DEFAULT 0
- `source_text_hash` VARCHAR(64) NOT NULL
- `source_text_length` INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `generation_duration` INTEGER NOT NULL

### Tabela: generation_error_logs
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `model` VARCHAR(255) NOT NULL
- `source_text_hash` VARCHAR(64) NOT NULL
- `source_text_length` INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- `error_code` VARCHAR(100) NOT NULL
- `error_message` TEXT NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: flashcard_learning_progress
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `flashcard_id` INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE
- `leitner_box` INTEGER NOT NULL DEFAULT 1 CHECK (leitner_box BETWEEN 1 AND 3)
- `last_reviewed_at` TIMESTAMP WITH TIME ZONE
- `next_review_at` TIMESTAMP WITH TIME ZONE
- `consecutive_correct_answers` INTEGER NOT NULL DEFAULT 0
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: review_history
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `flashcard_id` INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE
- `is_correct` BOOLEAN NOT NULL
- `previous_box` INTEGER NOT NULL
- `new_box` INTEGER NOT NULL
- `review_time_ms` INTEGER
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: review_sessions
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `started_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `completed_at` TIMESTAMP WITH TIME ZONE
- `cards_reviewed` INTEGER NOT NULL DEFAULT 0
- `correct_answers` INTEGER NOT NULL DEFAULT 0
- `incorrect_answers` INTEGER NOT NULL DEFAULT 0
- `total_review_time_ms` INTEGER
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: system_error_logs
- `id` SERIAL PRIMARY KEY
- `error_type` VARCHAR(50) NOT NULL
- `error_message` TEXT NOT NULL
- `error_details` JSONB
- `source` VARCHAR(100) NOT NULL
- `user_id` UUID REFERENCES users(id) ON DELETE SET NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `severity` VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical'))
- `resolved` BOOLEAN NOT NULL DEFAULT false

## 2. Relacje między tabelami
- Każdy rekord w tabeli `users` może posiadać wiele rekordów w tabelach `flashcards`, `generations`, `generation_error_logs`, `flashcard_learning_progress`, `review_history`, `review_sessions` oraz opcjonalnie w `system_error_logs`.
- Tabela `flashcards` opcjonalnie odnosi się do tabeli `generations` poprzez kolumnę `generation_id`.
- Tabela `flashcard_learning_progress` łączy użytkownika z fiszką i śledzi postęp nauki.
- Tabela `review_history` zawiera historię wszystkich powtórek dla danej fiszki.
- Tabela `review_sessions` grupuje powtórki wykonane w ramach pojedynczej sesji nauki.

## 3. Indeksy

- **Tabela generations:**
  - `CREATE INDEX idx_generations_generated_count ON generations(generated_count);`
  - `CREATE INDEX idx_generations_accepted_unedited_count ON generations(accepted_unedited_count);`
  - `CREATE INDEX idx_generations_accepted_edited_count ON generations(accepted_edited_count);`
  - `CREATE INDEX idx_generations_user_id ON generations(user_id);`

- **Tabela flashcards:**
  - `CREATE INDEX idx_flashcards_front_gin ON flashcards USING gin(to_tsvector('polish', front));`
  - `CREATE INDEX idx_flashcards_back_gin ON flashcards USING gin(to_tsvector('polish', back));`
  - `CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);`
  - `CREATE INDEX idx_flashcards_generation_id ON flashcards(generation_id);`

- **Tabela generation_error_logs:**
  - `CREATE INDEX idx_generation_error_logs_user_id ON generation_error_logs(user_id);`

- **Tabela flashcard_learning_progress:**
  - `CREATE INDEX idx_flashcard_learning_progress_user_id ON flashcard_learning_progress(user_id);`
  - `CREATE INDEX idx_flashcard_learning_progress_flashcard_id ON flashcard_learning_progress(flashcard_id);`
  - `CREATE INDEX idx_flashcard_learning_progress_leitner_box ON flashcard_learning_progress(leitner_box);`
  - `CREATE INDEX idx_flashcard_learning_progress_next_review_at ON flashcard_learning_progress(next_review_at);`

- **Tabela review_history:**
  - `CREATE INDEX idx_review_history_user_id ON review_history(user_id);`
  - `CREATE INDEX idx_review_history_flashcard_id ON review_history(flashcard_id);`
  - `CREATE INDEX idx_review_history_created_at ON review_history(created_at);`

- **Tabela review_sessions:**
  - `CREATE INDEX idx_review_sessions_user_id ON review_sessions(user_id);`
  - `CREATE INDEX idx_review_sessions_started_at ON review_sessions(started_at);`

- **Tabela system_error_logs:**
  - `CREATE INDEX idx_system_error_logs_error_type ON system_error_logs(error_type);`
  - `CREATE INDEX idx_system_error_logs_severity ON system_error_logs(severity);`
  - `CREATE INDEX idx_system_error_logs_created_at ON system_error_logs(created_at);`
  - `CREATE INDEX idx_system_error_logs_user_id ON system_error_logs(user_id);`

## 4. Zasady PostgreSQL (RLS)
- Wdrożyć mechanizmy Row Level Security dla tabel `flashcards`, `generations`, `generation_error_logs`, `flashcard_learning_progress`, `review_history` oraz `review_sessions`, aby ograniczyć dostęp do rekordów użytkownika.
- Przykład polityki RLS dla tabeli `flashcards`:

  ```sql
  ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
  CREATE POLICY user_flashcards_policy ON flashcards 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);
  ```

- Analogiczne polityki należy wdrożyć dla pozostałych tabel zawierających dane użytkowników.
- Tabela `system_error_logs` powinna być dostępna tylko dla administratorów:

  ```sql
  ALTER TABLE system_error_logs ENABLE ROW LEVEL SECURITY;
  CREATE POLICY admin_system_error_logs_policy ON system_error_logs
    FOR ALL
    USING (current_setting('app.is_admin')::boolean = true);
  ```

## 5. Dodatkowe uwagi
- Automatyczna aktualizacja pola `updated_at` powinna zostać zrealizowana za pomocą triggera przy każdej modyfikacji rekordu.
- Operacje modyfikacji rekordów w wielu tabelach powinny być wykonywane wewnątrz transakcji, aby zapewnić spójność danych.
