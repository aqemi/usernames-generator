'use client';

import { useState } from 'react';

import { Generator } from '@/components/generator';
import { Card, CardContent } from '@/components/ui/card';
import { Copyable } from '@/components/copyable';
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

interface GeneratorPanelProps {
  anime: AnimeGeneratorResult;
  bible: BibleGeneratorResult;
  elastic: ElasticGeneratorResult;
  gacha: GachaGeneratorResult;
  uuid: UuidGeneratorResult;
  className?: string;
}

export function GeneratorPanel(props: GeneratorPanelProps) {
  const [state, setState] = useState(props);
  const updateState = (newState: Partial<GeneratorPanelProps>) => setState({ ...state, ...newState });

  const regenerateRequest = async <R = unknown,>(
    generator: 'anime' | 'elastic' | 'bible' | 'gacha'
  ): Promise<R | null> => {
    try {
      const response = await fetch(`/api/generate/${generator}`);
      return await response.json();
    } catch (error) {
      toast.error('Uh oh! Something went wrong.', {
        description: 'There was a problem with your request.',
        dismissible: true,
      });
      return null;
    }
  };

  const regenerateAnime = async () => {
    const result = await regenerateRequest<AnimeGeneratorResult>('anime');
    result && updateState({ anime: result });
  };

  const regenerateBible = async () => {
    const result = await regenerateRequest<BibleGeneratorResult>('bible');
    result && updateState({ bible: result });
  };

  const regenerateElastic = async () => {
    const result = await regenerateRequest<ElasticGeneratorResult>('elastic');
    result && updateState({ elastic: result });
  };

  const regenerateAi = async () => {
    const result = await regenerateRequest<GachaGeneratorResult>('gacha');
    result && updateState({ gacha: result });
  };

  const regenerateUuid = async () => {
    const result = await new UuidGenerator().generate();
    updateState({ uuid: result });
  };

  return (
    <Card className={cn(props.className)}>
      <CardContent className="p-4 space-y-4">
        <SingleTooltipProvider>
          <TooltipProvider>
            <Generator title="anime" onRegenerate={regenerateAnime}>
              <Copyable disabled type="text" value={state.anime.firstName} />
              <Copyable disabled type="text" value={state.anime.lastName} />
              <Copyable disabled type="text" value={state.anime.fullName} />
            </Generator>
            <Separator></Separator>
            <Generator title="bible" onRegenerate={regenerateBible}>
              <Copyable disabled type="text" value={state.bible.name} />
            </Generator>
            <Separator></Separator>
            <Generator title="neutral" onRegenerate={regenerateElastic}>
              <Copyable disabled type="text" value={state.elastic.name} />
            </Generator>
            <Separator></Separator>
            <Generator title="ai" onRegenerate={regenerateAi}>
              {state.gacha.items.length &&
                state.gacha.items.map((item, index) => <Copyable key={index} disabled type="text" value={item} />)}
            </Generator>
            <Separator></Separator>
            <Generator title="uuid" onRegenerate={regenerateUuid}>
              <Copyable disabled type="text" value={state.uuid.v4} />
              <Copyable disabled type="text" value={state.uuid.short} />
            </Generator>
          </TooltipProvider>
        </SingleTooltipProvider>
      </CardContent>
    </Card>
  );
}
