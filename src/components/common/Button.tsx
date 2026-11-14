import React, { type ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-full"

  const variants = {
    primary: "bg-brand text-black hover:bg-[#3be477] hover:scale-[1.02]",
    secondary: "bg-white text-black hover:bg-neutral-200 hover:scale-[1.02]",
    danger: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
    ghost: "bg-transparent text-neutral-300 hover:text-white hover:bg-white/10"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-3.5 h-3.5 mr-2 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  )
}
