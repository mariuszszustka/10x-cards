# API Endpoint Implementation Plan: Register User

## 1. Przegląd punktu końcowego
Endpoint służy do rejestracji nowego użytkownika. Jego głównym zadaniem jest przyjęcie danych (email oraz hasło), walidacja danych wejściowych, zaszyfrowanie hasła oraz zapisanie nowego rekordu w tabeli users. W przypadku pomyślnej rejestracji, zwracany jest unikalny identyfikator użytkownika, adres email oraz data utworzenia konta.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: /api/auth/register
- Parametry:
  Wymagane:
  - email (string) – adres email użytkownika; musi być poprawnie sformatowany
  - password (string) – hasło; musi spełniać minimalne wymagania bezpieczeństwa (np. minimalna długość, złożoność)
  Opcjonalne: Brak
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## 3. Wykorzystywane typy
- RegisterUserDTO: Definiowany w src/types.ts i używany jako DTO wejściowe dla rejestracji.
- RegisterUserResponseDTO: DTO wykorzystywany przy tworzeniu odpowiedzi po rejestracji.
- Command Model: Można rozważyć wprowadzenie modelu polecenia (np. RegisterUserCommand) w celu oddzielenia logiki walidacji i przetwarzania danych od warstwy kontrolera.

## 4. Szczegóły odpowiedzi
Response Body (przy sukcesie):
```json
{
  "id": "uuid",
  "email": "string",
  "created_at": "timestamp"
}
```
Kody statusu:
- 201 Created – pomyślna rejestracja użytkownika
- 400 Bad Request – nieprawidłowe dane wejściowe (np. niepoprawny format email, hasło niespełniające wymagań)
- 409 Conflict – email już istnieje
- 500 Internal Server Error – błąd po stronie serwera

## 5. Przepływ danych
1. Klient wysyła żądanie POST do /api/auth/register z danymi email i password.
2. Warstwa kontrolera odbiera żądanie i przekazuje dane do warstwy serwisowej.
3. W warstwie serwisowej wykonywana jest walidacja danych wejściowych (sprawdzenie formatu email oraz zabezpieczenia hasła).
4. Hasło jest szyfrowane przy użyciu sprawdzonej biblioteki (np. bcrypt).
5. Wykonywana jest operacja zapisu rekordu w tabeli users, przy czym wcześniej sprawdzany jest unikalny adres email.
6. W przypadku konfliktu (email już istnieje) zwracany jest status 409 Conflict.
7. Po pomyślnym zapisaniu, serwis zwraca dane użytkownika (UUID, email, data utworzenia).
8. Odpowiedź jest przekazywana do klienta.

## 6. Względy bezpieczeństwa
1. Walidacja danych wejściowych:
   - Szczegółowa walidacja formatu adresu email
   - Wymagania dotyczące hasła:
     - Minimalna długość: 8 znaków
     - Wymagana co najmniej jedna wielka litera
     - Wymagana co najmniej jedna cyfra
     - Wymagany co najmniej jeden znak specjalny
2. Szyfrowanie hasła:
   - Użycie algorytmu bcrypt (lub innego sprawdzonego mechanizmu)
   - Odpowiednie parametry soli i liczby rund
3. Unikalność email:
   - Sprawdzenie przed zapisem, aby zapobiec duplikatom
   - Wykorzystanie unikalnego indeksu w bazie danych
4. Ochrona przed atakami:
   - Zapewnienie ochrony przed SQL Injection
   - Sanityzacja danych wejściowych
   - Implementacja rate limitingu
   - Zabezpieczenie przed atakami brute force
5. Bezpieczne nagłówki HTTP:
   - Content-Security-Policy
   - X-Frame-Options
   - X-XSS-Protection

## 7. Obsługa błędów
1. 400 Bad Request:
   - Niepoprawny format adresu email
   - Hasło nie spełnia wymagań bezpieczeństwa
   - Brakujące wymagane pola
2. 409 Conflict:
   - Adres email już istnieje w systemie
3. 500 Internal Server Error:
   - Błąd podczas szyfrowania hasła
   - Problemy z bazą danych
   - Nieoczekiwane błędy serwera
4. Logowanie błędów:
   - Wszystkie błędy powinny być logowane zgodnie z wytycznymi z @shared.mdc
   - Szczegółowe informacje o błędach tylko w logach, nie w odpowiedzi API

## 8. Rozważania dotyczące wydajności
1. Indeksy w bazie danych:
   - Upewnij się, że kolumna email w tabeli users posiada indeks unikalności
   - Monitorowanie wydajności indeksów
2. Asynchroniczność:
   - Asynchroniczne szyfrowanie hasła
   - Asynchroniczne operacje bazodanowe
3. Optymalizacja zapytań:
   - Minimalizacja liczby zapytań do bazy
   - Efektywne wykorzystanie połączeń z bazą danych
4. Cache:
   - Rozważ cache dla często używanych zapytań
   - Implementacja mechanizmu invalidacji cache

## 9. Etapy wdrożenia
1. Analiza i projekt:
   - Przeanalizowanie wymagań specyfikacji API
   - Identyfikacja wszystkich niezbędnych typów DTO
   - Zdefiniowanie modelu polecenia (RegisterUserCommand)
   - Struktura serwisu

2. Implementacja kontrolera:
   - Utworzenie endpointu /api/auth/register
   - Mapowanie danych wejściowych do RegisterUserDTO
   - Integracja z warstwą serwisową

3. Walidacja danych:
   - Implementacja walidacji formatu email
   - Implementacja walidacji wymagań hasła
   - Weryfikacja unikalności email

4. Szyfrowanie hasła:
   - Integracja biblioteki do szyfrowania (bcrypt)
   - Implementacja szyfrowania hasła
   - Konfiguracja parametrów bezpieczeństwa

5. Operacje bazodanowe:
   - Implementacja zapisu do tabeli users
   - Obsługa unikalności email
   - Implementacja transakcji

6. Obsługa odpowiedzi:
   - Implementacja mapowania do RegisterUserResponseDTO
   - Konfiguracja kodów statusu HTTP
   - Formatowanie odpowiedzi

7. Logowanie i obsługa błędów:
   - Implementacja logowania błędów
   - Obsługa różnych scenariuszy błędów
   - Konfiguracja monitoringu

8. Testy:
   - Testy jednostkowe
   - Testy integracyjne
   - Testy wydajnościowe
   - Testy bezpieczeństwa

9. Wdrożenie:
   - Wdrożenie w środowisku developerskim
   - Wdrożenie w środowisku stagingowym
   - Monitoring działania
   - Zbieranie metryk wydajności 