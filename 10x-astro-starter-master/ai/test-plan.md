# Plan testów dla projektu 10x-cards

## 1. Wprowadzenie i cele testowania
- Zapewnienie wysokiej jakości dostarczanego oprogramowania poprzez systematyczne i kompleksowe testowanie.
- Weryfikacja poprawności działania kluczowych funkcjonalności, interakcji między komponentami oraz integracji z usługami zewnętrznymi.
- Identyfikacja potencjalnych błędów, luk bezpieczeństwa oraz problemów wydajnościowych na wczesnym etapie rozwoju.

## 2. Zakres testów
- **Frontend:** Testowanie komponentów budowanych przy użyciu Astro, React oraz TypeScript. Weryfikacja interfejsu użytkownika, responsywności oraz poprawności integracji z Shadcn/ui i Tailwind.
- **Backend:** Walidacja komunikacji z bazą danych i autoryzacji przy użyciu Supabase. Testowanie API pod kątem poprawności obsługi żądań i odpowiedzi.
- **Integracja AI:** Sprawdzenie stabilności i poprawności komunikacji z usługami AI (Ollama, OpenAI API, Openrouter.ai). Weryfikacja przekazywanych danych oraz autoryzacji.
- **CI/CD & Hosting:** Weryfikacja automatyzacji wdrożeń, konfiguracji Docker oraz GitHub Actions, symulacja scenariuszy skalowalności.

## 3. Typy testów do przeprowadzenia
- **Testy jednostkowe:** Dla indywidualnych komponentów frontendowych oraz funkcji backendowych.
- **Testy integracyjne:** Sprawdzające współdziałanie komponentów aplikacji, m.in. interakcje między frontendem a backendem oraz integrację z usługami AI.
- **Testy systemowe/end-to-end:** Weryfikacja kompletnego przepływu użytkownika w aplikacji, od wejścia na stronę, przez logowanie, aż po wykonanie kluczowych operacji.
- **Testy wydajnościowe:** Ocena szybkości ładowania stron, responsywności interfejsu oraz obciążenia backendu przy zwiększonej liczbie jednoczesnych użytkowników.
- **Testy bezpieczeństwa:** Walidacja autoryzacji, kontroli dostępu, ochrony API keys oraz zabezpieczeń przed typowymi atakami.
- **Testy regresji:** Upewnienie się, że wdrożone zmiany nie wpływają negatywnie na istniejącą funkcjonalność.

## 4. Scenariusze testowe dla kluczowych funkcjonalności
- **Interfejs użytkownika:**
  - Weryfikacja poprawnego renderowania komponentów oraz dynamicznych elementów UI.
  - Testowanie responsywności na różnych urządzeniach i rozdzielczościach.
  - Symulacja interakcji użytkownika (np. kliknięcia, formularze, nawigacja).
  
- **Komunikacja z backendem:**
  - Testy poprawności połączenia z bazą danych (Supabase) oraz weryfikacja logiki autoryzacji.
  - Weryfikacja statusów HTTP dla różnych scenariuszy (sukces, błędy, brak autoryzacji).
  - Testy integracji między komponentami aplikacji a warstwą API.

- **Integracja z usługami AI:**
  - Weryfikacja poprawności wywołań API do usług Ollama, OpenAI API oraz Openrouter.ai.
  - Testowanie backupowych rozwiązań przy awarii jednej z usług.
  - Sprawdzenie bezpieczeństwa przesyłanych danych oraz autoryzacji przy użyciu kluczy API.
  - Systematyczne testowanie promptów i odpowiedzi modeli.

- **Proces CI/CD i wdrożenia:**
  - Testowanie automatycznej integracji i wdrożeń przy użyciu GitHub Actions i Docker.
  - Symulacja scenariuszy rollback oraz wdrażania poprawek krytycznych.

## 5. Środowisko testowe
- **Lokalne środowisko:** Konfiguracja z wykorzystaniem Docker i Testcontainers dla izolowanych środowisk testowych.
- **Środowisko staging:** Odtworzenie produkcyjnego środowiska w celu przeprowadzenia testów integracyjnych i end-to-end.
- **Testowe bazy danych:** Wydzielone środowisko bazodanowe dla testów, z automatycznym przywracaniem stanu początkowego.
- **Spójne środowisko developerskie:** Użycie GitHub Codespaces lub Gitpod dla zapewnienia jednolitego środowiska testowego dla całego zespołu.

## 6. Narzędzia do testowania
- **Frontend:** 
  - Vitest zamiast Jest (szybszy i lepiej integruje się z Astro)
  - Testing Library do testowania komponentów React
  - Playwright i Cypress do testów e2e i równoległego testowania na wielu przeglądarkach
  
- **Backend:** 
  - Insomnia lub Hoppscotch zamiast Postman (lepsza integracja z CI/CD)
  - SuperTest do testowania API
  - Supavisor do monitorowania wydajności Supabase
  
- **Testy wydajnościowe:** 
  - WebPageTest API i Core Web Vitals Library zamiast samego Lighthouse
  - Locust obok k6 do bardziej złożonych scenariuszy testowych (w Pythonie)
  
- **Testy integracji AI:**
  - Langchain Test Suite do testowania interfejsów z modelami AI
  - Promptfoo do systematycznego testowania promptów w OpenAI API
  
- **Testy bezpieczeństwa:** 
  - OWASP ZAP Automation Framework
  - Snyk do testowania zależności
  - TruffleHog do wykrywania wycieków poświadczeń
  
- **CI/CD i monitoring:** 
  - GitHub Actions
  - Datadog lub Grafana + Prometheus do monitorowania aplikacji
  - Allure Framework do generowania raportów z testów

## 7. Harmonogram testów
- **Faza I – Przygotowanie:**
  - Konfiguracja środowisk testowych i instalacja narzędzi.
  - Opracowanie pierwszych scenariuszy testowych.
  - Czas trwania: 1–2 tygodnie.
  
- **Faza II – Testy jednostkowe i integracyjne:**
  - Implementacja oraz uruchomienie testów jednostkowych i integracyjnych.
  - Wstępna walidacja krytycznych funkcji.
  - Czas trwania: 2–3 tygodnie.
  
- **Faza III – Testy systemowe/end-to-end oraz wydajnościowe:**
  - Przeprowadzenie pełnych testów przepływu użytkownika oraz testów obciążeniowych.
  - Czas trwania: 2 tygodnie.
  
- **Faza IV – Testy regresyjne i bezpieczeństwa:**
  - Regularne uruchamianie testów regresyjnych przy każdej iteracji.
  - Przeprowadzenie analizy bezpieczeństwa.
  - Czas trwania: ciągły, z głównymi punktami kontrolnymi co 2–3 tygodnie.

## 8. Kryteria akceptacji testów
- Pokrycie testami krytycznych ścieżek funkcjonalnych (zalecane minimum 80% pokrycia kodu testami).
- Brak krytycznych błędów uniemożliwiających działanie aplikacji.
- Pozytywna weryfikacja wydajności przy zakładanym obciążeniu.
- Wszystkie kluczowe metryki Core Web Vitals muszą spełniać standardy Google.
- Potwierdzenie zgodności standardów bezpieczeństwa i autoryzacji.
- Zatwierdzenie wyników testów przez zespół QA oraz liderów projektu.

## 9. Role i odpowiedzialności
- **Inżynier QA:** Odpowiedzialny za tworzenie, utrzymywanie oraz wykonywanie testów jednostkowych i integracyjnych.
- **Specjalista ds. automatyzacji testów:** Implementacja i zarządzanie testami end-to-end oraz regresyjnymi.
- **Testerzy ręczni:** Przeprowadzanie testów interfejsu użytkownika, testów użyteczności oraz scenariuszy krytycznych.
- **Specjalista ds. bezpieczeństwa:** Prowadzenie analiz bezpieczeństwa i testów penetracyjnych.
- **Inżynier ds. wydajności:** Monitoring i optymalizacja wydajności aplikacji.
- **Specjalista ds. AI:** Testowanie integracji AI i jakości wyników modeli.
- **Menadżer QA:** Koordynacja prac testowych, weryfikacja wyników oraz akceptacja krytycznych aspektów wdrożeń.
- **Deweloperzy:** Współpraca przy identyfikacji i naprawie błędów, wsparcie przy integracji testów w procesie CI/CD.

## 10. Procedury raportowania błędów
- **Narzędzie do zgłaszania błędów:** Wykorzystanie systemu GitHub Issues z integracją do Allure dla lepszej wizualizacji.
- **Format raportu błędu:**
  - Tytuł: Krótkie streszczenie problemu.
  - Opis: Szczegółowy opis błędu, kroków niezbędnych do jego reprodukcji, oczekiwanego zachowania oraz obserwowanego wyniku.
  - Priorytet: Określenie poziomu krytyczności (Krytyczny, Wysoki, Średni, Niski).
  - Załączniki: Screencasty, logi, zrzuty ekranu, dane telemetryczne.
- **Proces eskalacji:** Błędy krytyczne są natychmiast eskalowane do zespołu deweloperskiego z wymaganą natychmiastową reakcją.
- **Śledzenie i monitorowanie:** Regularne przeglądy zgłoszonych błędów, aktualizacja statusów oraz weryfikacja wykonanych poprawek z użyciem dashboardów Allure.

## 11. Monitorowanie i analiza wyników
- Ciągłe monitorowanie aplikacji w środowisku produkcyjnym przy użyciu Datadog lub Grafana + Prometheus.
- Automatyczne powiadomienia o anomaliach i przekroczeniu progów wydajnościowych.
- Regularne raporty z analizą trendów w wydajności i stabilności aplikacji.
- Analiza doświadczeń użytkowników w oparciu o dane telemetryczne z Core Web Vitals.

---