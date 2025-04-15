# Plan interfejsu użytkownika (UI) - 10x-cards

## Decyzje projektowe

1. Ustalono, że główne widoki interfejsu będą obejmować ekran autoryzacji, dashboard, widok generowania fiszek, widok listy fiszek z modalem do edycji (umożliwiający zapis pojedynczej fiszki) oraz opcją "Zapisz wszystkie", panel użytkownika i ekran sesji powtórkowych.
2. Przepływ użytkownika rozpocznie się od logowania, a następnie użytkownik zostanie skierowany do widoku generowania, gdzie wprowadza tekst, recenzuje propozycje fiszek i dokonuje zatwierdzenia lub edycji, a finalny zapis może być wykonany zbiorczo.
3. Nawigacja zostanie oparta na topbarze wykorzystującym Navigation Menu z Shadcn/ui, z dropdownem zawierającym opcje zarządzania kontem użytkownika.
4. W panelu użytkownika dostępne będą dane: avatar (wspólny dla wszystkich na etapie MVP), nazwa użytkownika, adres email oraz link do edycji profilu.
5. Implementacja komunikatów inline oraz wskaźników stanu (spinnerów) dla operacji takich jak generowanie, edycja i usuwanie fiszek.
6. Początkowo zarządzanie stanem aplikacji oparte będzie o React Context z możliwością rozbudowy o React Query lub Zustand w przyszłości.
7. Wymagania dotyczące responsywności i dostępności zostaną spełnione zgodnie z wytycznymi WCAG AA.
8. Mechanizmy autoryzacji (JWT) zostaną wdrożone na kolejnych etapach, najpierw podstawowa funkcjonalność.

## Rekomendacje

1. Ustanowienie jednolitego schematu stanów (loading, success, error) dla wszystkich widoków.
2. Zaprojektowanie prototypu interfejsu z wyraźnym podziałem na ekrany autoryzacji, generowania, listy fiszek, panelu użytkownika oraz sesji powtórkowych.
3. Wykorzystanie topbaru z Navigation Menu z Shadcn/ui, wraz z dropdownem do zarządzania kontem.
4. Implementacja jednolitej logiki walidacji i komunikatów błędów inline.
5. Przyjęcie strategii zarządzania stanem opartej na React Context, z możliwością rozszerzenia o bardziej zaawansowane narzędzia.
6. Uwzględnienie mechanizmów buforowania i pre-fetchingu danych jako opcji do rozważenia w przyszłości.
7. Zapewnienie spełnienia wymagań responsywności oraz standardów dostępności WCAG AA.

## Podsumowanie architektury UI

Główne wymagania dotyczące architektury UI obejmują stworzenie interfejsu z kluczowymi widokami: ekran autoryzacji, dashboard, widok generowania fiszek, widok listy fiszek z modalem do edycji (umożliwiający zarówno pojedyncze zapisy, jak i bulkowy zapis zatwierdzonych zmian), panel użytkownika oraz ekran sesji powtórkowych. Przepływ użytkownika zakłada, że po logowaniu, użytkownik przechodzi do widoku generowania, gdzie poprzez interakcję z modelem AI recenzuje i modyfikuje propozycje fiszek. Nawigacja zostanie oparta na topbarze wykorzystującym Navigation Menu z Shadcn/ui, w tym dropdown do zarządzania kontem.

Integracja z API będzie obsługiwana przy użyciu dostępnych endpointów, a komunikaty o stanie operacji (spinner, komunikaty inline) zostaną zaimplementowane dla wszystkich akcji (generowanie, edycja, usuwanie). Zarządzanie stanem aplikacji początkowo oparte będzie o React Context, z możliwością rozbudowy o React Query lub Zustand na późniejszym etapie. Wymogi responsywności i dostępności będą realizowane zgodnie z WCAG AA, a kwestie bezpieczeństwa związane z autoryzacją (JWT) zostaną wdrożone na kolejnych etapach rozwoju.

## Otwarte kwestie

Brak nierozwiązanych kwestii; wszystkie kluczowe decyzje zostały ustalone na etapie MVP.

## Priorytety implementacji widoków
Podczas wdrażania MVP, implementacja widoków powinna odbywać się w następującej kolejności, aby skupić się na kluczowych funkcjonalnościach produktu:

1. **Widok generowania fiszek** - podstawowa funkcjonalność produktu, która dostarcza główną wartość
2. **Widok listy fiszek z modalem do edycji** - umożliwia zarządzanie wygenerowanymi fiszkami
3. **Ekran autoryzacji** - podstawowa funkcjonalność logowania i rejestracji
4. **Ekran sesji powtórkowych** - implementacja algorytmu powtórek
5. **Panel użytkownika** - zarządzanie kontem

## Standardy komunikatów i stanów aplikacji
Dla zapewnienia spójności doświadczenia użytkownika, wszystkie widoki będą korzystać z jednolitego systemu komunikatów:

- **Stan ładowania**: Jednolity spinner w miejscu wykonywania akcji
- **Stan sukcesu**: Komunikat w kolorze zielonym (inline lub toast)
- **Błąd walidacji**: Komunikat inline pod polem formularza w kolorze czerwonym
- **Błąd operacji**: Komunikat toast w górnej części ekranu w kolorze czerwonym
- **Informacja**: Neutralny komunikat w kolorze niebieskim dla powiadomień ogólnych

Na etapie MVP implementujemy komunikaty inline dla błędów walidacji i powiadomienia toast dla ogólnych błędów operacji, co zapewni podstawowy feedback dla użytkownika.

## Mapowanie stanów API do interfejsu użytkownika
Aby zapewnić spójne doświadczenie użytkownika, wprowadzamy mapowanie między stanami zwracanymi przez API a ich reprezentacją w interfejsie:

### Generowanie fiszek:
- **API: processing** → UI: spinner + komunikat "Generowanie fiszek w toku..."
- **API: completed** → UI: lista propozycji fiszek z opcjami zatwierdzenia/edycji
- **API: error** → UI: komunikat błędu + opcja ponowienia

### Operacje na fiszkach:
- **API: 201 Created** → UI: komunikat sukcesu "Fiszka dodana"
- **API: 200 OK** (po edycji) → UI: komunikat sukcesu "Zmiany zapisane"
- **API: 204 No Content** (po usunięciu) → UI: odświeżenie listy bez usuniętej fiszki
- **API: 4xx/5xx** → UI: odpowiedni komunikat błędu z możliwością ponowienia akcji
