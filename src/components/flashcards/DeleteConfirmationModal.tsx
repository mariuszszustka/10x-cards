import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

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
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={() => onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć tę fiszkę?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-muted/50 p-3 rounded-md mb-6">
          <p className="font-medium">{flashcardFront}</p>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} data-testid="cancel-delete-button">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="confirm-delete-button">
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
