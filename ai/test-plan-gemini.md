# Plan Testów dla Projektu "10x-cards"

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument opisuje plan testów dla aplikacji webowej "10x-cards". Aplikacja ma na celu umożliwienie użytkownikom tworzenia, zarządzania i nauki fiszek edukacyjnych, wykorzystując wspomaganie AI (modele LLM) do generowania sugestii oraz system Leitnera do efektywnej nauki metodą powtórek rozłożonych w czasie (spaced repetition). Plan ten został opracowany w celu zapewnienia wysokiej jakości produktu końcowego, zgodnego z wymaganiami MVP (Minimum Viable Product).

### 1.2. Cele Testowania

Główne cele procesu testowania to:

- **Weryfikacja Funkcjonalności:** Sprawdzenie, czy wszystkie funkcjonalności zdefiniowane w zakresie MVP działają zgodnie ze specyfikacją.
- **Identyfikacja Defektów:** Wykrycie i zaraportowanie błędów w oprogramowaniu.
- **Ocena Jakości:** Ocena ogólnej jakości aplikacji pod kątem stabilności, wydajności, bezpieczeństwa i użyteczności.
- **Zapewnienie Zgodności:** Upewnienie się, że aplikacja spełnia wymagania biznesowe i techniczne.
- **Minimalizacja Ryzyka:** Identyfikacja i ocena potencjalnych ryzyk związanych z działaniem aplikacji oraz ich minimalizacja poprzez testowanie.
- **Wsparcie Procesu Wydawniczego:** Dostarczenie informacji potrzebnych do podjęcia decyzji o wydaniu wersji produkcyjnej aplikacji.

## 2. Zakres Testów

### 2.1. Funkcjonalności Włączone w Zakres Testów (In-Scope)

Testowaniu podlegają wszystkie funkcjonalności zdefiniowane w zakresie MVP projektu "10x-cards":

- **Uwierzytelnianie i Zarządzanie Kontem:**
  - Rejestracja nowych użytkowników.
  - Logowanie i wylogowywanie.
  - Resetowanie hasła.
  - Aktualizacja hasła zalogowanego użytkownika.
  - Ochrona dostępu do danych użytkownika.
- **Ręczne Zarządzanie Fiszami:**
  - Tworzenie nowych fiszek (pytanie/odpowiedź).
  - Edycja istniejących fiszek.
  - Usuwanie fiszek (z potwierdzeniem).
  - Wyświetlanie listy fiszek (z paginacją i wyszukiwaniem pełnotekstowym).
- **Generowanie Fiszki Wspierane przez AI:**
  - Wklejanie tekstu (1000-10000 znaków).
  - Wyzwalanie procesu generowania fiszek przez API LLM (Ollama, OpenAI, Openrouter).
  - Wyświetlanie sugerowanych fiszek.
  - Możliwość akceptacji/edycji/odrzucenia wygenerowanych sugestii.
  - Obsługa błędów związanych z generowaniem AI.
  - Logowanie procesu generowania i ewentualnych błędów.
- **System Leitnera (Spaced Repetition):**
  - Rozpoczynanie sesji przeglądania fiszek.
  - Prezentacja fiszek zgodnie z algorytmem Leitnera (5 poziomów).
  - Ocenianie znajomości fiszki przez użytkownika (np. "łatwa", "trudna").
  - Automatyczne przesuwanie fiszek między poziomami Leitnera na podstawie odpowiedzi.
  - Zakończenie sesji przeglądania.
- **Śledzenie Postępów i Statystyki:**
  - Wyświetlanie statystyk użytkownika (np. liczba fiszek na każdym poziomie Leitnera).
  - Monitorowanie efektywności nauki.
- **Interfejs Użytkownika (UI):**
  - Nawigacja w aplikacji.
  - Wygląd i działanie komponentów UI (Shadcn/UI, Tailwind CSS).
  - Responsywność interfejsu na różnych rozmiarach ekranu.
  - Wyświetlanie powiadomień (Toast).
- **Integracja z Backendem (Supabase):**
  - Poprawność zapytań do bazy danych.
  - Prawidłowe działanie funkcji RLS (Row Level Security) - jeśli zostanie włączone.
  - Obsługa sesji użytkownika (`@supabase/ssr`).

### 2.2. Funkcjonalności Wyłączone z Zakresu Testów (Out-of-Scope)

Następujące elementy są wyłączone z zakresu testów dla wersji MVP:

- Zaawansowane algorytmy spaced repetition (inne niż podstawowy Leitner).
- Import dokumentów (PDF, DOCX).
- Współdzielenie fiszek między użytkownikami.
- Aplikacje mobilne.
- Publiczne API dla deweloperów zewnętrznych.
- Zaawansowane mechanizmy gamifikacji i powiadomień.
- Zaawansowane wyszukiwanie po słowach kluczowych (poza standardowym full-text search).
- Testy obciążeniowe symulujące skrajnie dużą liczbę jednoczesnych użytkowników (początkowe testy wydajnościowe są w zakresie).

## 3. Typy Testów do Przeprowadzenia

W celu zapewnienia kompleksowego pokrycia testowego, zostaną przeprowadzone następujące typy testów:

- **Testy Jednostkowe (Unit Tests):**
  - **Cel:** Weryfikacja poprawności działania pojedynczych komponentów (np. funkcji pomocniczych, logiki komponentów React, hooków) w izolacji.
  - **Narzędzia:** Vitest/Jest, React Testing Library.
  - **Zakres:** Funkcje w `src/lib`, logika komponentów React, hooki `useFlashcards`, `useModal`, `useToast`, logika store Zustand.
- **Testy Integracyjne (Integration Tests):**
  - **Cel:** Weryfikacja współpracy między różnymi modułami i komponentami systemu.
  - **Narzędzia:** Vitest/Jest, React Testing Library, Supertest (dla API), Mock Service Worker (MSW) lub mockowanie API Supabase/AI.
  - **Zakres:** Interakcje między komponentami React, komunikacja Frontend-Backend (API endpoints), integracja z Supabase Auth i DB, integracja z serwisem AI (z użyciem mocków).
- **Testy Systemowe / End-to-End (E2E Tests):**
  - **Cel:** Weryfikacja kompletnych przepływów użytkownika w aplikacji z perspektywy użytkownika końcowego, symulując rzeczywiste scenariusze użycia.
  - **Narzędzia:** Playwright (preferowany ze względu na wsparcie dla Astro i wizualne regresje), Cypress.
  - **Zakres:** Pełne scenariusze: rejestracja -> logowanie -> tworzenie fiszki (ręczne/AI) -> sesja nauki Leitner -> wylogowanie.
- **Testy API:**
  - **Cel:** Bezpośrednia weryfikacja poprawności działania endpointów API (w `src/pages/api/`) pod kątem logiki biznesowej, obsługi żądań, formatu odpowiedzi i obsługi błędów.
  - **Narzędzia:** Playwright (API testing), Postman, Insomnia.
  - **Zakres:** Endpointy dla uwierzytelniania, zarządzania fiszkami, generowania AI, systemu Leitnera.
- **Testy Wydajnościowe (Performance Tests):**
  - **Cel:** Ocena responsywności i stabilności aplikacji pod obciążeniem (początkowo dla kluczowych API). Ocena szybkości ładowania frontendu.
  - **Narzędzia:** k6 (dla API), Playwright (profilowanie frontendu), Lighthouse.
  - **Zakres:** Kluczowe endpointy API (np. pobieranie fiszek, generowanie AI), czas ładowania kluczowych stron (dashboard, flashcards).
- **Testy Bezpieczeństwa (Security Tests):**
  - **Cel:** Identyfikacja potencjalnych luk bezpieczeństwa w aplikacji.
  - **Narzędzia:** Manualna inspekcja kodu, OWASP ZAP (podstawowe skanowanie), narzędzia deweloperskie przeglądarki.
  - **Zakres:** Proces uwierzytelniania, zarządzanie sesją, autoryzacja dostępu do danych (RLS), walidacja danych wejściowych (zapobieganie XSS, SQL Injection - choć Supabase pomaga).
- **Testy Użyteczności (Usability Tests):**
  - **Cel:** Ocena intuicyjności, łatwości obsługi i ogólnego doświadczenia użytkownika (UX).
  - **Narzędzia:** Testy manualne, zbieranie opinii.
  - **Zakres:** Nawigacja, przepływ tworzenia fiszek, proces nauki, czytelność interfejsu.
- **Testy Kompatybilności (Compatibility Tests):**
  - **Cel:** Sprawdzenie poprawnego działania aplikacji w różnych przeglądarkach internetowych.
  - **Narzędzia:** Manualne testy, ewentualnie narzędzia do testów cross-browser (np. BrowserStack, jeśli dostępne).
  - **Zakres:** Główne funkcjonalności na najnowszych wersjach Chrome, Firefox, Safari, Edge.
- **Testy Wizualnej Regresji (Visual Regression Tests):**
  - **Cel:** Wykrywanie niezamierzonych zmian w wyglądzie interfejsu użytkownika.
  - **Narzędzia:** Playwright (zintegrowane porównywanie zrzutów ekranu), ewentualnie Percy/Chromatic.
  - **Zakres:** Kluczowe strony i komponenty (Layout, Navbar, formularze, siatka fiszek).

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

Poniżej przedstawiono przykładowe, wysokopoziomowe scenariusze testowe dla kluczowych funkcjonalności MVP. Szczegółowe przypadki testowe zostaną opracowane oddzielnie.

### 4.1. Uwierzytelnianie i Zarządzanie Kontem

- **TC-AUTH-01:** Pomyślna rejestracja nowego użytkownika z poprawnymi danymi.
- **TC-AUTH-02:** Próba rejestracji z istniejącym adresem e-mail.
- **TC-AUTH-03:** Próba rejestracji z niepoprawnym formatem e-maila lub zbyt krótkim hasłem.
- **TC-AUTH-04:** Pomyślne logowanie z poprawnymi danymi uwierzytelniającymi.
- **TC-AUTH-05:** Próba logowania z niepoprawnym hasłem lub nieistniejącym użytkownikiem.
- **TC-AUTH-06:** Pomyślne wylogowanie użytkownika.
- **TC-AUTH-07:** Pomyślne zainicjowanie i ukończenie procesu resetowania hasła.
- **TC-AUTH-08:** Pomyślna aktualizacja hasła przez zalogowanego użytkownika.
- **TC-AUTH-09:** Weryfikacja ochrony dostępu do stron wymagających zalogowania (np. `/dashboard`, `/flashcards`).

### 4.2. Ręczne Zarządzanie Fiszami

- **TC-MAN-FC-01:** Pomyślne utworzenie nowej fiszki z pytaniem i odpowiedzią.
- **TC-MAN-FC-02:** Pomyślna edycja istniejącej fiszki.
- **TC-MAN-FC-03:** Pomyślne usunięcie fiszki po potwierdzeniu.
- **TC-MAN-FC-04:** Anulowanie usuwania fiszki.
- **TC-MAN-FC-05:** Wyświetlanie listy fiszek z poprawną paginacją.
- **TC-MAN-FC-06:** Wyszukiwanie fiszek za pomocą paska wyszukiwania (pełnotekstowe).

### 4.3. Generowanie Fiszki Wspierane przez AI

- **TC-AI-FC-01:** Pomyślne wygenerowanie sugestii fiszek po wklejeniu tekstu w dozwolonym zakresie (1000-10000 znaków).
- **TC-AI-FC-02:** Próba generowania fiszek z tekstem poniżej 1000 znaków.
- **TC-AI-FC-03:** Próba generowania fiszek z tekstem powyżej 10000 znaków.
- **TC-AI-FC-04:** Obsługa błędów podczas komunikacji z API LLM (np. timeout, błąd API).
- **TC-AI-FC-05:** Możliwość zapisania wygenerowanych i zaakceptowanych fiszek.
- **TC-AI-FC-06:** Weryfikacja logowania procesu generowania w bazie danych Supabase (tabela `generations`, `generation_error_logs`).

### 4.4. System Leitnera

- **TC-LEITNER-01:** Rozpoczęcie sesji przeglądania - poprawne pobranie fiszek do przeglądu.
- **TC-LEITNER-02:** Poprawne wyświetlanie pytania i odpowiedzi fiszki.
- **TC-LEITNER-03:** Oznaczenie fiszki jako "łatwa" - przesunięcie na wyższy poziom (lub usunięcie z cyklu po poziomie 5).
- **TC-LEITNER-04:** Oznaczenie fiszki jako "trudna" - powrót na poziom 1.
- **TC-LEITNER-05:** Weryfikacja, czy fiszki pojawiają się zgodnie z zasadami spaced repetition (trudniejsze do weryfikacji automatycznej, wymaga logiki i potencjalnie testów manualnych).
- **TC-LEITNER-06:** Zakończenie sesji przeglądania.
- **TC-LEITNER-07:** Weryfikacja aktualizacji poziomów fiszek w bazie danych po sesji.

### 4.5. Śledzenie Postępów i Statystyki

- **TC-STATS-01:** Poprawne wyświetlanie strony statystyk dla zalogowanego użytkownika.
- **TC-STATS-02:** Weryfikacja poprawności danych statystycznych (liczba fiszek na każdym poziomie Leitnera).
- **TC-STATS-03:** Aktualizacja statystyk po zakończeniu sesji przeglądania Leitner.

## 5. Środowisko Testowe

- **Środowisko Deweloperskie (Lokalne):** Używane przez deweloperów do uruchamiania testów jednostkowych i integracyjnych podczas rozwoju. Konfiguracja zgodna z `README.md` (Node.js v22.14.0, npm, Docker dla Supabase lokalnie).
- **Środowisko Testowe (Staging):** Oddzielna instancja aplikacji wdrożona na platformie zbliżonej do produkcyjnej (np. DigitalOcean, Vercel). Powinna korzystać z oddzielnej instancji Supabase (Cloud) skonfigurowanej podobnie do produkcyjnej. Środowisko używane do testów E2E, UAT, wydajnościowych i bezpieczeństwa.
- **Przeglądarki:** Testy będą przeprowadzane na najnowszych stabilnych wersjach następujących przeglądarek:
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge
  - Apple Safari
- **Systemy Operacyjne:** Testy manualne i E2E będą przeprowadzane głównie na Windows i macOS. Kompatybilność z Linuxem będzie weryfikowana w miarę możliwości.
- **Dane Testowe:** Przygotowane zestawy danych testowych w Supabase (lokalnie i na stagingu), w tym użytkownicy testowi, zestawy fiszek na różnych poziomach Leitnera, przykładowe teksty do generowania AI. Plik `seed.sql` może być punktem wyjścia.

## 6. Narzędzia do Testowania

- **Testy Automatyczne (Unit/Integration):** Vitest/Jest + React Testing Library
- **Testy Automatyczne (E2E/Visual Regression):** Playwright
- **Testy API:** Playwright (API Testing) / Postman / Insomnia
- **Testy Wydajnościowe:** k6, Playwright (profilowanie), Lighthouse
- **Testy Bezpieczeństwa:** OWASP ZAP (skaner), przeglądarkowe narzędzia deweloperskie
- **Zarządzanie Testami:** (Opcjonalnie) TestRail, Xray for Jira, lub arkusze kalkulacyjne (np. Google Sheets)
- **Śledzenie Błędów:** GitHub Issues / Jira / Trello
- **CI/CD:** GitHub Actions (do automatycznego uruchamiania testów jednostkowych, integracyjnych i E2E)

## 7. Harmonogram Testów

Testowanie będzie procesem ciągłym, zintegrowanym z cyklem rozwoju oprogramowania (prawdopodobnie iteracyjnym/agile).

- **Testy Jednostkowe/Integracyjne:** Przeprowadzane przez deweloperów podczas kodowania oraz automatycznie w pipeline CI/CD przy każdym push/merge request.
- **Testy Systemowe/E2E:** Przeprowadzane regularnie (np. codziennie w nocy) na środowisku Staging w ramach CI/CD oraz manualnie przed większymi wydaniami.
- **Testy Użyteczności/Eksploracyjne:** Przeprowadzane manualnie przez zespół QA w trakcie sprintów/iteracji.
- **Testy Wydajnościowe/Bezpieczeństwa:** Przeprowadzane przed kluczowymi wydaniami (np. wydaniem MVP, większymi aktualizacjami).
- **Testy Regresji:** Przeprowadzane przed każdym wydaniem na środowisko produkcyjne, obejmujące zarówno testy automatyczne, jak i manualne weryfikacje krytycznych ścieżek.
- **User Acceptance Testing (UAT):** (Opcjonalnie) Przeprowadzane przez Product Ownera lub wyznaczonych użytkowników na środowisku Staging przed wydaniem produkcyjnym.

Konkretne ramy czasowe będą zależeć od harmonogramu rozwoju projektu.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów)

- Kod źródłowy został wdrożony na odpowiednie środowisko testowe (Staging).
- Podstawowe testy dymne (smoke tests) zakończyły się powodzeniem.
- Dostępna jest dokumentacja funkcjonalności (np. PRD, opisy zadań).
- Środowisko testowe jest stabilne i skonfigurowane.

### 8.2. Kryteria Wyjścia (Zakończenia Testów / Akceptacji Wydania)

- Wszystkie zaplanowane testy (zgodnie z priorytetami) zostały wykonane.
- Osiągnięto zdefiniowany poziom pokrycia testami (np. >80% dla kluczowych modułów w testach jednostkowych/integracyjnych).
- Wszystkie krytyczne (Critical) i blokujące (Blocker) błędy zostały naprawione i zweryfikowane.
- Liczba błędów o wysokim priorytecie (High) jest na akceptowalnym poziomie (do decyzji zespołu/PO).
- Wszystkie wyniki testów zostały udokumentowane i przeanalizowane.
- Product Owner zaakceptował działanie funkcjonalności (po UAT, jeśli dotyczy).

## 9. Role i Odpowiedzialności w Procesie Testowania

- **Inżynier QA:**
  - Projektowanie i utrzymanie planu testów.
  - Tworzenie i utrzymanie scenariuszy i przypadków testowych (manualnych i automatycznych E2E).
  - Wykonywanie testów manualnych (funkcjonalnych, eksploracyjnych, użyteczności).
  - Konfiguracja i utrzymanie środowisk testowych (we współpracy z Dev/Ops).
  - Raportowanie i śledzenie błędów.
  - Weryfikacja poprawek błędów.
  - Raportowanie statusu testów i jakości.
  - Współpraca przy definiowaniu kryteriów akceptacji.
- **Deweloperzy:**
  - Tworzenie i utrzymanie testów jednostkowych i integracyjnych.
  - Naprawianie zgłoszonych błędów.
  - Wsparcie w diagnozowaniu problemów.
  - Uczestnictwo w przeglądach kodu pod kątem jakości i testowalności.
  - Utrzymanie środowiska deweloperskiego zgodnego z wymaganiami testowymi.
- **Product Owner (PO):**
  - Dostarczanie wymagań i kryteriów akceptacji.
  - Priorytetyzacja funkcjonalności i błędów.
  - Uczestnictwo w testach akceptacyjnych (UAT).
  - Podejmowanie decyzji o wydaniu produktu.

## 10. Procedury Raportowania Błędów

- **Narzędzie:** Dedykowany system śledzenia błędów (np. GitHub Issues, Jira, Trello).
- **Zgłaszanie Błędu:** Każdy znaleziony błąd powinien zostać zgłoszony jako oddzielny ticket/issue i zawierać następujące informacje:
  - **Tytuł:** Zwięzły i jednoznaczny opis problemu.
  - **Opis:** Szczegółowy opis problemu.
  - **Kroki do Reprodukcji:** Numerowana lista kroków pozwalająca na jednoznaczne odtworzenie błędu.
  - **Oczekiwany Rezultat:** Opis, jak system powinien się zachować.
  - **Rzeczywisty Rezultat:** Opis, jak system faktycznie się zachował.
  - **Środowisko:** Wersja aplikacji, przeglądarka, system operacyjny, środowisko (np. Staging, Local).
  - **Priorytet/Ważność (Severity):** (np. Blocker, Critical, High, Medium, Low) - wstępnie określony przez zgłaszającego.
  - **Zrzuty ekranu/Nagrania wideo:** Jeśli to możliwe, aby ułatwić zrozumienie problemu.
  - **Logi:** Fragmenty logów z konsoli przeglądarki lub serwera, jeśli są istotne.
- **Cykl Życia Błędu:**
  1.  **Nowy (New/Open):** Błąd został zgłoszony.
  2.  **Potwierdzony (Confirmed/Assigned):** Błąd został przeanalizowany, potwierdzony i przypisany do dewelopera.
  3.  **W Trakcie (In Progress):** Deweloper pracuje nad poprawką.
  4.  **Rozwiązany (Resolved/Fixed):** Deweloper zaimplementował poprawkę.
  5.  **Do Weryfikacji (Ready for QA/Testing):** Poprawka została wdrożona na środowisko testowe.
  6.  **Zweryfikowany (Verified):** QA potwierdziło, że błąd został naprawiony.
  7.  **Zamknięty (Closed):** Błąd został naprawiony i weryfikacja zakończyła się powodzeniem.
  8.  **Odrzucony (Rejected):** Zgłoszenie nie jest błędem lub jest duplikatem.
  9.  **Ponownie Otwarty (Reopened):** Weryfikacja wykazała, że błąd nadal występuje lub poprawka wprowadziła regresję.
- **Priorytetyzacja:** Priorytety błędów są ustalane we współpracy z Product Ownerem i zespołem deweloperskim.
