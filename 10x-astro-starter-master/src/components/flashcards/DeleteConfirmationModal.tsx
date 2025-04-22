import React from 'react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  flashcardId: number | null;
  flashcardFront: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal potwierdzenia usunięcia fiszki
 */
export default function DeleteConfirmationModal({
  isOpen,
  flashcardId,
  flashcardFront,
  onConfirm,
  onCancel
}: DeleteConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onCancel}
      ></div>
      
      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Potwierdź usunięcie</h2>
        
        <p className="mb-6">
          Czy na pewno chcesz usunąć tę fiszkę?
        </p>
        
        <div className="bg-muted/50 p-3 rounded-md mb-6">
          <p className="font-medium">{flashcardFront}</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Anuluj
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Usuń
          </Button>
        </div>
      </div>
    </>
  );
} 