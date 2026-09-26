import { VT323 } from 'next/font/google';
import { Children, useCallback, useState, type ReactNode } from 'react';
import { RefreshCcw, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from './ui/spinner';

interface GeneratorProps {
  title: string;
  onRegenerate: () => void | Promise<void>;
  children?: ReactNode;
}

// Widths cycle so a row of placeholders reads like values of differing length
// rather than a set of identical bars.
const SKELETON_WIDTHS = ['w-32', 'w-40', 'w-28'];

const font = VT323({ weight: '400', subsets: ['latin'] });

export function Generator({ title, children, onRegenerate }: GeneratorProps) {
  const [isGenerating, setGenerating] = useState(false);
  const onRegenerateWrapper = useCallback(async () => {
    try {
      setGenerating(true);
      await onRegenerate();
    } finally {
      setGenerating(false);
    }
  }, [onRegenerate]);
  return (
    <section className="flex items-center gap-4 group flex-wrap md:flex-nowrap">
      <h3 className={`${font.className} scroll-m-20 text-4xl tracking-tight min-w-[calc(100%-3.5rem)] md:min-w-24`}>
        {title}
      </h3>
      <Button
        variant="default"
        onClick={onRegenerateWrapper}
        size="icon-lg"
        className="shrink-0 md:ml-auto md:order-last"
        aria-label="Regenerate"
        disabled={isGenerating}
      >
        {!isGenerating ? <RefreshCcw className="h-4 w-4" /> : <Spinner />}
      </Button>
      {isGenerating
        ? Array.from({ length: Math.max(Children.count(children), 1) }, (_, index) => (
            <Skeleton key={index} className={`h-9 ${SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]}`} />
          ))
        : children || (
            <Button variant="outline" size="lg" onClick={onRegenerateWrapper} aria-label="Click to generate">
              Click to generate <Sparkles className="h-4 w-4" />
            </Button>
          )}
    </section>
  );
}
