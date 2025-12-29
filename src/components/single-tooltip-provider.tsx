import React from 'react';

interface SingleTooltipContext {
  openTooltipId?: string | null;
  setOpenTooltipId: (x: string | null) => void;
}

export const SingleTooltipContext = React.createContext<SingleTooltipContext>({
  setOpenTooltipId: () => {},
});

export const SingleTooltipProvider = ({ children, ...props }: React.PropsWithChildren) => {
  const [openTooltipId, setOpenTooltipId] = React.useState<string | null>(null);
  const timeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // hide tooltip when the user clicks anywhere in the document
  React.useEffect(() => {
    const handleDocClick = (event: Event) => {
      const path = (event.composedPath && event.composedPath()) || (event as any).path || [event.target];
      for (const node of path) {
        if (node instanceof Element && node.hasAttribute && node.hasAttribute('aria-describedby')) return;
      }

      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      setOpenTooltipId(null);
    };

    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  const setOpenTooltip = React.useCallback((id: string | null) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setOpenTooltipId(id);
    timeout.current = setTimeout(() => setOpenTooltipId(null), 2000);
  }, []);

  return (
    <SingleTooltipContext.Provider value={{ openTooltipId, setOpenTooltipId: setOpenTooltip }}>
      {children}
    </SingleTooltipContext.Provider>
  );
};
