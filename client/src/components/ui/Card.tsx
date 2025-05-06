import { ComponentPropsWithRef, forwardRef } from "react";
import clsx from "clsx";

type CardProps = ComponentPropsWithRef<"div"> & {
  shadow?: "sm" | "md" | "lg";
};

const shadowClasses = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, shadow = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-white rounded-xl border border-gray-200",
          shadowClasses[shadow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
