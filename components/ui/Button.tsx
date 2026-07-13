import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-forest-dark hover:bg-gold-dark transition-colors",
  secondary:
    "bg-forest text-white hover:bg-forest-light transition-colors",
  outline:
    "border-2 border-white text-white hover:bg-white/10 transition-colors",
  ghost:
    "border border-forest text-forest hover:bg-forest hover:text-white transition-colors",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const styles = `inline-flex items-center justify-center rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles}
          aria-disabled={disabled}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={styles} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={styles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
