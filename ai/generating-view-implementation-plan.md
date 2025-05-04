# Plan implementacji widoku Generowania Fiszek

## 1. Przegląd
Widok Generowania Fiszek to kluczowy element aplikacji 10x-cards umożliwiający użytkownikom tworzenie fiszek edukacyjnych na dwa sposoby: ręcznie oraz automatycznie przy pomocy AI. Widok pozwala na wklejenie tekstu źródłowego, generowanie propozycji fiszek przez modele AI, a następnie przeglądanie, edytowanie i zatwierdzanie tych propozycji.

## 2. Routing widoku
Widok dostępny pod ścieżką: `/generate`

## 3. Struktura komponentów
```
GenerateView
├── CreationModeToggle
├── ManualFlashcardForm (pokazywane w trybie ręcznym)
│   └── ErrorDisplay
└── AIGenerationContainer (pokazywane w trybie AI)
    ├── AIGenerationForm
    │   ├── AIModelSelector
    │   └── LoadingIndicator
    ├── ErrorDisplay
    ├── FlashcardProposalsList
    │   ├── FlashcardProposalItem[]
    │   │   └── FlashcardEditor (pokazywane w trybie edycji)
    │   └── LoadingIndicator
    └── BulkActionsBar
```

## 4. Szczegóły komponentów
### GenerateView
- **Opis komponentu:** Główny kontener dla całego widoku, zarządza stanem i wyborem trybu tworzenia fiszek
- **Główne elementy:** Kontener z nagłówkiem, przełącznikiem trybu oraz warunkowym renderowaniem odpowiedniego formularza
- **Obsługiwane interakcje:** Przełączanie między trybami, obsługa globalnych błędów
- **Obsługiwana walidacja:** Weryfikacja uprawnień użytkownika (dostęp tylko dla zalogowanych)
- **Typy:** Wykorzystuje GenerationViewModel oraz FlashcardCreateDto
- **Propsy:** Brak (komponent najwyższego poziomu)

### CreationModeToggle
- **Opis komponentu:** Przełącznik między ręcznym tworzeniem fiszek a generowaniem poprzez AI
- **Główne elementy:** Segmentowany kontrolka przełącznika z dwoma trybami
- **Obsługiwane interakcje:** Zmiana trybu tworzenia fiszek (kliknięcie)
- **Obsługiwana walidacja:** N/A
- **Typy:** Enum CreationMode (MANUAL | AI)
- **Propsy:** 
  ```typescript
  {
    currentMode: CreationMode;
    onChange: (mode: CreationMode) => void;
  }
  ```

### ManualFlashcardForm
- **Opis komponentu:** Formularz do ręcznego tworzenia pojedynczej fiszki
- **Główne elementy:** Pola tekstowe dla przodu i tyłu fiszki, przycisk zapisu, liczniki znaków
- **Obsługiwane interakcje:** Wprowadzanie tekstu, zapisywanie fiszki, czyszczenie formularza
- **Obsługiwana walidacja:** 
  - Przód: wymagany, 1-200 znaków 
  - Tył: wymagany, 1-500 znaków
- **Typy:** FlashcardCreateDto
- **Propsy:** 
  ```typescript
  {
    onSubmit: (flashcard: FlashcardCreateDto) => Promise<void>;
    isSubmitting?: boolean;
  }
  ```

### AIGenerationForm
- **Opis komponentu:** Formularz do wprowadzania tekstu źródłowego i generowania fiszek przez AI
- **Główne elementy:** Duże pole tekstowe, licznik znaków, wybór modelu AI, przycisk generowania
- **Obsługiwane interakcje:** Wprowadzanie tekstu, wybór modelu, generowanie, anulowanie
- **Obsługiwana walidacja:** Długość tekstu (1000-10000 znaków)
- **Typy:** GenerationRequestDto
- **Propsy:** 
  ```typescript
  {
    onSubmit: (request: GenerationRequestDto) => Promise<void>;
    isGenerating: boolean;
    onCancel?: () => void;
    defaultModel?: AIModelType;
  }
  ```

### AIModelSelector
- **Opis komponentu:** Komponent do wyboru modelu AI używanego do generowania
- **Główne elementy:** Lista rozwijana z dostępnymi modelami
- **Obsługiwane interakcje:** Wybór modelu
- **Obsługiwana walidacja:** N/A
- **Typy:** AIModelType
- **Propsy:** 
  ```typescript
  {
    value: AIModelType;
    onChange: (model: AIModelType) => void;
    disabled?: boolean;
  }
  ```

### FlashcardProposalsList
- **Opis komponentu:** Lista propozycji fiszek wygenerowanych przez AI
- **Główne elementy:** Nagłówek z informacją o liczbie propozycji, lista elementów FlashcardProposalItem
- **Obsługiwane interakcje:** Przewijanie, filtrowanie (opcjonalnie)
- **Obsługiwana walidacja:** N/A
- **Typy:** FlashcardProposalViewModel[]
- **Propsy:** 
  ```typescript
  {
    proposals: FlashcardProposalViewModel[];
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onEdit: (id: string, data: FlashcardCreateDto) => void;
    isLoading?: boolean;
  }
  ```

### FlashcardProposalItem
- **Opis komponentu:** Pojedynczy element propozycji fiszki z kontrolkami akcji
- **Główne elementy:** Pola przód/tył, przyciski akcji (akceptuj/odrzuć/edytuj)
- **Obsługiwane interakcje:** Akcje akceptacji, odrzucenia, edycji
- **Obsługiwana walidacja:** N/A
- **Typy:** FlashcardProposalViewModel
- **Propsy:** 
  ```typescript
  {
    proposal: FlashcardProposalViewModel;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onEdit: (id: string, data: FlashcardCreateDto) => void;
  }
  ```

### FlashcardEditor
- **Opis komponentu:** Modal do edycji pojedynczej fiszki
- **Główne elementy:** Pola tekstowe dla przodu i tyłu, przyciski zapisu/anulowania
- **Obsługiwane interakcje:** Edycja tekstu, zapisywanie zmian, anulowanie
- **Obsługiwana walidacja:** 
  - Przód: wymagany, 1-200 znaków
  - Tył: wymagany, 1-500 znaków
- **Typy:** FlashcardProposalDto, FlashcardCreateDto
- **Propsy:** 
  ```typescript
  {
    proposal: FlashcardProposalDto;
    onSave: (id: string, data: FlashcardCreateDto) => void;
    onCancel: () => void;
    isOpen: boolean;
  }
  ```

### BulkActionsBar
- **Opis komponentu:** Pasek z przyciskami akcji zbiorczych dla propozycji fiszek
- **Główne elementy:** Przyciski akcji zbiorczych, licznik wybranych fiszek
- **Obsługiwane interakcje:** Zapisywanie wszystkich zaakceptowanych, zaakceptowanie/odrzucenie wszystkich
- **Obsługiwana walidacja:** Blokada przycisków gdy brak wybranych propozycji
- **Typy:** N/A
- **Propsy:** 
  ```typescript
  {
    acceptedCount: number;
    totalCount: number;
    onSaveAccepted: () => Promise<void>;
    onAcceptAll: () => void;
    onRejectAll: () => void;
    isSaving: boolean;
  }
  ```

### LoadingIndicator
- **Opis komponentu:** Wskaźnik ładowania dla operacji generowania i zapisywania
- **Główne elementy:** Animowany spinner, opcjonalny tekst statusu
- **Obsługiwane interakcje:** N/A
- **Obsługiwana walidacja:** N/A
- **Typy:** N/A
- **Propsy:** 
  ```typescript
  {
    isLoading: boolean;
    message?: string;
  }
  ```

### ErrorDisplay
- **Opis komponentu:** Komponent do wyświetlania błędów z opcją ponowienia akcji
- **Główne elementy:** Komunikat błędu, przycisk zamknięcia, opcjonalny przycisk ponowienia
- **Obsługiwane interakcje:** Zamknięcie komunikatu, ponowienie akcji
- **Obsługiwana walidacja:** N/A
- **Typy:** ErrorDto
- **Propsy:** 
  ```typescript
  {
    error: ErrorDto | null;
    onClose: () => void;
    onRetry?: () => void;
  }
  ```

## 5. Typy
```typescript
// Typy enumeracyjne
enum CreationMode {
  MANUAL = 'manual',
  AI = 'ai'
}

type AIModelType = 'gemma3:27b' | 'llama3.2:3b' | 'deepseek-r1:32b' | 'llama3.3:latest';

// DTO - Data Transfer Objects dla API
interface FlashcardDto {
  id: string;
  front: string; // max 200 znaków
  back: string;  // max 500 znaków
  createdAt: string;
  userId: string;
}

interface FlashcardCreateDto {
  front: string; // max 200 znaków
  back: string;  // max 500 znaków
}

interface FlashcardProposalDto {
  id: string;
  front: string;
  back: string;
  status: 'pending' | 'accepted' | 'rejected' | 'edited';
  originalFront?: string; // oryginalna wersja przed edycją
  originalBack?: string;  // oryginalna wersja przed edycją
}

interface GenerationRequestDto {
  sourceText: string;   // 1000-10000 znaków
  model: AIModelType;   // typ modelu
  count?: number;       // opcjonalna liczba fiszek do wygenerowania
}

interface GenerationResponseDto {
  id: string;
  proposals: FlashcardProposalDto[];
  sourceText: string;
  model: AIModelType;
  createdAt: string;
  status: 'success' | 'error' | 'partial';
  error?: string;
}

interface ErrorDto {
  message: string;
  code?: string;
  field?: string;
}

// View Models - reprezentacje stanu UI
interface GenerationViewModel {
  isGenerating: boolean;
  proposals: FlashcardProposalViewModel[];
  sourceText: string;
  model: AIModelType;
  error: ErrorDto | null;
  selectedProposals: Set<string>; // ID zaznaczonych propozycji
}

interface FlashcardProposalViewModel extends FlashcardProposalDto {
  isEditing: boolean;
  validationErrors?: {
    front?: string;
    back?: string;
  };
}
```

## 6. Zarządzanie stanem
Do zarządzania stanem widoku zalecane jest użycie dwóch niestandardowych hooków:

### useFlashcardGeneration
Hook odpowiedzialny za zarządzanie generowaniem fiszek przez AI:
```typescript
const useFlashcardGeneration = () => {
  const [state, setState] = useState<GenerationViewModel>({
    isGenerating: false,
    proposals: [],
    sourceText: '',
    model: 'llama3.2:3b',
    error: null,
    selectedProposals: new Set()
  });

  // Metody do zarządzania generowaniem
  const generateFlashcards = async (request: GenerationRequestDto) => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));
      
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd podczas generowania fiszek');
      }
      
      const data: GenerationResponseDto = await response.json();
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        proposals: data.proposals.map(p => ({ ...p, isEditing: false })),
        sourceText: data.sourceText,
        model: data.model
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: {
          message: error instanceof Error ? error.message : 'Nieznany błąd podczas generowania',
        }
      }));
    }
  };
  
  // Metody do zarządzania propozycjami
  const acceptProposal = (id: string) => { /* Implementacja */ };
  const rejectProposal = (id: string) => { /* Implementacja */ };
  const editProposal = (id: string, data: FlashcardCreateDto) => { /* Implementacja */ };
  const saveAcceptedProposals = async () => { /* Implementacja */ };

  return {
    state,
    generateFlashcards,
    acceptProposal,
    rejectProposal,
    editProposal,
    saveAcceptedProposals
  };
};
```

### useFlashcardCreation
Hook odpowiedzialny za zarządzanie ręcznym tworzeniem fiszek:
```typescript
const useFlashcardCreation = () => {
  const [flashcard, setFlashcard] = useState<FlashcardCreateDto>({
    front: '',
    back: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Walidacja danych
  const validateFlashcard = () => { /* Implementacja */ };
  
  // Tworzenie fiszki
  const createFlashcard = async (data: FlashcardCreateDto) => {
    try {
      setIsSubmitting(true);
      setErrors({});
      
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Obsługa błędów walidacji z API
        if (errorData.validationErrors) {
          setErrors(errorData.validationErrors);
        } else {
          throw new Error(errorData.message || 'Błąd podczas tworzenia fiszki');
        }
      }
      
      // Resetowanie formularza po sukcesie
      setFlashcard({ front: '', back: '' });
      setIsSubmitting(false);
      
      // Wyświetlenie powiadomienia o sukcesie
    } catch (error) {
      setIsSubmitting(false);
      // Obsługa globalnego błędu
    }
  };

  return {
    flashcard,
    setFlashcard,
    errors,
    isSubmitting,
    validateFlashcard,
    createFlashcard
  };
};
```

## 7. Integracja API
Integracja z API będzie realizowana przez następujące wywołania:

### Generowanie propozycji fiszek
```typescript
const generateFlashcards = async (request: GenerationRequestDto) => {
  try {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    const response = await fetch('/api/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Błąd podczas generowania fiszek');
    }
    
    const data: GenerationResponseDto = await response.json();
    
    setState(prev => ({
      ...prev,
      isGenerating: false,
      proposals: data.proposals.map(p => ({ ...p, isEditing: false })),
      sourceText: data.sourceText,
      model: data.model
    }));
  } catch (error) {
    setState(prev => ({
      ...prev,
      isGenerating: false,
      error: {
        message: error instanceof Error ? error.message : 'Nieznany błąd podczas generowania',
      }
    }));
  }
};
```

### Zapisywanie zaakceptowanych propozycji
```typescript
const saveAcceptedProposals = async () => {
  try {
    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    const acceptedProposals = state.proposals
      .filter(p => p.status === 'accepted' || p.status === 'edited')
      .map(p => ({ front: p.front, back: p.back }));
    
    const response = await fetch('/api/generations/{id}/accept', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acceptedProposals)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Błąd podczas zapisywania fiszek');
    }
    
    // Czyszczenie stanu po zapisie
    setState(prev => ({
      ...prev,
      isSaving: false,
      proposals: [],
      sourceText: '',
      selectedProposals: new Set()
    }));
    
    // Wyświetlenie powiadomienia o sukcesie
  } catch (error) {
    setState(prev => ({
      ...prev,
      isSaving: false,
      error: {
        message: error instanceof Error ? error.message : 'Nieznany błąd podczas zapisywania',
      }
    }));
  }
};
```

### Tworzenie pojedynczej fiszki (tryb ręczny)
```typescript
const createFlashcard = async (data: FlashcardCreateDto) => {
  try {
    setIsSubmitting(true);
    setErrors({});
    
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      // Obsługa błędów walidacji z API
      if (errorData.validationErrors) {
        setErrors(errorData.validationErrors);
      } else {
        throw new Error(errorData.message || 'Błąd podczas tworzenia fiszki');
      }
    }
    
    // Resetowanie formularza po sukcesie
    setFlashcard({ front: '', back: '' });
    setIsSubmitting(false);
    
    // Wyświetlenie powiadomienia o sukcesie
  } catch (error) {
    setIsSubmitting(false);
    // Obsługa globalnego błędu
  }
};
```

## 8. Interakcje użytkownika
1. **Przełączanie trybu tworzenia**
   - Użytkownik klika w przełącznik trybu
   - System przełącza widok między formularzem ręcznym a formularzem AI
   - Resetowane są wszelkie dane wprowadzone w poprzednim trybie

2. **Ręczne tworzenie fiszki**
   - Użytkownik wypełnia pola "Przód" i "Tył"
   - System waliduje dane w czasie rzeczywistym (długość tekstu)
   - Po kliknięciu "Zapisz" system tworzy nową fiszkę w bazie danych
   - Po sukcesie formularz jest czyszczony i wyświetlane jest potwierdzenie

3. **Generowanie propozycji przez AI**
   - Użytkownik wkleja tekst (min. 1000, maks. 10000 znaków)
   - Opcjonalnie wybiera model AI z listy dostępnych
   - Po kliknięciu "Generuj" system wysyła zapytanie do API
   - Podczas generowania wyświetlany jest wskaźnik ładowania
   - Po zakończeniu generowania wyświetlana jest lista propozycji

4. **Zarządzanie propozycjami**
   - Użytkownik może zaakceptować, odrzucić lub edytować każdą propozycję
   - Zaakceptowane propozycje są wizualnie oznaczone
   - Odrzucone propozycje są wygaszane lub ukrywane
   - Edytowane propozycje pokazują zarówno oryginalną jak i zmienioną wersję

5. **Edycja propozycji**
   - Po kliknięciu "Edytuj" otwiera się modal edycji
   - Użytkownik może modyfikować pola "Przód" i "Tył"
   - System waliduje dane (długość tekstu)
   - Po kliknięciu "Zapisz" propozycja jest aktualizowana
   - Status propozycji zmienia się na "edited"

6. **Operacje zbiorcze**
   - Użytkownik może kliknąć "Zaakceptuj wszystkie" lub "Odrzuć wszystkie"
   - System zmienia status wszystkich propozycji
   - Po kliknięciu "Zapisz zaakceptowane" system zapisuje w bazie danych wszystkie propozycje o statusie "accepted" lub "edited"

7. **Anulowanie generowania**
   - Użytkownik może kliknąć "Anuluj" podczas generowania
   - System przerywa operację i resetuje stan ładowania

## 9. Warunki i walidacja
### Walidacja formularza ręcznego tworzenia
- **Pole "Przód"**
  - Wymagane (nie może być puste)
  - Długość: 1-200 znaków
  - Walidacja w czasie rzeczywistym z licznikiem pozostałych znaków
  - Blokada przycisku "Zapisz" gdy walidacja nie przechodzi

- **Pole "Tył"**
  - Wymagane (nie może być puste)
  - Długość: 1-500 znaków
  - Walidacja w czasie rzeczywistym z licznikiem pozostałych znaków
  - Blokada przycisku "Zapisz" gdy walidacja nie przechodzi

### Walidacja formularza generowania przez AI
- **Pole tekstu źródłowego**
  - Wymagane (nie może być puste)
  - Długość: 1000-10000 znaków
  - Walidacja w czasie rzeczywistym z licznikiem znaków
  - Blokada przycisku "Generuj" gdy tekst jest za krótki lub za długi

### Walidacja edycji propozycji
- **Pola "Przód" i "Tył"**
  - Takie same warunki jak w formularzu ręcznym
  - Walidacja przed zapisem zmian
  - Blokada przycisku "Zapisz" gdy walidacja nie przechodzi

### Walidacja zapisu zbiorczego
- **Przycisk "Zapisz zaakceptowane"**
  - Aktywny tylko gdy istnieje co najmniej jedna zaakceptowana propozycja
  - Blokada podczas procesu zapisywania

## 10. Obsługa błędów
1. **Błędy API podczas generowania**
   - Wyświetlenie komunikatu o błędzie z przyciskiem "Spróbuj ponownie"
   - Zachowanie wprowadzonego tekstu źródłowego
   - Możliwość zmiany modelu AI i ponowienia próby

2. **Błędy walidacji formularzy**
   - Wyświetlenie komunikatów błędów pod odpowiednimi polami
   - Blokada przycisków akcji do czasu poprawienia błędów
   - Wyróżnienie niepoprawnych pól wizualnie (czerwona ramka, ikona błędu)

3. **Timeout przy generowaniu**
   - Automatyczne przerwanie po określonym czasie (np. 60 sekund)
   - Komunikat o przekroczeniu czasu z opcją ponowienia
   - Sugestia użycia mniejszego modelu lub krótszego tekstu

4. **Utrata połączenia podczas generowania**
   - Detekcja stanu offline
   - Komunikat o braku połączenia
   - Buforowanie wprowadzonego tekstu
   - Automatyczne ponowienie po przywróceniu połączenia (opcjonalnie)

5. **Błędy podczas zapisywania fiszek**
   - Wyświetlenie komunikatu o błędzie z przyciskiem "Spróbuj ponownie"
   - Zachowanie stanu propozycji
   - W przypadku błędów walidacji - wyróżnienie problematycznych propozycji

## 11. Kroki implementacji
1. **Przygotowanie bazowej struktury widoku**
   - Utworzenie pliku komponentu głównego `GenerateView.tsx`
   - Implementacja routingu w aplikacji (dodanie ścieżki `/generate`)
   - Stworzenie podstawowej struktury komponentu i szkieletu stanu

2. **Implementacja przełącznika trybu**
   - Utworzenie komponentu `CreationModeToggle.tsx`
   - Dodanie logiki przełączania między trybami
   - Integracja z głównym komponentem widoku

3. **Implementacja formularza ręcznego tworzenia**
   - Utworzenie komponentu `ManualFlashcardForm.tsx`
   - Implementacja validacji formularza
   - Połączenie z serwisem API do tworzenia fiszek

4. **Implementacja formularza generowania AI**
   - Utworzenie komponentu `AIGenerationForm.tsx`
   - Dodanie pola tekstowego z walidacją długości
   - Utworzenie selektora modelu AI
   - Implementacja logiki wysyłania żądania do API

5. **Implementacja wyświetlania propozycji**
   - Utworzenie komponentów `FlashcardProposalsList.tsx` i `FlashcardProposalItem.tsx`
   - Implementacja wyświetlania listy propozycji
   - Dodanie kontrolek do zarządzania propozycjami (akcpetuj/odrzuć/edytuj)

6. **Implementacja edycji propozycji**
   - Utworzenie komponentu `FlashcardEditor.tsx`
   - Implementacja logiki otwierania/zamykania modalu
   - Implementacja walidacji podczas edycji

7. **Implementacja akcji zbiorczych**
   - Utworzenie komponentu `BulkActionsBar.tsx`
   - Implementacja logiki akcji zbiorczych (zaakceptuj wszystkie, odrzuć wszystkie)
   - Implementacja zapisu zaakceptowanych propozycji

8. **Implementacja komponentów pomocniczych**
   - Utworzenie komponentów `LoadingIndicator.tsx` i `ErrorDisplay.tsx`
   - Integracja z odpowiednimi miejscami w widoku

9. **Implementacja hooków zarządzania stanem**
   - Utworzenie `useFlashcardGeneration.ts`
   - Utworzenie `useFlashcardCreation.ts`
   - Implementacja pełnej logiki biznesowej

10. **Integracja z API**
    - Implementacja wywołań do API generowania fiszek
    - Implementacja wywołań do API zapisywania fiszek
    - Obsługa odpowiedzi i błędów

11. **Implementacja obsługi błędów**
    - Dodanie obsługi błędów API
    - Dodanie obsługi przypadków brzegowych
    - Implementacja komunikatów dla użytkownika

12. **Testowanie i poprawki**
    - Testy funkcjonalne widoku
    - Sprawdzenie poprawności walidacji
    - Sprawdzenie obsługi różnych scenariuszy błędów
    - Optymalizacja wydajności przy dużej liczbie propozycji
