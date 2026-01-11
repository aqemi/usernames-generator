import { VT323 } from 'next/font/google';
import { useCallback, useState, type ReactNode } from 'react';
import { RefreshCcw, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from './ui/spinner';

interface GeneratorProps {
  title: string;
  onRegenerate: () => void | Promise<void>;
  children?: ReactNode;
}

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
        size="icon"
        className="shrink-0 md:ml-auto md:order-last"
        aria-label="Regenerate"
        disabled={isGenerating}
      >
        {!isGenerating ? <RefreshCcw className="h-4 w-4" /> : <Spinner />}
      </Button>
      {children ||
        (!isGenerating ? (
          <Button variant="outline" onClick={onRegenerateWrapper} aria-label="Click to generate">
            Click to generate <Sparkles className="h-4 w-4" />
          </Button>
        ) : (
          <div className="text-sm">Generating...</div>
        ))}
    </section>
  );
}
