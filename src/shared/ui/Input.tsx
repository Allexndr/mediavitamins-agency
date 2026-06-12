import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-xs font-bold text-on-surface-variant uppercase tracking-tight"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`w-full min-h-12 px-4 py-3 rounded-xl border bg-white outline-none transition-shadow
          focus:ring-2 focus:ring-primary/30 focus:border-primary
          ${error ? "border-error" : "border-outline-variant"}
          ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-on-surface-variant">
          {hint}
        </p>
      )}
    </div>
  );
}
