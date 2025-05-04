# Podsumowanie zmian po analizie spójności projektu 10x-cards

## 1. Wprowadzone zmiany

### Ujednolicenie liczby pudełek Leitnera
- Zmieniono liczbę pudełek Leitnera z 5 do 3 we wszystkich dokumentach
- Zaktualizowano opisy interwałów powtórek dla poszczególnych pudełek:
  - Poziom 1: powtarzane codziennie
  - Poziom 2: powtarzane co 3 dni
  - Poziom 3: powtarzane co 7 dni
- Zmieniono ograniczenie wartości `leitner_box` w tabeli `flashcard_learning_progress` z `CHECK (leitner_box BETWEEN 1 AND 5)` na `CHECK (leitner_box BETWEEN 1 AND 3)`

### Aktualizacja schematu bazy danych
- Dodano tabele dla systemu Leitnera do głównego schematu bazy danych:
  - `flashcard_learning_progress` - przechowuje informacje o postępach nauki fiszek
  - `review_history` - przechowuje historię powtórek dla fiszek
  - `review_sessions` - przechowuje informacje o sesjach nauki
- Dodano tabelę `system_error_logs` do logowania błędów systemowych
- Zaktualizowano indeksy i polityki RLS dla nowych tabel
- Utworzono przykłady migracji SQL dla Supabase

### Modyfikacje związane z MVP
- Dodano informację o braku weryfikacji email w MVP
- Dodano uwagi o uproszczeniu JWT i potencjalnym pominięciu rate limitingu w MVP
- Zaktualizowano PRD o sekcję "Uwagi dotyczące MVP" z wszystkimi ograniczeniami

### Rozbudowa API planu
- Dodano sekcję "MVP Implementation Notes" z informacjami o uproszczeniach w MVP
- Rozszerzono opis zasobów o `System Error Logs`
- Dodano polski opis systemu Leitnera z 3 pudełkami

### Analiza spójności API i UI
- Przeprowadzono analizę spójności między endpointami API a widokami UI
- Zidentyfikowano brakujące endpointy API dla funkcjonalności UI:
  - Endpointy systemu Leitnera (pobieranie fiszek, zapisywanie powtórek, zarządzanie sesjami)
  - Endpointy zarządzania kontem (zmiana hasła, usunięcie konta)
- Stworzono rekomendacje dla pełnej spójności między API a UI

## 2. Brakujące endpointy zaproponowane do dodania

### System Leitnera
```
GET /api/leitner/flashcards
POST /api/leitner/reviews
POST /api/leitner/sessions
PUT /api/leitner/sessions/{id}/complete
```

### Zarządzanie kontem
```
PUT /api/users/password
DELETE /api/users/me
```

## 3. Kolejne kroki

1. **Aktualizacja dokumentacji API** - dodanie brakujących endpointów do dokumentacji API
2. **Wdrożenie migracji bazy danych** - implementacja schematów tabel opisanych w dokumentacji
3. **Aktualizacja planów implementacyjnych** - rozszerzenie planów implementacyjnych o nowe funkcjonalności
4. **Uzgodnienie priorytetów MVP** - potwierdzenie, które funkcjonalności będą priorytetowe dla MVP

Wszystkie wprowadzone zmiany zwiększają spójność dokumentacji projektu i zapewniają lepsze mapowanie między różnymi warstwami aplikacji (baza danych, API, UI). Uzupełniono braki w dokumentacji i rozszerzono ją o szczegóły dotyczące podejścia do implementacji MVP. 