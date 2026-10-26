import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete = 'off',
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition ${
          error
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:bg-white text-red-900'
            : 'border-zinc-300 bg-white focus:border-zinc-500 text-zinc-900'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
