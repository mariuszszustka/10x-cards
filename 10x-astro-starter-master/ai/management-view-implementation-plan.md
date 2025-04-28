# Plan implementacji widoku listy fiszek

## 1. Przegląd
Widok "Lista Fiszek" umożliwia użytkownikom przeglądanie, wyszukiwanie, sortowanie i zarządzanie swoimi fiszkami edukacyjnymi. Jest to główne miejsce, gdzie użytkownicy mogą zobaczyć swoje fiszki, edytować je bezpośrednio w interfejsie, usuwać zbędne oraz dodawać nowe. Interfejs oferuje intuicyjną nawigację i zarządzanie dużymi zbiorami fiszek dzięki paginacji i funkcjom wyszukiwania.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką: `/flashcards`

## 3. Struktura komponentów
```
FlashcardsPage
├── Header
│   ├── HeaderTitle ("Moje Fiszki")
│   └── AddFlashcardButton
├── SearchAndFilterBar
│   ├── SearchBar
│   └── FilterPanel
├── FlashcardGrid
│   ├── FlashcardItem 1
│   │   └── EditableFlashcard (warunkowy)
│   ├── FlashcardItem 2
│   └── ...
├── Pagination
├── DeleteConfirmationModal (warunkowy)
├── FlashcardForm (warunkowy)
└── ToastNotifications
```

## 4. Szczegóły komponentów

### FlashcardsPage
- Opis komponentu: Główny kontener widoku, zarządzający stanem i integracją z API
- Główne elementy: Header, SearchAndFilterBar, FlashcardGrid, Pagination, modalne komponenty
- Obsługiwane interakcje: Inicjalizacja widoku, zarządzanie stanem globalnym
- Obsługiwana walidacja: Sprawdzanie poprawności parametrów wyszukiwania i filtrowania
- Typy: FlashcardListResponse, Flashcard, SearchParams
- Propsy: Brak (komponent najwyższego poziomu)

### Header
- Opis komponentu: Nagłówek zawierający tytuł sekcji i przycisk dodawania nowej fiszki
- Główne elementy: HeaderTitle, AddFlashcardButton
- Obsługiwane interakcje: Kliknięcie przycisku dodawania
- Obsługiwana walidacja: Brak
- Typy: Brak specyficznych
- Propsy: `onAddClick: () => void`

### SearchBar
- Opis komponentu: Pole wyszukiwania fiszek po zawartości
- Główne elementy: Input, przycisk wyszukiwania, opcja czyszczenia
- Obsługiwane interakcje: Wpisywanie tekstu, zatwierdzanie wyszukiwania, czyszczenie pola
- Obsługiwana walidacja: Brak
- Typy: Brak specyficznych
- Propsy: `value: string, onChange: (value: string) => void, onSearch: () => void`

### FilterPanel
- Opis komponentu: Panel filtrowania i sortowania fiszek
- Główne elementy: Dropdown źródła fiszek, opcje sortowania
- Obsługiwane interakcje: Wybór filtru, wybór opcji sortowania
- Obsługiwana walidacja: Brak
- Typy: FilterOptions, SortOptions
- Propsy: `filters: FilterOptions, sort: SortOptions, onFilterChange: (filters: FilterOptions) => void, onSortChange: (sort: SortOptions) => void`

### FlashcardGrid
- Opis komponentu: Kontener z listą kart fiszek
- Główne elementy: FlashcardItem dla każdej fiszki, komunikat braku wyników
- Obsługiwane interakcje: Delegowanie akcji do poszczególnych kart
- Obsługiwana walidacja: Sprawdzanie pustej listy
- Typy: Flashcard[]
- Propsy: `flashcards: Flashcard[], onEdit: (id: number) => void, onDelete: (id: number, front: string) => void`

### FlashcardItem
- Opis komponentu: Karta pojedynczej fiszki z opcjami zarządzania
- Główne elementy: Pole frontowe, pole tylne, przyciski edycji i usuwania, wskaźnik pudełka Leitnera
- Obsługiwane interakcje: Podgląd tylnej części, kliknięcie edycji, kliknięcie usuwania
- Obsługiwana walidacja: Brak
- Typy: Flashcard
- Propsy: `flashcard: Flashcard, onEdit: () => void, onDelete: () => void, isEditing: boolean`

### EditableFlashcard
- Opis komponentu: Rozszerzenie FlashcardItem z możliwością edycji inline
- Główne elementy: Pola tekstowe edycji, przyciski zapisz/anuluj
- Obsługiwane interakcje: Zmiana tekstu, zatwierdzanie zmian, anulowanie edycji
- Obsługiwana walidacja: Długość pól (front: max 200 znaków, back: max 500 znaków)
- Typy: Flashcard, NewFlashcard
- Propsy: `flashcard: Flashcard, onSave: (updates: NewFlashcard) => void, onCancel: () => void`

### FlashcardForm
- Opis komponentu: Formularz do tworzenia nowej fiszki
- Główne elementy: Pola tekstowe na przód i tył, przyciski zapisz/anuluj, liczniki znaków
- Obsługiwane interakcje: Wypełnianie pól, zatwierdzanie, anulowanie
- Obsługiwana walidacja: Długość pól (front: max 200 znaków, back: max 500 znaków), niepuste pola
- Typy: NewFlashcard
- Propsy: `onSubmit: (card: NewFlashcard) => void, onCancel: () => void, initialValues?: NewFlashcard`

### DeleteConfirmationModal
- Opis komponentu: Modal do potwierdzenia usunięcia fiszki
- Główne elementy: Komunikat potwierdzenia, przyciski tak/nie
- Obsługiwane interakcje: Zatwierdzenie usunięcia, anulowanie
- Obsługiwana walidacja: Brak
- Typy: DeleteModalProps
- Propsy: `isOpen: boolean, flashcardId: number | null, flashcardFront: string, onConfirm: () => void, onCancel: () => void`

### Pagination
- Opis komponentu: Kontrolki paginacji listy fiszek
- Główne elementy: Przyciski poprzednia/następna strona, numery stron, informacja o zakresie
- Obsługiwane interakcje: Kliknięcie zmiany strony
- Obsługiwana walidacja: Sprawdzanie granic paginacji
- Typy: PaginationProps
- Propsy: `currentPage: number, totalPages: number, onPageChange: (page: number) => void`

### ToastNotifications
- Opis komponentu: System powiadomień o sukcesie/błędzie operacji
- Główne elementy: Toast z komunikatem i ikoną typu
- Obsługiwane interakcje: Automatyczne ukrywanie, ręczne zamknięcie
- Obsługiwana walidacja: Brak
- Typy: ToastProps
- Propsy: `toasts: ToastProps[], removeToast: (id: string) => void`

## 5. Typy

```typescript
// Typy bazowe z API
interface Flashcard {
  id: number;
  front: string;
  back: string;
  source: string; // 'ai-full', 'ai-edited', 'manual'
  generation_id: number | null;
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

interface FlashcardListResponse {
  items: Flashcard[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Typy dla tworzenia/aktualizacji
interface NewFlashcard {
  front: string;
  back: string;
}

// Typy dla wyszukiwania i filtrowania
interface SearchParams {
  page: number;
  per_page: number;
  source?: string; // optional
  search?: string; // optional
  generation_id?: number; // optional
}

interface FilterOptions {
  source?: string; // 'ai-full', 'ai-edited', 'manual'
  generation_id?: number;
}

// Typy dla sortowania
type SortField = 'created_at' | 'updated_at' | 'front';
type SortDirection = 'asc' | 'desc';

interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

// Typy dla komponentów UI
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface DeleteModalProps {
  isOpen: boolean;
  flashcardId: number | null;
  flashcardFront: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

## 6. Zarządzanie stanem

Do zarządzania stanem w tym widoku zalecamy utworzenie trzech niestandardowych hooków:

### useFlashcards
```typescript
const useFlashcards = (initialParams: SearchParams) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 20,
    total_pages: 1
  });
  
  // Metody do pobierania danych
  const fetchFlashcards = async () => {
    setLoading(true);
    // Implementacja pobierania fiszek z API
  };
  
  // Metody do zarządzania fiszkami
  const createFlashcard = async (newCard: NewFlashcard) => {
    // Implementacja tworzenia fiszki
  };
  
  const updateFlashcard = async (id: number, updates: NewFlashcard) => {
    // Implementacja aktualizacji fiszki
  };
  
  const deleteFlashcard = async (id: number) => {
    // Implementacja usuwania fiszki
  };
  
  // Metody do zarządzania parametrami
  const setPage = (page: number) => {
    setParams({...params, page});
  };
  
  const setSearch = (search: string) => {
    setParams({...params, search, page: 1});
  };
  
  const setFilter = (filter: FilterOptions) => {
    setParams({...params, ...filter, page: 1});
  };
  
  return { 
    flashcards, 
    loading, 
    error, 
    pagination, 
    params,
    fetchFlashcards, 
    createFlashcard, 
    updateFlashcard, 
    deleteFlashcard,
    setPage,
    setSearch,
    setFilter
  };
};
```

### useToast
```typescript
const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  const addToast = (message: string, type: ToastType, duration: number = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // Automatyczne usuwanie po czasie
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return { toasts, addToast, removeToast };
};
```

### useModal
```typescript
const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [flashcardId, setFlashcardId] = useState<number | null>(null);
  const [flashcardFront, setFlashcardFront] = useState<string>('');
  
  const openModal = (id: number, front: string) => {
    setFlashcardId(id);
    setFlashcardFront(front);
    setIsOpen(true);
  };
  
  const closeModal = () => {
    setIsOpen(false);
    // Resetowanie identyfikatora po animacji zamknięcia
    setTimeout(() => {
      setFlashcardId(null);
      setFlashcardFront('');
    }, 300);
  };
  
  return { isOpen, flashcardId, flashcardFront, openModal, closeModal };
};
```

## 7. Integracja API

Widok wymaga integracji z czterema głównymi endpointami:

### Pobieranie listy fiszek
```typescript
const fetchFlashcards = async (params: SearchParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Dodanie wszystkich parametrów do zapytania
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await fetch(`/api/flashcards?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Problem z pobieraniem fiszek');
    }
    
    const data: FlashcardListResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
```

### Tworzenie nowej fiszki
```typescript
const createFlashcard = async (card: NewFlashcard) => {
  try {
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card)
    });
    
    if (!response.ok) {
      throw new Error('Problem z utworzeniem fiszki');
    }
    
    const data: Flashcard = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
```

### Aktualizacja fiszki
```typescript
const updateFlashcard = async (id: number, updates: NewFlashcard) => {
  try {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Problem z aktualizacją fiszki');
    }
    
    const data: Flashcard = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
```

### Usuwanie fiszki
```typescript
const deleteFlashcard = async (id: number) => {
  try {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Problem z usunięciem fiszki');
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};
```

## 8. Interakcje użytkownika

### Wyszukiwanie fiszek
1. Użytkownik wpisuje tekst w pole wyszukiwania
2. System aktualizuje parametry wyszukiwania po wpisaniu lub po kliknięciu przycisku wyszukiwania
3. Lista fiszek zostaje odświeżona z nowymi parametrami
4. Wyświetlane są tylko fiszki zawierające szukany tekst w polach "przód" lub "tył"

### Filtrowanie i sortowanie
1. Użytkownik wybiera opcje filtrowania (źródło fiszek) lub sortowania
2. System aktualizuje parametry i odświeża listę fiszek
3. Wyświetlane są fiszki spełniające kryteria filtrowania w wybranej kolejności sortowania

### Paginacja
1. Użytkownik klika przycisk zmiany strony lub wybiera konkretną stronę
2. System pobiera odpowiednią stronę z API
3. Lista fiszek zostaje zaktualizowana z nowym zestawem danych

### Dodawanie nowej fiszki
1. Użytkownik klika przycisk "Dodaj fiszkę"
2. System wyświetla formularz tworzenia nowej fiszki
3. Użytkownik wypełnia pola "Przód" i "Tył"
4. System waliduje dane (długość, niepuste pola)
5. Po zatwierdzeniu system wysyła dane do API
6. Nowa fiszka pojawia się na liście, wyświetlane jest powiadomienie o sukcesie

### Edycja fiszki
1. Użytkownik klika przycisk edycji na wybranej fiszce
2. System przełącza kartę w tryb edycji inline
3. Użytkownik modyfikuje pola "Przód" i/lub "Tył"
4. System waliduje dane (długość, niepuste pola)
5. Po zatwierdzeniu system wysyła dane do API
6. Fiszka jest zaktualizowana na liście, wyświetlane jest powiadomienie o sukcesie

### Usuwanie fiszki
1. Użytkownik klika przycisk usunięcia na wybranej fiszce
2. System wyświetla modal potwierdzenia z treścią fiszki
3. Po potwierdzeniu system wysyła żądanie usunięcia do API
4. Fiszka znika z listy, wyświetlane jest powiadomienie o sukcesie

## 9. Warunki i walidacja

### Walidacja tworzenia i edycji fiszek
- Pole "Przód" nie może być puste i nie może przekraczać 200 znaków
- Pole "Tył" nie może być puste i nie może przekraczać 500 znaków
- Komponent powinien wyświetlać licznik znaków dla obu pól
- Przycisk zatwierdzenia powinien być nieaktywny, gdy walidacja nie przechodzi

### Walidacja paginacji
- Numer strony nie może być mniejszy od 1
- Numer strony nie może być większy od całkowitej liczby stron
- Przyciski poprzedniej/następnej strony powinny być nieaktywne na granicach zakresu

### Walidacja wyszukiwania
- Pole wyszukiwania powinno ignorować wielkie litery
- Przycisk czyszczenia wyszukiwania powinien być widoczny tylko gdy pole zawiera tekst

## 10. Obsługa błędów

### Błędy ładowania fiszek
- Wyświetlenie przyjaznego komunikatu o błędzie
- Przycisk do ponowienia próby
- Logowanie błędu do monitoringu

### Błędy tworzenia/edycji fiszki
- Wyświetlenie kontekstowego powiadomienia o błędzie
- Zachowanie formularza z wprowadzonymi danymi
- Szczegółowe komunikaty walidacji w przypadku błędów w danych

### Błędy usuwania fiszki
- Wyświetlenie kontekstowego powiadomienia o błędzie
- Pozostawienie fiszki na liście
- Możliwość ponowienia próby

### Brak fiszek
- Wyświetlenie przyjaznego komunikatu, gdy lista jest pusta
- Sugestia dodania pierwszej fiszki
- Wskazówka dotycząca zmiany filtrów, jeśli stosowano filtrowanie

### Błędy sieci
- Wykrywanie stanu offline
- Informowanie użytkownika o problemach z połączeniem
- Automatyczne ponowienie próby po przywróceniu połączenia

## 11. Kroki implementacji

1. Utworzenie podstawowej struktury widoku i routingu
   - Stworzenie strony `/flashcards`
   - Implementacja podstawowego układu komponentów

2. Implementacja customowych hooków do zarządzania stanem
   - useFlashcards
   - useToast
   - useModal

3. Integracja z API
   - Implementacja funkcji do komunikacji z endpointami
   - Obsługa błędów i ładowania danych

4. Implementacja komponentów UI
   - Header z przyciskiem dodawania
   - SearchBar i FilterPanel
   - FlashcardGrid i FlashcardItem
   - Pagination
   - DeleteConfirmationModal i ToastNotifications

5. Implementacja interakcji edycji inline
   - Komponent EditableFlashcard
   - Logika przełączania między trybem podglądu i edycji

6. Implementacja formularza dodawania nowej fiszki
   - Komponent FlashcardForm
   - Integracja z API tworzenia fiszek

7. Implementacja walidacji
   - Walidacja formularzy
   - Walidacja parametrów wyszukiwania i filtrowania

8. Implementacja obsługi błędów
   - Komunikaty błędów
   - Mechanizmy ponownego próbowania

9. Testy i optymalizacja
   - Testowanie wszystkich interakcji użytkownika
   - Optymalizacja wydajności renderowania

10. Implementacja funkcji dodatkowych
    - Wskaźniki pudełka Leitnera
    - Zaawansowane opcje sortowania i filtrowania
