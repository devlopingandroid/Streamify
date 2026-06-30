import React, { forwardRef } from "react";

export const InputField = forwardRef(
  ({ label, error, containerClassName = "", id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        <label htmlFor={inputId} className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-slate-900 border text-slate-100 rounded-lg px-4 py-2 text-sm h-10 transition-all duration-150 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] ${
            error ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.15)]" : "border-slate-800"
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <span id={`${inputId}-error`} className="text-xs text-red-500 animate-fade-in" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
