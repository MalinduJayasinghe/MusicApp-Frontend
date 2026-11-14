import React, { type InputHTMLAttributes } from "react"

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-neutral-200 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2.5 text-sm text-white placeholder-neutral-500 bg-neutral-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 transition ${
          error ? "border-rose-500" : "border-neutral-700 focus:border-brand"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  )
}
