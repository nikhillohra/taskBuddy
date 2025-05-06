import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-md font-medium transition-colors",
          variant === "default" &&
            "bg-purple-700 text-white hover:bg-purple-800",
          variant === "outline" && "border border-gray-300 hover:bg-gray-100",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
