import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { FlashcardDTO } from "@/types";

interface EditableFlashcardProps {
  flashcard: FlashcardDTO;
  onSave: (data: { front: string; back: string }) => void;
  onCancel: () => void;
}

/**
 * Komponent edytowalnej fiszki
 */
export default function EditableFlashcard({ flashcard, onSave, onCancel }: EditableFlashcardProps) {
  // Stan formularza
  const [formData, setFormData] = useState({
    front: flashcard.front,
    back: flashcard.back,
  });

  // Stan błędów walidacji
  const [errors, setErrors] = useState({
    front: "",
    back: "",
  });

  // Reset formularza jeśli zmienia się edytowana fiszka
  useEffect(() => {
    setFormData({
      front: flashcard.front,
      back: flashcard.back,
    });
    setErrors({
      front: "",
      back: "",
    });
  }, [flashcard]);

  // Obsługa zmiany pól formularza
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Walidacja
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "To pole jest wymagane",
      }));
    } else if (value.length > 500) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Tekst nie może przekraczać 500 znaków",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, []);

  // Obsługa zapisu fiszki
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Walidacja przed zapisem
      const newErrors = {
        front: "",
        back: "",
      };

      if (!formData.front.trim()) {
        newErrors.front = "To pole jest wymagane";
      }

      if (!formData.back.trim()) {
        newErrors.back = "To pole jest wymagane";
      }

      if (newErrors.front || newErrors.back) {
        setErrors(newErrors);
        return;
      }

      onSave(formData);
    },
    [formData, onSave]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 h-64 flex flex-col bg-slate-100 shadow-sm hover:shadow-md"
    >
      <div className="mb-3">
        <label htmlFor="front" className="block text-sm font-medium mb-1 text-foreground">
          Przód
        </label>
        <textarea
          id="front"
          name="front"
          value={formData.front}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md text-foreground bg-white resize-none ${
            errors.front ? "border-destructive" : "border-input"
          }`}
          style={{ height: "60px" }}
          aria-invalid={!!errors.front}
          aria-describedby={errors.front ? "front-error" : undefined}
        />
        {errors.front && (
          <p id="front-error" className="text-sm text-destructive mt-1">
            {errors.front}
          </p>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="back" className="block text-sm font-medium mb-1 text-foreground">
          Tył
        </label>
        <textarea
          id="back"
          name="back"
          value={formData.back}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md text-foreground bg-white resize-none ${
            errors.back ? "border-destructive" : "border-input"
          }`}
          style={{ height: "60px" }}
          aria-invalid={!!errors.back}
          aria-describedby={errors.back ? "back-error" : undefined}
        />
        {errors.back && (
          <p id="back-error" className="text-sm text-destructive mt-1">
            {errors.back}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-white text-foreground hover:bg-slate-200"
        >
          Anuluj
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Zapisz
        </Button>
      </div>
    </form>
  );
}
