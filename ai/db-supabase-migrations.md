---
description:
globs:
alwaysApply: false
---

---

# Specify the following for Cursor rules

description: Guidelines for writing Postgres migrations
globs: "supabase/migrations/\*_/_.sql"

---

# Database: Create migration

You are a Postgres Expert who loves creating secure database schemas.

This project uses the migrations provided by the Supabase CLI.

## Creating a migration file

Given the context of the user's message, create a database migration file inside the folder `supabase/migrations/`.

The file MUST following this naming convention:

The file MUST be named in the format `YYYYMMDDHHmmss_short_description.sql` with proper casing for months, minutes, and seconds in UTC time:

1. `YYYY` - Four digits for the year (e.g., `2024`).
2. `MM` - Two digits for the month (01 to 12).
3. `DD` - Two digits for the day of the month (01 to 31).
4. `HH` - Two digits for the hour in 24-hour format (00 to 23).
5. `mm` - Two digits for the minute (00 to 59).
6. `ss` - Two digits for the second (00 to 59).
7. Add an appropriate description for the migration.

For example:

```
20240906123045_create_profiles.sql
```

## SQL Guidelines

Write Postgres-compatible SQL code for Supabase migration files that:

- Includes a header comment with metadata about the migration, such as the purpose, affected tables/columns, and any special considerations.
- Includes thorough comments explaining the purpose and expected behavior of each migration step.
- Write all SQL in lowercase.
- Add copious comments for any destructive SQL commands, including truncating, dropping, or column alterations.
- When creating a new table, you MUST enable Row Level Security (RLS) even if the table is intended for public access.
- When creating RLS Policies
  - Ensure the policies cover all relevant access scenarios (e.g. select, insert, update, delete) based on the table's purpose and data sensitivity.
  - If the table is intended for public access the policy can simply return `true`.
  - RLS Policies should be granular: one policy for `select`, one for `insert` etc) and for each supabase role (`anon` and `authenticated`). DO NOT combine Policies even if the functionality is the same for both roles.
  - Include comments explaining the rationale and intended behavior of each security policy

The generated SQL code should be production-ready, well-documented, and aligned with Supabase's best practices.

## Przykład migracji dla całego schematu:

```sql
-- migration: 20240513161001_initial_schema.sql
-- Opis: Początkowy schemat bazy danych dla aplikacji 10x-cards
-- Autor: AI Team
-- Data: 2024-05-13

-- Tworzenie tabeli użytkowników
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) not null unique,
  encrypted_password varchar(255) not null,
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone not null default current_timestamp
);

-- Włączenie Row Level Security dla tabeli users
alter table public.users enable row level security;

-- Polityki RLS dla tabeli users
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Tworzenie tabeli generations (generacje fiszek)
create table public.generations (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  model varchar(255) not null,
  generated_count integer not null default 0,
  accepted_unedited_count integer not null default 0,
  accepted_edited_count integer not null default 0,
  source_text_hash varchar(64) not null,
  source_text_length integer not null check (source_text_length between 1000 and 10000),
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp,
  generation_duration integer not null
);

-- Włączenie Row Level Security dla tabeli generations
alter table public.generations enable row level security;

-- Polityki RLS dla tabeli generations
create policy "Users can view their own generations" on public.generations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own generations" on public.generations
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own generations" on public.generations
  for update using (auth.uid() = user_id);

create policy "Users can delete their own generations" on public.generations
  for delete using (auth.uid() = user_id);

-- Tworzenie tabeli flashcards (fiszki)
create table public.flashcards (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  front varchar(200) not null,
  back varchar(500) not null,
  source varchar(20) not null check (source in ('ai-full', 'ai-edited', 'manual')),
  generation_id integer references public.generations(id) on delete set null,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp
);

-- Włączenie Row Level Security dla tabeli flashcards
alter table public.flashcards enable row level security;

-- Polityki RLS dla tabeli flashcards
create policy "Users can view their own flashcards" on public.flashcards
  for select using (auth.uid() = user_id);

create policy "Users can insert their own flashcards" on public.flashcards
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own flashcards" on public.flashcards
  for update using (auth.uid() = user_id);

create policy "Users can delete their own flashcards" on public.flashcards
  for delete using (auth.uid() = user_id);

-- Tworzenie tabeli generation_error_logs (logi błędów generacji)
create table public.generation_error_logs (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  model varchar(255) not null,
  source_text_hash varchar(64) not null,
  source_text_length integer not null check (source_text_length between 1000 and 10000),
  error_code varchar(100) not null,
  error_message text not null,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp
);

-- Włączenie Row Level Security dla tabeli generation_error_logs
alter table public.generation_error_logs enable row level security;

-- Polityki RLS dla tabeli generation_error_logs
create policy "Users can view their own generation error logs" on public.generation_error_logs
  for select using (auth.uid() = user_id);

-- Tworzenie tabeli system_error_logs (logi błędów systemowych)
create table public.system_error_logs (
  id serial primary key,
  error_type varchar(50) not null,
  error_message text not null,
  error_details jsonb,
  source varchar(100) not null,
  user_id uuid references public.users(id) on delete set null,
  created_at timestamp with time zone not null default current_timestamp,
  severity varchar(20) not null check (severity in ('low', 'medium', 'high', 'critical')),
  resolved boolean not null default false
);

-- Włączenie Row Level Security dla tabeli system_error_logs
alter table public.system_error_logs enable row level security;

-- Polityki RLS dla tabeli system_error_logs (dostępne tylko dla administratorów)
create policy "Only admins can access system error logs" on public.system_error_logs
  for all using (current_setting('app.is_admin')::boolean = true);

-- Utworzenie indeksów
create index idx_generations_user_id on public.generations(user_id);
create index idx_generations_generated_count on public.generations(generated_count);
create index idx_generations_accepted_unedited_count on public.generations(accepted_unedited_count);
create index idx_generations_accepted_edited_count on public.generations(accepted_edited_count);

create index idx_flashcards_user_id on public.flashcards(user_id);
create index idx_flashcards_generation_id on public.flashcards(generation_id);
create index idx_flashcards_front_gin on public.flashcards using gin(to_tsvector('polish', front));
create index idx_flashcards_back_gin on public.flashcards using gin(to_tsvector('polish', back));

create index idx_generation_error_logs_user_id on public.generation_error_logs(user_id);

create index idx_system_error_logs_error_type on public.system_error_logs(error_type);
create index idx_system_error_logs_severity on public.system_error_logs(severity);
create index idx_system_error_logs_created_at on public.system_error_logs(created_at);
create index idx_system_error_logs_user_id on public.system_error_logs(user_id);

-- Utworzenie triggerów dla automatycznej aktualizacji updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger update_generations_updated_at
before update on public.generations
for each row
execute function public.update_updated_at_column();

create trigger update_flashcards_updated_at
before update on public.flashcards
for each row
execute function public.update_updated_at_column();

create trigger update_generation_error_logs_updated_at
before update on public.generation_error_logs
for each row
execute function public.update_updated_at_column();

-- Komentarze do tabel
comment on table public.users is 'Tabela przechowująca dane użytkowników aplikacji';
comment on table public.generations is 'Tabela przechowująca informacje o generacjach fiszek przez AI';
comment on table public.flashcards is 'Tabela przechowująca fiszki użytkowników';
comment on table public.generation_error_logs is 'Tabela przechowująca logi błędów podczas generacji fiszek';
comment on table public.system_error_logs is 'Tabela przechowująca logi błędów systemowych aplikacji';
```

## Przykład migracji dodającej system Leitnera:

```sql
-- migration: 20240515235356_add_leitner_system.sql
-- Opis: Dodanie tabel dla systemu Leitnera
-- Autor: AI Team
-- Data: 2024-05-15

-- Tworzenie tabeli flashcard_learning_progress (postęp nauki fiszek)
create table public.flashcard_learning_progress (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  flashcard_id integer not null references public.flashcards(id) on delete cascade,
  leitner_box integer not null default 1 check (leitner_box between 1 and 3),
  last_reviewed_at timestamp with time zone,
  next_review_at timestamp with time zone,
  consecutive_correct_answers integer not null default 0,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp
);

-- Włączenie Row Level Security dla tabeli flashcard_learning_progress
alter table public.flashcard_learning_progress enable row level security;

-- Polityki RLS dla tabeli flashcard_learning_progress
create policy "Users can view their own learning progress" on public.flashcard_learning_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert their own learning progress" on public.flashcard_learning_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own learning progress" on public.flashcard_learning_progress
  for update using (auth.uid() = user_id);

create policy "Users can delete their own learning progress" on public.flashcard_learning_progress
  for delete using (auth.uid() = user_id);

-- Tworzenie tabeli review_history (historia powtórek)
create table public.review_history (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  flashcard_id integer not null references public.flashcards(id) on delete cascade,
  is_correct boolean not null,
  previous_box integer not null,
  new_box integer not null,
  review_time_ms integer,
  created_at timestamp with time zone not null default current_timestamp
);

-- Włączenie Row Level Security dla tabeli review_history
alter table public.review_history enable row level security;

-- Polityki RLS dla tabeli review_history
create policy "Users can view their own review history" on public.review_history
  for select using (auth.uid() = user_id);

create policy "Users can insert their own review history" on public.review_history
  for insert with check (auth.uid() = user_id);

-- Tworzenie tabeli review_sessions (sesje powtórek)
create table public.review_sessions (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  started_at timestamp with time zone not null default current_timestamp,
  completed_at timestamp with time zone,
  cards_reviewed integer not null default 0,
  correct_answers integer not null default 0,
  incorrect_answers integer not null default 0,
  total_review_time_ms integer,
  created_at timestamp with time zone not null default current_timestamp
);

-- Włączenie Row Level Security dla tabeli review_sessions
alter table public.review_sessions enable row level security;

-- Polityki RLS dla tabeli review_sessions
create policy "Users can view their own review sessions" on public.review_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own review sessions" on public.review_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own review sessions" on public.review_sessions
  for update using (auth.uid() = user_id);

-- Utworzenie indeksów
create index idx_flashcard_learning_progress_user_id on public.flashcard_learning_progress(user_id);
create index idx_flashcard_learning_progress_flashcard_id on public.flashcard_learning_progress(flashcard_id);
create index idx_flashcard_learning_progress_leitner_box on public.flashcard_learning_progress(leitner_box);
create index idx_flashcard_learning_progress_next_review_at on public.flashcard_learning_progress(next_review_at);

create index idx_review_history_user_id on public.review_history(user_id);
create index idx_review_history_flashcard_id on public.review_history(flashcard_id);
create index idx_review_history_created_at on public.review_history(created_at);

create index idx_review_sessions_user_id on public.review_sessions(user_id);
create index idx_review_sessions_started_at on public.review_sessions(started_at);

-- Utworzenie triggerów dla automatycznej aktualizacji updated_at
create trigger update_flashcard_learning_progress_updated_at
before update on public.flashcard_learning_progress
for each row
execute function public.update_updated_at_column();

-- Komentarze do tabel
comment on table public.flashcard_learning_progress is 'Tabela przechowująca postęp nauki fiszek w systemie Leitnera';
comment on table public.review_history is 'Tabela przechowująca historię powtórek fiszek';
comment on table public.review_sessions is 'Tabela przechowująca informacje o sesjach powtórek';
```
