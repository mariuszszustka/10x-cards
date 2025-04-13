# API Endpoint Implementation Plan: Autentykacja użytkownika

## 1. Przegląd punktów końcowych
Endpointy autentykacji umożliwiają rejestrację nowych użytkowników oraz logowanie istniejących użytkowników do systemu.

### Endpoint rejestracji użytkownika
- Umożliwia utworzenie nowego konta użytkownika
- Zapisuje dane użytkownika w bazie danych
- Zwraca podstawowe informacje o nowo utworzonym użytkowniku

### Endpoint logowania użytkownika 
- Weryfikuje dane uwierzytelniające użytkownika
- Generuje token JWT dla autoryzacji
- Zwraca token oraz podstawowe informacje o użytkowniku

## 2. Szczegóły żądania

### Rejestracja użytkownika
- Metoda HTTP: POST
- Ścieżka URL: /api/auth/register
- Parametry: brak
- Nagłówki: Content-Type: application/json
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Logowanie użytkownika
- Metoda HTTP: POST
- Ścieżka URL: /api/auth/login
- Parametry: brak
- Nagłówki: Content-Type: application/json
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## 3. Wykorzystywane typy
- `RegisterUserDTO` - dane potrzebne do rejestracji użytkownika
- `RegisterUserResponseDTO` - dane zwracane po rejestracji
- `LoginDTO` - dane uwierzytelniające do logowania
- `LoginResponseDTO` - dane zwracane po logowaniu (token JWT oraz dane użytkownika)

## 4. Szczegóły odpowiedzi

### Rejestracja użytkownika
- Sukces (201 Created):
  ```json
  {
    "id": "uuid",
    "email": "string",
    "created_at": "timestamp"
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe dane wejściowe
  - 409 Conflict - email już istnieje w systemie

### Logowanie użytkownika
- Sukces (200 OK):
  ```json
  {
    "token": "string",
    "user": {
      "id": "uuid",
      "email": "string"
    }
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe dane uwierzytelniające
  - 401 Unauthorized - użytkownik nieautoryzowany

## 5. Przepływ danych

### Rejestracja użytkownika
1. Walidacja danych wejściowych (format email, siła hasła)
2. Sprawdzenie czy email jest unikalny w bazie danych
3. Haszowanie hasła
4. Utworzenie rekordu użytkownika w tabeli `users`
5. Zwrócenie danych o nowo utworzonym użytkowniku

### Logowanie użytkownika
1. Walidacja danych wejściowych
2. Pobranie użytkownika z bazy danych na podstawie email
3. Weryfikacja hasła
4. Generowanie tokenu JWT
5. Zwrócenie tokenu i podstawowych danych użytkownika

## 6. Względy bezpieczeństwa

### Rejestracja użytkownika
- Hasła muszą spełniać minimalne wymagania bezpieczeństwa (np. min. 8 znaków, zawierać litery i cyfry)
- Hasła muszą być haszowane (np. bcrypt) przed zapisaniem w bazie danych
- Email musi być walidowany pod kątem poprawnego formatu
- Należy zastosować ograniczenie liczby prób rejestracji z jednego IP (rate limiting)

### Logowanie użytkownika
- Stosowanie opóźnienia przy błędnym logowaniu w celu zapobiegania atakom brute force
- Limity prób logowania (np. 5 prób na minutę na adres IP)
- Bezpieczne generowanie i przechowywanie tokenów JWT
- Ustawienie odpowiedniego czasu wygaśnięcia tokenu JWT (np. 24h)

## 7. Obsługa błędów

### Rejestracja użytkownika
- Niepoprawny format email - 400 Bad Request z odpowiednim komunikatem
- Hasło nie spełnia wymagań bezpieczeństwa - 400 Bad Request z odpowiednim komunikatem
- Email już istnieje w bazie - 409 Conflict z odpowiednim komunikatem
- Błąd bazy danych - 500 Internal Server Error z logowaniem błędu

### Logowanie użytkownika
- Brak użytkownika o podanym email - 400 Bad Request (nie ujawniać, że użytkownik nie istnieje)
- Niepoprawne hasło - 400 Bad Request z ogólnym komunikatem o błędnych danych (nie ujawniać, która część jest błędna)
- Przekroczony limit prób logowania - 429 Too Many Requests
- Błąd bazy danych - 500 Internal Server Error z logowaniem błędu

## 8. Rozważania dotyczące wydajności
- Indeksowanie kolumny `email` w tabeli `users` dla szybszego wyszukiwania
- Cachowanie często używanych danych użytkownika
- Asynchroniczna obsługa żądań dla lepszej skalowalności
- Optymalizacja zapytań do bazy danych

## 9. Etapy wdrożenia

### Rejestracja użytkownika
1. Implementacja walidacji danych wejściowych (RegisterUserDTO)
2. Implementacja metody w serwisie do sprawdzania unikalności email
3. Implementacja serwisu do haszowania hasła
4. Implementacja repozytorium do zapisu użytkownika w bazie danych
5. Implementacja kontrolera obsługującego żądanie rejestracji
6. Implementacja obsługi błędów i odpowiednich kodów statusu
7. Testy jednostkowe serwisu i kontrolera
8. Testy integracyjne całego endpointu
9. Dokumentacja API

### Logowanie użytkownika
1. Implementacja walidacji danych wejściowych (LoginDTO)
2. Implementacja serwisu do weryfikacji hasła
3. Implementacja serwisu do generowania tokenów JWT
4. Implementacja kontrolera obsługującego żądanie logowania
5. Implementacja mechanizmu rate limiting
6. Implementacja obsługi błędów i odpowiednich kodów statusu
7. Testy jednostkowe serwisu i kontrolera
8. Testy integracyjne całego endpointu
9. Dokumentacja API