import React from "react";

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  testId?: string;
}

export function InputField({
  id,
  name,
  type,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  testId,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-blue-100 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
        placeholder={placeholder}
        data-testid={testId}
        style={{ caretColor: "transparent" }}
      />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  testId?: string;
}

export function CheckboxField({ id, name, label, checked, onChange, error, testId }: CheckboxFieldProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 bg-blue-800 border-blue-600 rounded focus:ring-blue-500"
          data-testid={testId}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="text-blue-100">
          {label}
        </label>
        {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
}

interface FormErrorProps {
  error?: string;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-md">
      <p className="text-sm text-red-300">{error}</p>
    </div>
  );
}

interface DebugInfoProps {
  info: any;
}

export function DebugInfo({ info }: DebugInfoProps) {
  if (!info) return null;

  return (
    <div className="bg-gray-500/20 border border-gray-500/30 p-3 rounded-md text-xs">
      <p>Status: {info.status}</p>
      <pre>{JSON.stringify(info.data, null, 2)}</pre>
    </div>
  );
}

interface SuccessMessageProps {
  title: string;
  message: string;
  actionLink?: {
    text: string;
    href: string;
  };
  onBackClick?: () => void;
}

export function SuccessMessage({ title, message, actionLink, onBackClick }: SuccessMessageProps) {
  return (
    <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-4">{message}</p>

      {actionLink && (
        <a href={actionLink.href} className="text-blue-400 hover:text-blue-300 font-medium">
          {actionLink.text}
        </a>
      )}

      {onBackClick && (
        <button onClick={onBackClick} className="text-blue-400 hover:text-blue-300 font-medium">
          Powrót do formularza
        </button>
      )}
    </div>
  );
}
