# Dokument wymagań produktu (PRD) – 10x-cards

## 1. Przegląd produktu
Projekt 10x-cards to aplikacja webowa umożliwiająca tworzenie, zarządzanie oraz przeglądanie fiszek edukacyjnych. Aplikacja wykorzystuje modele LLM (poprzez API) do generowania sugestii fiszek na podstawie wprowadzonego tekstu oraz integruje się z gotowym algorytmem powtórek, co pozwala na efektywne zastosowanie metody spaced repetition. Dzięki połączeniu funkcjonalności automatycznego generowania oraz ręcznego tworzenia fiszek, użytkownicy mogą szybko pozyskiwać wysokiej jakości materiały do nauki.

## 2. Problem użytkownika
Manualne tworzenie wysokiej jakości fiszek wymaga dużych nakładów czasu i wysiłku, co zniechęca użytkowników do korystania z efektywnej metody spaced repetition. Dodatkowo, trudności w zarządzaniu i organizacji materiału do nauki utrudniają regularne powtórki i efektywne przyswajanie wiedzy.

## 3. Wymagania funkcjonalne

1. Automatyczne generowanie fiszek:
   - Użytkownik wkleja tekst (np. fragment podręcznika) o długości od 1000 do 10 000 znaków.
   - Aplikacja wysyła tekst do modelu LLM poprzez API.
   - Model LLM generuje zestaw propozycji fiszek (pytania i odpowiedzi).
   - Propozycje fiszek są prezentowane użytkownikowi w formie listy, z możliwością zatwierdzenia, edycji lub odrzucenia.

2. Ręczne tworzenie i zarządzanie fiszkami:
   - Formularz umożliwia ręczne tworzenie fiszek z polami "przód" (maks. 200 znaków) i "tył" (maks. 500 znaków).
   - Użytkownik może przeglądać, edytować oraz usuwać fiszki w widoku "Moje fiszki".

3. System uwierzytelniania i zarządzania kontem:
   - Rejestracja i logowanie użytkowników umożliwia dostęp do spersonalizowanych zestawów fiszek.
   - Możliwość edycji hasła oraz usunięcia konta, co obejmuje także usunięcie powiązanych fiszek.
   - Dane są szyfrowane i przechowywane według najlepszych praktyk bezpieczeństwa.

4. Integracja z algorytmem powtórek:
   - Fiszki są przypisywane do harmonogramu powtórek według Systemu Leitnera, popularnej metody spaced repetition.
   - System Leitnera kategoryzuje fiszki do 3 poziomów (pudełek) w zależności od znajomości materiału:
     - Poziom 1: Fiszki nowe lub często niepoprawnie odpowiadane (powtarzane codziennie)
     - Poziom 2: Fiszki z podstawową znajomością (powtarzane co 3 dni)
     - Poziom 3: Fiszki dobrze opanowane (powtarzane co 7 dni)
   - Po poprawnej odpowiedzi, fiszka przechodzi poziom wyżej, po niepoprawnej - wraca do poziomu 1.
   - Integracja umożliwia efektywne stosowanie metody spaced repetition.

5. Przechowywanie i skalowalność:
   - Dane o fiszkach i kontach użytkowników przechowywane są w sposób zapewniający skalowalność oraz bezpieczeństwo.

6. Statystyki i logowanie:
   - System zbiera statystyki dotyczące generowania fiszek, w tym liczbę wygenerowanych propozycji oraz ich akceptację przez użytkowników.
   - Logi operacji generowania przez AI są zapisywane w dedykowanej tabeli.
   - Błędy systemowe są zapisywane w dedykowanej tabeli, dostępnej tylko dla administratorów.

7. Wymagania prawne i ograniczenia:
   - Dane osobowe oraz informacje o fiszkach są przechowywane zgodnie z RODO.
   - Użytkownicy mają prawo do wglądu i usunięcia swoich danych na żądanie.

## 4. Granice produktu

Poza zakresem MVP:
- Własny, zaawansowany algorytm powtórek (wykorzystujemy gotowe rozwiązanie open-source).
- Import wielu formatów dokumentów (np. PDF, DOCX) – aplikacja obsługuje jedynie tekst wklejany ręcznie.
- Współdzielenie fiszek między użytkownikami – każda fiszka przypisana jest do indywidualnego konta.
- Aplikacje mobilne – początkowo dostępna jest jedynie wersja web.
- Publicznie dostępne API, mechanizmy gamifikacji oraz zaawansowane funkcje powiadomień.
- Rozbudowane wyszukiwanie fiszek po słowach kluczowych – obecnie wdrożone jest standardowe pełnotekstowe wyszukiwanie z paginacją.
- Weryfikacja adresów email – w MVP użytkownik może podać dowolny adres email przy rejestracji.
- Zaawansowane mechanizmy rate limitingu – w MVP mogą zostać pominięte.

## 5. Historyjki użytkowników

ID: US-001  
Tytuł: Rejestracja konta  
Opis: Jako nowy użytkownik chcę się zarejestrować, aby mieć dostęp do własnych fiszek i móc korzystać z funkcji generowania fiszek przez AI.  
Kryteria akceptacji:
- Formularz rejestracyjny zawiera pola na adres e-mail i hasło.
- Po poprawnym wypełnieniu formularza konto jest aktywowane oraz użytkownik jest automatycznie zalogowany.
- Użytkownik otrzymuje potwierdzenie rejestracji.

ID: US-002  
Tytuł: Logowanie do aplikacji  
Opis: Jako zarejestrowany użytkownik chcę móc się zalogować, aby mieć dostęp do swoich fiszek oraz historii generowania.  
Kryteria akceptacji:
- Po wprowadzeniu prawidłowych danych logowania użytkownik zostaje przekierowany do głównego widoku aplikacji.
- Błędne dane powodują wyświetlenie komunikatu o błędzie.
- Dane logowania są przechowywane w sposób bezpieczny.

ID: US-003  
Tytuł: Generowanie fiszek przy użyciu AI  
Opis: Jako zalogowany użytkownik chcę wkleić fragment tekstu i wygenerować propozycje fiszek, aby zaoszczędzić czas na ręcznym przygotowywaniu pytań i odpowiedzi.  
Kryteria akceptacji:
- W widoku generowania fiszek znajduje się pole tekstowe umożliwiające wklejenie tekstu o długości od 1000 do 10 000 znaków.
- Po kliknięciu przycisku generowania aplikacja komunikuje się z API modelu LLM i wyświetla listę proponowanych fiszek.
- W przypadku problemów z API użytkownik otrzymuje odpowiedni komunikat o błędzie.

ID: US-004  
Tytuł: Przegląd i zatwierdzanie propozycji fiszek  
Opis: Jako zalogowany użytkownik chcę przeglądać wygenerowane fiszki i wybierać te, które chcę dodać do mojego zestawu, aby zachować tylko przydatne informacje.  
Kryteria akceptacji:
- Lista propozycji fiszek jest wyświetlana pod formularzem generowania.
- Każda fiszka posiada opcje zatwierdzenia, edycji lub odrzucenia.
- Po zatwierdzeniu wybranych fiszek użytkownik ma możliwość zapisu ich w bazie danych.

ID: US-005  
Tytuł: Edycja fiszek utworzonych ręcznie i generowanych przez AI  
Opis: Jako zalogowany użytkownik chcę edytować swoje fiszki, aby wprowadzić poprawki lub dostosować treść do własnych potrzeb.  
Kryteria akceptacji:
- Użytkownik może wejść w tryb edycji przy kliknięciu wybranej fiszki.
- Po dokonaniu zmian i ich zatwierdzeniu, dane są zapisywane w bazie.

ID: US-006  
Tytuł: Usuwanie fiszek  
Opis: Jako zalogowany użytkownik chcę usuwać zbędne fiszki, aby utrzymać porządek w moim zestawie.  
Kryteria akceptacji:
- Każda fiszka w widoku "Moje fiszki" posiada opcję usunięcia.
- Użytkownik musi potwierdzić chęć usunięcia.
- Po potwierdzeniu fiszka jest trwale usuwana z bazy danych.

ID: US-007  
Tytuł: Ręczne tworzenie fiszek  
Opis: Jako zalogowany użytkownik chcę ręcznie tworzyć fiszki, aby dodawać własne materiały, które nie pochodzą z automatycznego generowania.  
Kryteria akceptacji:
- W widoku "Moje fiszki" znajduje się przycisk dodania nowej fiszki.
- Kliknięcie przycisku otwiera formularz z polami "Przód" i "Tył".
- Po zapisaniu nowa fiszka pojawia się na liście.

ID: US-008  
Tytuł: Sesja nauki z algorytmem powtórek  
Opis: Jako zalogowany użytkownik chcę korzystać z sesji nauki, w której fiszki są przypisywane do harmonogramu powtórek, aby efektywnie przyswajać wiedzę metodą spaced repetition.  
Kryteria akceptacji:
- W widoku "Sesja nauki" aplikacja prezentuje kolejno fiszki.
- Użytkownik może odsłonić tył fiszki po interakcji.
- Algorytm na podstawie oceny zrozumienia fiszki decyduje o kolejnych powtórkach.

ID: US-009  
Tytuł: Bezpieczny dostęp i autoryzacja  
Opis: Jako użytkownik chcę mieć możliwość rejestracji i logowania się do systemu w sposób zapewniający bezpieczeństwo moich danych. Jako zalogowany użytkownik chcę mieć pewność, że moje fiszki są chronione przed nieautoryzowanym dostępem, aby zapewnić prywatność i bezpieczeństwo danych.  
Kryteria akceptacji:
- Logowanie i rejestracja odbywają się na dedykowanych stronach.
- Logowanie wymaga podania adresu email i hasła.
- Rejestracja wymaga podania adresu email, hasła i potwierdzenia hasła.
- Tylko zalogowany użytkownik ma dostęp do swoich fiszek.
- Niezalogowani użytkownicy nie mogą przeglądać ani modyfikować danych innych użytkowników.
- NIezalogowani użytkownicy widzą jedynie zacęcającą stronę do założenia konta, nie mogą kożystać z żadnych funkcji aplikacji.
- Użytkownik NIE MOŻE korzystać z funkcji Fiszek bez logowania się do systemu
- Mechanizmy uwierzytelniania i autoryzacji zapewniają bezpieczeństwo danych.
- Użytkownik może logować się do systemu poprzez przycisk w prawym górnym rogu.
- Użytkownik może się wylogować z systemu poprzez przycisk w prawym górnym rogu w głównym @Layout.astro.
- Nie korzystamy z zewnętrznych serwisów logowania (np. Google, GitHub).
- Odzyskiwanie hasła powinno być możliwe.

## 6. Metryki sukcesu
1. Efektywność generowania fiszek:
   - 75% wygenerowanych przez AI fiszek jest akceptowanych przez użytkownika.
   - Co najmniej 75% nowo dodanych fiszek pochodzi z funkcji generowania przez AI.
2. Zaangażowanie i jakość:
   - Analiza stosunku liczby wygenerowanych fiszek do liczby zatwierdzonych propozycji ocenia użyteczność systemu.
   - Monitorowanie opinii użytkowników i zgłaszanych błędów pozwala na ciągłe doskonalenie funkcjonalności aplikacji.

## AI do generowania fiszek

### Modele AI w MVP
W wersji MVP aplikacja będzie korzystać z lokalnego serwera Ollama działającego pod adresem http://192.168.0.11:11434 z następującymi dostępnymi modelami:
- gemma3:27b - duży model o wysokiej jakości generacji
- llama3.2:3b - mniejszy model (domyślny) zapewniający szybsze działanie
- deepseek-r1:32b - zaawansowany model z rozszerzonym kontekstem
- llama3.3:latest - najnowsza wersja modelu llama

Domyślnie system będzie używał modelu llama3.2:3b ze względu na jego mniejszy rozmiar i szybsze działanie.

W przyszłych wersjach możliwe będzie rozszerzenie o bardziej zaawansowane modele komercyjne jak GPT-4 lub Claude 3.

## Uwagi dotyczące MVP

### Ograniczenia i uproszczenia
1. **Weryfikacja adresów email** - w MVP użytkownicy mogą podać dowolny adres email podczas rejestracji bez konieczności jego weryfikacji. System nie będzie wysyłał maili potwierdzających.
2. **Ograniczenia bezpieczeństwa** - szczegółowe mechanizmy JWT (w tym refresh token) i rate limiting zostaną doprecyzowane w późniejszych etapach, w MVP mogą zostać pominięte.
3. **Logowanie błędów** - aplikacja będzie logować błędy w dedykowanej tabeli w bazie danych, dostępnej tylko dla administratorów.
4. **System Leitnera** - w MVP używamy uproszczonego wariantu z 3 pudełkami zamiast 5, które są standardem w pełnej wersji systemu Leitnera.
