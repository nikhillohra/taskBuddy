import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";

// Style variants
const toggleGroupVariants = cva(
  "inline-flex items-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const toggleGroupItemVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants> {
  type: "single";
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(toggleGroupVariants(), className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<ToggleGroupItemProps>(child)) return null;

          return React.cloneElement(child, {
            selected: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        })}
      </div>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleGroupItemVariants> {
  value: string;
  selected?: boolean;
}

export const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ className, selected, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={clsx(toggleGroupItemVariants(), className)}
    data-state={selected ? "on" : "off"}
    {...props}
  />
));
ToggleGroupItem.displayName = "ToggleGroupItem";
