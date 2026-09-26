import { HudBackdrop } from '@/components/hud-backdrop';
import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/ui/github-icon';

import { AnimeGenerator } from '@/generators/anime/anime.generator';
import { BibleGenerator } from '@/generators/bible/bible.generator';
import { ElasticGenerator } from '@/generators/elastic/elastic.generator';
import { UuidGenerator } from '@/generators/uuid/uuid.generator';
import { VT323 } from 'next/font/google';
import Image from 'next/image';
import { GeneratorPanel, GeneratorPanelProps } from './generator-panel';

import logo from './logo.webp';

const font = VT323({ weight: '400', subsets: ['latin'] });

export default async function Home() {
  const generatedValues: GeneratorPanelProps = {
    anime: await new AnimeGenerator().generate(),
    bible: await new BibleGenerator().generate(),
    elastic: await new ElasticGenerator().generate(),
    gacha: { items: [] },
    uuid: await new UuidGenerator().generate(),
  };
  return (
    <>
      <HudBackdrop />
      <header className="relative z-10 grow basis-1/5 flex items-start justify-end space-x-4">
          <Button variant="ghost" size="icon" aria-labelledby="ghlink">
            <a href="https://github.com/aqemi/usernames-generator" target="_blank" aria-label="Github" id="ghlink">
              <GithubIcon />
            </a>
          </Button>
          <ThemeSwitch />
      </header>
      <main className="relative z-10 grow basis-3/5 flex flex-col items-center gap-2">
        <section className="grow basis-1/5 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 text-4xl xs:text-5xl sm:text-6xl md:text-7xl">
            <Image src={logo} alt="" loading="eager" className="sw-sticker h-[1.1em] w-auto shrink-0" />
            <h1
              className={`glitch ${font.className} scroll-m-20 font-extrabold tracking-tight whitespace-nowrap uppercase`}
            >
              usernames generator
              <span className="glitch-layer cyan" aria-hidden="true">
                usernames generator
              </span>
              <span className="glitch-layer primary" aria-hidden="true">
                usernames generator
              </span>
            </h1>
          </div>
          <p className="flex items-center gap-2 text-xs tracking-[.32em] uppercase text-(--cyan)">
            <span className="hud-dot" />
            銀の狼 &middot; Silver Wolf Protocol
          </p>
        </section>
        <div className="relative w-full md:w-175">
          <GeneratorPanel
            {...generatedValues}
            className="hud-panel w-full ring-primary/25 shadow-[0_0_40px_-12px_color-mix(in_oklch,var(--primary)_50%,transparent)]"
          />
        </div>
        <section className="grow basis-1/5"></section>
      </main>
      <footer className="relative z-10 grow basis-1/5"></footer>
    </>
  );
}

export const dynamic = 'force-dynamic';
