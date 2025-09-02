import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onHide?: boolean;
  icon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, onHide, className = '', icon, type = 'text', value, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    return (
      <div className='mb-4'>
        <div className="relative">
          {/* Input */}
          <input
            ref={ref}
            type={type}
            value={value}
            {...rest}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`peer w-full py-3 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : ''
            } ${className}`}
            placeholder=" " // empty placeholder to enable floating label
          />

          {/* Floating Label */}
          {label && (
            <label
              className={`
                absolute left-3 text-gray-400 transition-all duration-200
                pointer-events-none bg-white px-1
                ${focused || hasValue
                  ? '-top-2 text-sm text-blue-500'
                  : 'top-3 text-gray-400 text-md'
                }
              `}
            >
              {label}
            </label>
          )}

          {/* Optional Icon */}
          {icon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {icon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
