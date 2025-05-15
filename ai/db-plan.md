# Schemat bazy danych dla 10x-cards

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

## 2. Relacje między tabelami

- Każdy rekord w tabeli `users` może posiadać wiele rekordów w tabelach `flashcards`, `generations`, `generation_error_logs`, `flashcard_learning_progress`, `review_history`, `review_sessions` oraz opcjonalnie w `system_error_logs`.
- Tabela `flashcards` opcjonalnie odnosi się do tabeli `generations` poprzez kolumnę `generation_id`.
- Tabela `flashcard_learning_progress` łączy użytkownika z fiszką i śledzi postęp nauki.
- Tabela `review_history` zawiera historię wszystkich powtórek dla danej fiszki.
- Tabela `review_sessions` grupuje powtórki wykonane w ramach pojedynczej sesji nauki.

## 3. Indeksy

- **Tabela generations:**

  - `CREATE INDEX idx_generations_user_id ON generations(user_id);`
  - `CREATE INDEX idx_generations_generated_count ON generations(generated_count);`
  - `CREATE INDEX idx_generations_accepted_unedited_count ON generations(accepted_unedited_count);`
  - `CREATE INDEX idx_generations_accepted_edited_count ON generations(accepted_edited_count);`

- **Tabela flashcards:**

  - `CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);`
  - `CREATE INDEX idx_flashcards_generation_id ON flashcards(generation_id);`
  - `CREATE INDEX idx_flashcards_front_gin ON flashcards USING gin(to_tsvector('polish', front));`
  - `CREATE INDEX idx_flashcards_back_gin ON flashcards USING gin(to_tsvector('polish', back));`

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

## 4. Zasady Row Level Security (RLS)

### Przykłady polityk RLS dla tabel

#### Tabela users

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla tabeli users
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

#### Tabela flashcards

```sql
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla tabeli flashcards
CREATE POLICY "Users can view their own flashcards" ON public.flashcards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flashcards" ON public.flashcards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" ON public.flashcards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" ON public.flashcards
  FOR DELETE USING (auth.uid() = user_id);
```

#### Tabela generations

```sql
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla tabeli generations
CREATE POLICY "Users can view their own generations" ON public.generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations" ON public.generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations" ON public.generations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations" ON public.generations
  FOR DELETE USING (auth.uid() = user_id);
```

#### Tabela system_error_logs

```sql
ALTER TABLE public.system_error_logs ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla tabeli system_error_logs
CREATE POLICY "Only admins can access system error logs" ON public.system_error_logs
  FOR ALL USING (current_setting('app.is_admin')::boolean = true);
```

## 5. Triggery i funkcje

### Trigger dla aktualizacji pola updated_at

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_generations_updated_at
BEFORE UPDATE ON public.generations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
BEFORE UPDATE ON public.flashcards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_generation_error_logs_updated_at
BEFORE UPDATE ON public.generation_error_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcard_learning_progress_updated_at
BEFORE UPDATE ON public.flashcard_learning_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

## 6. Plan migracji Supabase

Implementacja schematu bazy danych będzie wykonana za pomocą migracji Supabase w plikach:

### Migracja 1: Schemat początkowy

Plik: `supabase/migrations/20240513161001_initial_schema.sql`

Zawartość:

- Tworzenie tabeli `users`
- Tworzenie tabeli `generations`
- Tworzenie tabeli `flashcards`
- Tworzenie tabeli `generation_error_logs`
- Tworzenie tabeli `system_error_logs`
- Tworzenie indeksów dla powyższych tabel
- Implementacja polityk RLS
- Funkcja i trigger dla automatycznej aktualizacji pola `updated_at`

### Migracja 2: System Leitnera

Plik: `supabase/migrations/20240515235356_add_leitner_system.sql`

Zawartość:

- Tworzenie tabeli `flashcard_learning_progress`
- Tworzenie tabeli `review_history`
- Tworzenie tabeli `review_sessions`
- Tworzenie indeksów dla powyższych tabel
- Implementacja polityk RLS
- Dodanie triggerów dla automatycznej aktualizacji pola `updated_at`

## 7. Uwagi implementacyjne

### System Leitnera

- MVP używa uproszczonego wariantu z 3 pudełkami zamiast standardowych 5:
  - Poziom 1: Fiszki nowe lub często niepoprawnie odpowiadane (powtarzane codziennie)
  - Poziom 2: Fiszki z podstawową znajomością (powtarzane co 3 dni)
  - Poziom 3: Fiszki dobrze opanowane (powtarzane co 7 dni)

### Bezpieczeństwo danych

- Wszystkie tabele mają włączone Row Level Security
- Każda tabela zawierająca dane użytkownika ma polityki dostępu ograniczone do właściciela danych
- Logi błędów systemowych dostępne są tylko dla administratorów

### Transakcje

- Operacje modyfikacji rekordów w wielu tabelach powinny być wykonywane wewnątrz transakcji
- Szczególnie istotne przy zapisywaniu wyników sesji nauki i aktualizacji postępu fiszek
