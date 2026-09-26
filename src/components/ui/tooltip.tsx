'use client';

/**
 * shadcn `base-nova` registry component.
 *
 * Style classes vs the registry original — the stock tooltip is an INVERTED
 * chip (`bg-foreground` / `text-background`), which in this theme renders as a
 * whitish block that ignores the palette. It is restyled as a HUD panel:
 *
 *   TooltipContent  REMOVED  bg-foreground, text-background
 *                   ADDED    text-popover-foreground
 *                            border border-transparent
 *                            [background:linear-gradient(var(--popover),var(--popover))_padding-box,
 *                                        linear-gradient(90deg,var(--cyan),var(--primary))_border-box]
 *     The two-layer background is the standard gradient-border trick: a flat
 *     `--popover` fill clipped to the padding box, and a cyan -> primary
 *     gradient clipped to the border box, revealed through the transparent
 *     1px border. `border-image` cannot be used instead — it does not follow
 *     `border-radius`, so the corners would square off.
 *
 *   TooltipPrimitive.Arrow  REMOVED ENTIRELY
 *     Deliberate, and it should stay removed — an arrow cannot be made to read
 *     cleanly against a gradient border:
 *       - Colour. The arrow's outline is a single flat value, but the border it
 *         has to continue is a gradient, so the two agree at exactly one
 *         x-offset. At `align="end"` (the only consumer, copyable.tsx) the
 *         arrow lands where the gradient has resolved to pure `--primary`, so
 *         any cyan-bearing mix reads as a bluer notch spliced onto a purple
 *         edge. CSS cannot sample a gradient at an element's own position, and
 *         that position shifts with `align` and with collision flipping.
 *       - Seam. The popup's border runs continuously behind the arrow rather
 *         than opening a gap for it, so the arrow's base crosses a line instead
 *         of joining it — a visible T-junction.
 *     Dropping it costs nothing here: the tooltip is decorative confirmation
 *     pinned to the button just clicked, so proximity alone makes the
 *     relationship clear.
 *
 * Depends on `--cyan`, defined in globals.css alongside `--neon-green`.
 * Regenerating with `--overwrite` reverts all of this AND reinstates the arrow.
 */

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from 'cn';

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-xs text-popover-foreground [background:linear-gradient(var(--popover),var(--popover))_padding-box,linear-gradient(90deg,var(--cyan),var(--primary))_border-box] has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
