/**
 * shadcn `base-nova` registry component.
 *
 * Style classes vs the registry original — the stock pulse is replaced with a
 * sweeping highlight band:
 *
 *   REMOVED  animate-pulse
 *     Stock behaviour: the whole block fades 100% -> 50% -> 100% opacity.
 *
 *   ADDED    bg-linear-[90deg,transparent_0%,var(--color-foreground)_50%,transparent_100%]
 *            bg-size-[200%_100%]
 *            bg-blend-overlay
 *            opacity-70
 *            animate-shimmer
 *     A horizontal gradient whose bright midpoint is the foreground colour is
 *     laid over `bg-muted` and blended with it. The background is sized to
 *     200% of the element so there is off-screen track either side, and
 *     `animate-shimmer` slides background-position from 200% to -200%, sweeping
 *     the band across. Requires `--animate-shimmer` in globals.css; without it
 *     the gradient renders as a static stripe rather than animating.
 *
 *   ADDED    motion-reduce:animate-none
 *     Stock `animate-pulse` has no reduced-motion guard, so this is also an
 *     accessibility fix rather than purely cosmetic.
 */
import { cn } from 'cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-md bg-muted bg-size-[200%_100%] bg-linear-[90deg,transparent_0%,var(--color-foreground)_50%,transparent_100%] bg-blend-overlay opacity-70 animate-shimmer motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
