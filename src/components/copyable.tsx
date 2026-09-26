'use client';

import * as React from 'react';
import { Check, ClipboardCopy } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTooltip } from '@/hooks/useTooltip';
import { Button } from './ui/button';

export interface CopyableProps {
  value: string;
  className?: string;
}

const Copyable = React.forwardRef<HTMLButtonElement, CopyableProps>(({ className, value }, ref) => {
  // The hook keeps a single tooltip open across all instances; the local flag
  // drives this button's own checkmark, which outlives the shared tooltip.
  const { isVisible, displayTooltip } = useTooltip();
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard access can fail on insecure origins or when permission is
      // denied — stay silent rather than claiming a copy that did not happen.
      return;
    }
    displayTooltip();
    setCopied(true);
  };

  return (
    <Tooltip open={isVisible}>
      <TooltipTrigger
        render={
          <Button
            ref={ref}
            variant="outline"
            size="lg"
            onClick={copy}
            aria-label={`Copy ${value}`}
            // `shrink` overrides the button variant's `shrink-0`; without it the
            // button keeps its content width and overflows the card.
            className={cn('min-w-0 shrink', className)}
          />
        }
      >
        {/* min-w-0: as a flex child of the button this defaults to min-width:auto,
            which would keep it at full text width and defeat `truncate`. */}
        <span className="min-w-0 truncate">{value}</span>
        {copied ? (
          <Check className="shrink-0 h-4 w-4 text-(--neon-green)" aria-hidden />
        ) : (
          <ClipboardCopy className="shrink-0 h-4 w-4" aria-hidden />
        )}
        {/* The tooltip is decorative feedback; assistive tech gets this instead. */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? 'Copied' : ''}
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={5} side="bottom" align="end">
        Copied!
      </TooltipContent>
    </Tooltip>
  );
});

Copyable.displayName = 'Copyable';

export { Copyable };
