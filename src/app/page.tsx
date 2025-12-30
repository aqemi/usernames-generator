import { Github } from 'lucide-react';

import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';

import { AnimeGenerator } from '@/generators/anime/anime.generator';
import { BibleGenerator } from '@/generators/bible/bible.generator';
import { ElasticGenerator } from '@/generators/elastic/elastic.generator';
import { UuidGenerator } from '@/generators/uuid/uuid.generator';
import { VT323 } from 'next/font/google';
import Image from 'next/image';
import { WikiGenerator } from '../generators/wiki/wiki.generator';
import { GeneratorPanel, GeneratorPanelProps } from './generator-panel';

import logo from './logo.png';

const font = VT323({ weight: '400', subsets: ['latin'] });

export default async function Home() {
  const generatedValues: GeneratorPanelProps = {
    anime: await new AnimeGenerator().generate(),
    bible: await new BibleGenerator().generate(),
    elastic: await new ElasticGenerator().generate(),
    gacha: { items: [] },
    uuid: await new UuidGenerator().generate(),
    wiki: await new WikiGenerator().generate(),
  };
  return (
    <>
      <header className="grow basis-1/5 flex items-start justify-end space-x-4">
        <Button variant="ghost" size="icon" aria-labelledby="ghlink">
          <a href="https://github.com/aqemi/username-generator" target="_blank" aria-label="Github" id="ghlink">
            <Github />
          </a>
        </Button>
        <ThemeSwitch />
      </header>
      <main className="grow basis-3/5 flex flex-col items-center">
        <section className="grow basis-0 content-end">
          <div className="flex items-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 text-4xl xs:text-5xl sm:text-6xl md:text-7xl">
            <Image src={logo} alt="chibi" className="h-[1.2em] w-auto" />
            <h1
              className={`${font.className} scroll-m-20 font-extrabold tracking-tight whitespace-nowrap uppercase flex items-center relative top-0.5 xs:top-1 md:top-1.5`}
            >
              usernames generator
            </h1>
          </div>
        </section>
        <GeneratorPanel {...generatedValues} className="w-full md:w-175" />
        <section className="grow basis-0"></section>
      </main>
      <footer className="grow basis-1/5"></footer>
    </>
  );
}

export const dynamic = 'force-dynamic';
