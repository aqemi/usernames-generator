import { type Generator } from '../generator.interface';
import { WikiGeneratorResult } from './result.interface';

type Options = {
  hostname: string;
};

export class WikiGenerator implements Generator<WikiGeneratorResult> {
  constructor(private readonly options: Options) {}
  async generate() {
    const response = await fetch(
      `https://${this.options.hostname}/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json`,
    );
    if (!response.ok) {
      throw new Error(`MediaWiki API error: ${response.status}`);
    }
    const data = await response.json();
    const title: string | undefined = data?.query?.random?.[0]?.title;
    if (!title) {
      throw new Error('No random page returned from API');
    }
    return { title: this.cleanTitle(title) };
  }

  private cleanTitle(title: string): string {
    let t = title.split('/').shift() ?? title;
    // If there's a colon, take the part after the first colon
    const idx = t.indexOf(':');
    if (idx !== -1) {
      t = t.slice(idx + 1);
    }
    // remove parenthetical content
    t = t.replace(/\s*\([^)]*\)\s*/g, ' ');
    // trim surrounding quotes
    t = t.replace(/^["'""''«»]+|["'""''«»]+$/g, '');
    // collapse whitespace and trim
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  }
}
