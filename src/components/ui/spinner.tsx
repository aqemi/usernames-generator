/**
 * shadcn `base-nova` registry component.
 *
 * Style classes vs the registry original: no differences — `size-4` and `animate-spin` is
 * carried over verbatim.
 */
import { cn } from 'cn';
import { Loader2Icon } from 'lucide-react';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
