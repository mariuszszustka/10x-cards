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

## 2. Relacje między tabelami
- Każdy rekord w tabeli `users` może posiadać wiele rekordów w tabelach `flashcards`, `generations` oraz `generation_error_logs`.
- Tabela `flashcards` opcjonalnie odnosi się do tabeli `generations` poprzez kolumnę `generation_id`.

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

## 4. Zasady PostgreSQL (RLS)
- Wdrożyć mechanizmy Row Level Security dla tabel `flashcards`, `generations` oraz `generation_error_logs`, aby ograniczyć dostęp do rekordów użytkownika.
- Przykład polityki RLS dla tabeli `flashcards`:

  ```sql
  ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
  CREATE POLICY user_flashcards_policy ON flashcards 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);
  ```

- Analogiczne polityki należy wdrożyć dla tabel `generations` oraz `generation_error_logs`.

## 5. Dodatkowe uwagi
- Automatyczna aktualizacja pola `updated_at` powinna zostać zrealizowana za pomocą triggera przy każdej modyfikacji rekordu.
- Operacje modyfikacji rekordów w wielu tabelach powinny być wykonywane wewnątrz transakcji, aby zapewnić spójność danych.
