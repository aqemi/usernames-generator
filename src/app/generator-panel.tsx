'use client';

import React, { useCallback, useState } from 'react';
import { Copyable } from '@/components/copyable';
import { Generator } from '@/components/generator';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { type AnimeGeneratorResult } from '@/generators/anime/result.interface';
import { type BibleGeneratorResult } from '@/generators/bible/result.interface';
import { type ElasticGeneratorResult } from '@/generators/elastic/result.interface';
import { type GachaGeneratorResult } from '@/generators/gacha/result.interface';
import { type UuidGeneratorResult } from '@/generators/uuid/result.interface';
import { UuidGenerator } from '@/generators/uuid/uuid.generator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SingleTooltipProvider } from '../components/single-tooltip-provider';
import { WikiGeneratorResult } from '../generators/wiki/result.interface';

export interface GeneratorPanelProps {
  anime: AnimeGeneratorResult;
  bible: BibleGeneratorResult;
  elastic: ElasticGeneratorResult;
  gacha: GachaGeneratorResult;
  uuid: UuidGeneratorResult;
  wiki: WikiGeneratorResult;
  className?: string;
}

export const GeneratorPanel = React.memo(function GeneratorPanel(props: GeneratorPanelProps) {
  const [state, setState] = useState<GeneratorPanelProps>(() => props);

  const updateState = useCallback((newState: Partial<GeneratorPanelProps>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const regenerateRequest = useCallback(async <R = unknown,>(generator: string): Promise<R | null> => {
    try {
      const response = await fetch(`/api/generate/${generator}`);
      return await response.json();
    } catch (error) {
      console.error('Regeneration error:', error);
      toast.error('Uh oh! Something went wrong.', {
        description: 'There was a problem with your request.',
        dismissible: true,
      });
      return null;
    }
  }, []);

  const regenerateAnime = useCallback(async () => {
    const result = await regenerateRequest<AnimeGeneratorResult>('anime');
    if (result) updateState({ anime: result });
  }, [regenerateRequest, updateState]);

  const regenerateBible = useCallback(async () => {
    const result = await regenerateRequest<BibleGeneratorResult>('bible');
    if (result) updateState({ bible: result });
  }, [regenerateRequest, updateState]);

  const regenerateElastic = useCallback(async () => {
    const result = await regenerateRequest<ElasticGeneratorResult>('elastic');
    if (result) updateState({ elastic: result });
  }, [regenerateRequest, updateState]);

  const regenerateAi = useCallback(async () => {
    const result = await regenerateRequest<GachaGeneratorResult>('gacha');
    if (result) updateState({ gacha: result });
  }, [regenerateRequest, updateState]);

  const regenerateUuid = useCallback(async () => {
    const result = await new UuidGenerator().generate();
    updateState({ uuid: result });
  }, [updateState]);

  const regenerateWiki = useCallback(async () => {
    const result = await regenerateRequest<WikiGeneratorResult>('genshin');
    if (result) updateState({ wiki: result });
  }, [regenerateRequest, updateState]);

  // Layered glow: teal inner + pink mid/outer
  const glowShadow = [
    '0 0 15px oklch(from var(--accent) l c h / 0.65)',
    '0 0 40px oklch(from var(--primary) l c h / 0.3)',
    '0 0 80px oklch(from var(--primary) l c h / 0.15)',
  ].join(', ');

  return (
    <Card className={cn(props.className, 'border-accent/30')} style={{ boxShadow: glowShadow }}>
      <CardContent className="p-4 space-y-4">
        <SingleTooltipProvider>
          <TooltipProvider>
            <Generator title="Anime" onRegenerate={regenerateAnime}>
              <Copyable disabled type="text" value={state.anime.firstName} />
              <Copyable disabled type="text" value={state.anime.lastName} />
              <Copyable disabled type="text" value={state.anime.fullName} />
            </Generator>
            <Separator />
            <Generator title="Bible" onRegenerate={regenerateBible}>
              <Copyable disabled type="text" value={state.bible.name} />
            </Generator>
            <Separator />
            <Generator title="Neutral" onRegenerate={regenerateElastic}>
              <Copyable disabled type="text" value={state.elastic.name} />
            </Generator>
            <Separator />
            <Generator title="AI" onRegenerate={regenerateAi}>
              {state.gacha.items.length &&
                state.gacha.items.map((item) => <Copyable key={item} disabled type="text" value={item} />)}
            </Generator>
            <Separator />
            <Generator title="Genshin" onRegenerate={regenerateWiki}>
              <Copyable disabled type="text" value={state.wiki.title} />
            </Generator>
            <Separator />
            <Generator title="UUID" onRegenerate={regenerateUuid}>
              <Copyable disabled type="text" value={state.uuid.v4} />
              <Copyable disabled type="text" value={state.uuid.short} />
            </Generator>
          </TooltipProvider>
        </SingleTooltipProvider>
      </CardContent>
    </Card>
  );
});
