API Endpoint Implementation Plan: Register User
1. Przegląd punktu końcowego
Endpoint służy do rejestracji nowego użytkownika. Jego głównym zadaniem jest przyjęcie danych (email oraz hasło), walidacja danych wejściowych, zaszyfrowanie hasła oraz zapisanie nowego rekordu w tabeli users. W przypadku pomyślnej rejestracji, zwracany jest unikalny identyfikator użytkownika, adres email oraz data utworzenia konta.

2. Szczegóły żądania
Metoda HTTP: POST
Struktura URL: /api/auth/register
Parametry:
Wymagane:
email (string) – adres email użytkownika; musi być poprawnie sformatowany
password (string) – hasło; musi spełniać minimalne wymagania bezpieczeństwa (np. minimalna długość, złożoność)
Opcjonalne: Brak
Request Body:
  {
    "email": "string",
    "password": "string"
  }

3. Wykorzystywane typy
RegisterUserDTO: Definiowany w src/types.ts i używany jako DTO wejściowe dla rejestracji.
RegisterUserResponseDTO: DTO wykorzystywany przy tworzeniu odpowiedzi po rejestracji.
Command Model: Można rozważyć wprowadzenie modelu polecenia (np. RegisterUserCommand) w celu oddzielenia logiki walidacji i przetwarzania danych od warstwy kontrolera.

4. Szczegóły odpowiedzi
Response Body (przy sukcesie):
  {
    "id": "uuid",
    "email": "string",
    "created_at": "timestamp"
  }
Kody statusu:
201 Created – pomyślna rejestracja użytkownika
400 Bad Request – nieprawidłowe dane wejściowe (np. niepoprawny format email, hasło niespełniające wymagań)
409 Conflict – email już istnieje
500 Internal Server Error – błąd po stronie serwera

5. Przepływ danych
Klient wysyła żądanie POST do /api/auth/register z danymi email i password.
Warstwa kontrolera odbiera żądanie i przekazuje dane do warstwy serwisowej.
W warstwie serwisowej wykonywana jest walidacja danych wejściowych (sprawdzenie formatu email oraz zabezpieczenia hasła).
Hasło jest szyfrowane przy użyciu sprawdzonej biblioteki (np. bcrypt).
Wykonywana jest operacja zapisu rekordu w tabeli users, przy czym wcześniej sprawdzany jest unikalny adres email.
W przypadku konfliktu (email już istnieje) zwracany jest status 409 Conflict.
Po pomyślnym zapisaniu, serwis zwraca dane użytkownika (UUID, email, data utworzenia).
Odpowiedź jest przekazywana do klienta.

6. Względy bezpieczeństwa
Walidacja danych wejściowych: Szczegółowa walidacja formatu adresu email oraz wymagań dotyczących hasła.
Szyfrowanie hasła: Użycie algorytmu bcrypt (lub innego sprawdzonego mechanizmu) do zaszyfrowania hasła przed zapisem do bazy.
Unikalność email: Sprawdzenie przed zapisem, aby zapobiec duplikatom.
Ochrona przed atakami: Zapewnienie ochrony przed SQL Injection oraz wykorzystanie odpowiednich mechanizmów zabezpieczeń dostępnych w używanym frameworku.
Rate Limiting: Ograniczenie liczby prób rejestracji pochodzi ze wskazówek wdrożenia (np. zdefiniowanych reguł w @backend.mdc).

7. Obsługa błędów
400 Bad Request: W przypadku niepoprawnych danych wejściowych (błędny format email, hasło nie spełniające kryteriów).
409 Conflict: Jeśli adres email już istnieje w systemie.
500 Internal Server Error: Wszelkie nieprzewidziane błędy lub problemy w procesie rejestracji.
Logowanie błędów: Wszystkie błędy powinny być logowane (w tym szczegóły do celów debugowania), zgodnie z wytycznymi z @shared.mdc oraz @backend.mdc.

8. Rozważania dotyczące wydajności
Indeksy w bazie danych: Upewnij się, że kolumna email w tabeli users posiada indeks unikalności, co gwarantuje szybką weryfikację istniejących adresów.
Asynchroniczność: Rozważ asynchroniczne szyfrowanie hasła, aby nie blokować głównego wątku przy wyższych obciążeniach.
Optymalizacja zapytań: Monitorowanie wydajności zapytań do bazy danych i optymalizacja operacji INSERT przy dużej liczbie rejestracji.

9. Etapy wdrożenia
Analiza i projekt:
Przeanalizowanie wymagań specyfikacji API oraz identyfikacja wszystkich niezbędnych typów DTO.
Zdefiniowanie modelu polecenia (RegisterUserCommand) i struktury serwisu.
Implementacja kontrolera:
Utworzenie endpointu /api/auth/register w warstwie kontrolera.
Mapowanie danych wejściowych do RegisterUserDTO.
Walidacja danych:
Implementacja walidacji formatu email i wymagań dotyczących hasła.
Weryfikacja unikalności email przed wykonaniem operacji zapisu.
Szyfrowanie hasła:
Integracja biblioteki do szyfrowania (np. bcrypt) i implementacja szyfrowania hasła.
Operacja zapisu w bazie danych:
Wykonanie zapisu rekordu w tabeli users w obrębie transakcji.
Obsługa potencjalnych konfliktów (np. email już istnieje).
Obsługa odpowiedzi:
Przygotowanie odpowiedzi zgodnie z RegisterUserResponseDTO.
Ustalenie odpowiednich kodów statusu HTTP.
Logowanie i obsługa błędów:
Dodanie mechanizmów logowania błędów.
Implementacja obsługi różnych scenariuszy błędów (400, 409, 500) zgodnie z wytycznymi.
Testy:
Przygotowanie testów jednostkowych oraz integracyjnych dla endpointu rejestracji.
Testowanie przypadków poprawnych danych, błędnych danych oraz konfliktów przy rejestracji.
Wdrożenie i monitorowanie:
Wdrożenie endpointu w środowisku developerskim, a następnie stagingowym.
Monitorowanie działania endpointu pod kątem wydajności i bezpieczeństwa zgodnie z zasadami @backend.mdc i @shared.mdc.