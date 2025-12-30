import * as React from 'react';
import { ClipboardCopy } from 'lucide-react';
import { type MouseEventHandler } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTooltip } from '@/hooks/useTooltip';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Copyable = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, value, ...props }, ref) => {
  const { isVisible, displayTooltip } = useTooltip();

  const copy: MouseEventHandler = (event) => {
    navigator.clipboard.writeText(value as string);
    displayTooltip();
  };

  return (
    <Tooltip open={isVisible}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex items-center h-10 px-3 space-x-1 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm cursor-pointer selection:bg-amber-900 min-w-0',
            className
          )}
          aria-describedby=""
          onClick={copy}
          aria-label="Copy"
          {...props}
        >
          <div className={cn(`text-ellipsis overflow-hidden whitespace-nowrap`)}>{value}</div>
          <ClipboardCopy className="shrink-0 h-4 w-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent sideOffset={5} side="bottom" align="end">
        Copied!
      </TooltipContent>
    </Tooltip>
  );
});

Copyable.displayName = 'Copyable';

export { Copyable };
