import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ checked, onChange, className, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="peer hidden"
          ref={ref}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 rounded border border-gray-300 flex items-center justify-center transition-colors',
            checked ? 'bg-purple-700 border-purple-700' : '',
            className
          )}
        >
          <Check
            className={cn(
              'h-3 w-3 text-white',
              !checked && 'invisible'
            )}
            strokeWidth={3}
          />
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
