import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  rows?: number;
}

/**
 * Atomic input field with optional label and error message.
 * Pass `type="textarea"` to render a <textarea> instead of <input>.
 * All standard input/textarea attributes are forwarded.
 */
export default function Input({ label, errorMessage, type = 'text', rows, className, ...rest }: InputProps) {
  const fieldClass = [
    'w-full px-4 py-2 border rounded-lg transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary/30',
    'disabled:bg-gray-50 disabled:text-gray-400',
    errorMessage ? 'border-red-400' : 'border-gray-300',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      {type === 'textarea' ? (
        <textarea
          rows={rows ?? 3}
          className={fieldClass}
          {...(rest as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input type={type} className={fieldClass} {...rest} />
      )}
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
