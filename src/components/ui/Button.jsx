import React from "react";

export const Button = ({
  children,
  variant = "solid",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  // Variant mapping using tailwind classes
  const variants = {
    solid: "bg-gradient-to-r from-brand-cyan to-brand-indigo text-slate-950 font-medium shadow-md hover:opacity-90 hover:scale-[1.01] hover:shadow-cyan-500/20 active:scale-[0.99]",
    outline: "border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-brand-cyan hover:text-brand-cyan",
    ghost: "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
    danger: "bg-red-500/10 border border-red-500/25 text-red-500 hover:bg-red-500 hover:text-slate-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-brand-cyan focus-visible:outline-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-label="Loading..." />
      ) : null}
      <span className={isLoading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};
export default Button;
