import React from 'react';
import { AUTH, FLASHCARDS, GENERATION, STUDY } from './test-selectors';

/**
 * Przykłady implementacji atrybutów data-testid w komponentach
 * Te przykłady pokazują, jak poprawnie dodawać atrybuty testowe
 * do różnych typów komponentów w aplikacji.
 */

// Przykład 1: Komponent formularza logowania
export function LoginForm() {
  return (
    <form data-testid={AUTH.LOGIN_FORM}>
      <div>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          data-testid={AUTH.EMAIL_INPUT} 
          name="email" 
        />
      </div>
      <div>
        <label htmlFor="password">Hasło</label>
        <input 
          type="password" 
          id="password" 
          data-testid={AUTH.PASSWORD_INPUT} 
          name="password" 
        />
      </div>
      <div>
        <input 
          type="checkbox" 
          id="remember" 
          data-testid={AUTH.REMEMBER_ME} 
          name="remember" 
        />
        <label htmlFor="remember">Zapamiętaj mnie</label>
      </div>
      <a href="/reset-password" data-testid={AUTH.FORGOT_PASSWORD_LINK}>
        Zapomniałem hasła
      </a>
      <button type="submit" data-testid={AUTH.SUBMIT_BUTTON}>
        Zaloguj
      </button>
    </form>
  );
}

// Przykład 2: Komponent fiszki
interface FlashcardItemProps {
  id: string;
  front: string;
  back: string;
}

export function FlashcardItem({ id, front, back }: FlashcardItemProps) {
  return (
    <div data-testid={FLASHCARDS.LIST.ITEM} data-flashcard-id={id}>
      <div data-testid={FLASHCARDS.LIST.FRONT}>{front}</div>
      <div data-testid={FLASHCARDS.LIST.BACK}>{back}</div>
      <div>
        <button data-testid={FLASHCARDS.LIST.EDIT_BUTTON}>
          Edytuj
        </button>
        <button data-testid={FLASHCARDS.LIST.DELETE_BUTTON}>
          Usuń
        </button>
      </div>
    </div>
  );
}

// Przykład 3: Komponent generowania fiszek przez AI
export function GenerateFlashcardsForm() {
  return (
    <div data-testid={GENERATION.FORM.CONTAINER}>
      <textarea 
        data-testid={GENERATION.FORM.TEXT_INPUT}
        placeholder="Wprowadź tekst źródłowy (min. 1000 znaków)" 
      />
      <select data-testid={GENERATION.FORM.MODEL_SELECTOR}>
        <option value="llama3.2:3b">llama3.2:3b (szybki)</option>
        <option value="gemma3:27b">gemma3:27b (wysoka jakość)</option>
        <option value="deepseek-r1:32b">deepseek-r1:32b (rozszerzony kontekst)</option>
      </select>
      <button data-testid={GENERATION.FORM.GENERATE_BUTTON}>
        Generuj fiszki
      </button>
    </div>
  );
}

// Przykład 4: Komponent propozycji fiszki generowanej przez AI
interface FlashcardProposalProps {
  front: string;
  back: string;
}

export function FlashcardProposal({ front, back }: FlashcardProposalProps) {
  return (
    <div data-testid={GENERATION.PROPOSALS.ITEM}>
      <div data-testid={GENERATION.PROPOSALS.PREVIEW}>
        <div>{front}</div>
        <div>{back}</div>
      </div>
      <div>
        <button data-testid={GENERATION.PROPOSALS.APPROVE_BUTTON}>
          Zatwierdź
        </button>
        <button data-testid={GENERATION.PROPOSALS.EDIT_BUTTON}>
          Edytuj
        </button>
        <button data-testid={GENERATION.PROPOSALS.REJECT_BUTTON}>
          Odrzuć
        </button>
      </div>
    </div>
  );
}

// Przykład 5: Komponent sesji nauki
export function StudySession() {
  const [showAnswer, setShowAnswer] = React.useState(false);
  
  return (
    <div data-testid={STUDY.SESSION.CONTAINER}>
      <div data-testid={STUDY.PROGRESS.COUNTER}>
        Fiszka 3 z 10
      </div>
      <div data-testid={STUDY.PROGRESS.BAR} style={{ width: '30%' }}>
        Postęp
      </div>
      
      <div data-testid={STUDY.SESSION.FLASHCARD}>
        <div data-testid={STUDY.SESSION.FRONT}>
          Pytanie fiszki
        </div>
        
        {!showAnswer ? (
          <button 
            data-testid={STUDY.SESSION.REVEAL_BUTTON}
            onClick={() => setShowAnswer(true)}
          >
            Pokaż odpowiedź
          </button>
        ) : (
          <>
            <div data-testid={STUDY.SESSION.BACK}>
              Odpowiedź fiszki
            </div>
            
            <div data-testid={STUDY.SESSION.DIFFICULTY.CONTAINER}>
              <button data-testid={STUDY.SESSION.DIFFICULTY.HARD}>
                Trudna
              </button>
              <button data-testid={STUDY.SESSION.DIFFICULTY.MEDIUM}>
                Średnia
              </button>
              <button data-testid={STUDY.SESSION.DIFFICULTY.EASY}>
                Łatwa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Przykład 6: Komponent podsumowania sesji nauki
export function StudySummary() {
  return (
    <div data-testid={STUDY.SUMMARY.CONTAINER}>
      <h2>Podsumowanie sesji</h2>
      
      <div data-testid={STUDY.SUMMARY.STATS}>
        <div>Liczba fiszek: 10</div>
        <div>Poprawne odpowiedzi: 7</div>
        <div>Czas nauki: 5 min</div>
      </div>
      
      <div>
        <div>
          Poziom 1 (Trudne): 
          <span data-testid={STUDY.SUMMARY.LEVEL_1_COUNT}>3</span>
        </div>
        <div>
          Poziom 2 (Średnie): 
          <span data-testid={STUDY.SUMMARY.LEVEL_2_COUNT}>4</span>
        </div>
        <div>
          Poziom 3 (Łatwe): 
          <span data-testid={STUDY.SUMMARY.LEVEL_3_COUNT}>3</span>
        </div>
      </div>
      
      <button data-testid={STUDY.SUMMARY.FINISH_BUTTON}>
        Zakończ
      </button>
    </div>
  );
} 