import React, { useState } from 'react';
import CreationModeToggle from './CreationModeToggle';
import ManualFlashcardForm from './ManualFlashcardForm';
import AIGenerationContainer from './AIGenerationContainer';

/**
 * Enum dla trybów tworzenia fiszek
 */
export enum CreationMode {
  MANUAL = 'manual',
  AI = 'ai'
}

/**
 * Główny komponent widoku generowania fiszek
 */
export default function GenerateView() {
  // Stan dla aktualnego trybu tworzenia fiszek
  const [creationMode, setCreationMode] = useState<CreationMode>(CreationMode.MANUAL);
  
  // Obsługa zmiany trybu
  const handleModeChange = (mode: CreationMode) => {
    setCreationMode(mode);
  };

  // Obsługa ręcznego tworzenia fiszki
  const handleManualSubmit = async (flashcard: { front: string; back: string }) => {
    try {
      // Tutaj będzie implementacja wywołania API
      console.log('Zapisuję fiszkę:', flashcard);
    } catch (error) {
      console.error('Błąd podczas zapisywania fiszki:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Generowanie Fiszek</h1>
      
      {/* Przełącznik trybu tworzenia */}
      <div className="mb-8">
        <CreationModeToggle 
          currentMode={creationMode} 
          onChange={handleModeChange} 
        />
      </div>
      
      {/* Renderowanie odpowiedniego formularza zależnie od trybu */}
      {creationMode === CreationMode.MANUAL ? (
        <ManualFlashcardForm onSubmit={handleManualSubmit} />
      ) : (
        <AIGenerationContainer />
      )}
    </div>
  );
} 