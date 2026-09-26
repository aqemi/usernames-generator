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
    // Base article only — `Citlali/Gallery`, `Paimon's Bargains/2024-02-01` and
    // friends are subpages whose suffix is navigation, not part of the name.
    let t = title.split('/').shift() ?? title;

    // Parentheticals go FIRST, before any colon handling. Disambiguators can
    // themselves contain colons ("Divine Ingenuity: Collector's Chapter"), and
    // splitting on those before removing them strands the closing bracket.
    // Looped because removal can bring two parentheticals together.
    let previous: string;
    do {
      previous = t;
      t = t.replace(/\s*\([^()]*\)\s*/g, ' ');
    } while (t !== previous);

    // A quoted span after a separator IS the name — the part before it is a
    // category label ("Witch Statue: ", "Companion Gift - "). Achievement pages
    // are often nothing but the quoted name.
    const quoted = t.match(/^\s*(?:.*?[:\-–—]\s*)?["'“”‘’«»](.+?)["'“”‘’«»]\s*$/);
    if (quoted?.[1]?.trim()) {
      t = quoted[1];
    }

    // Runs after the quote step, not instead of it: a fully-quoted title can
    // still carry a category prefix inside the quotes.
    const idx = t.indexOf(':');
    if (idx !== -1) {
      const before = t.slice(0, idx).trim();
      const after = t.slice(idx + 1).trim();
      // Normally the prefix is the category and the suffix is the name, but for
      // enumerated pages the suffix is a bare ordinal ("IV", "Part II") that
      // makes a meaningless username. Keep the descriptive side.
      const ordinalOnly = /^(?:part|tier|vol\.?|chapter|act|stage|phase|no\.?|episode)?\s*[ivxlcdm\d]+$/i;
      t = ordinalOnly.test(after) && before ? before : after || before;
    }

    // Any double quotes still present are unbalanced or decorative, so drop
    // them. Single quotes are deliberately left alone: in this corpus they are
    // overwhelmingly possessives ("Researcher's", "The Moongrass'"), and
    // stripping trailing ones would corrupt plural possessives.
    t = t.replace(/["“”«»]/g, '');

    // Collapse whitespace, then shed punctuation left stranded at either end.
    t = t.replace(/\s+/g, ' ').trim();
    t = t.replace(/^[-–—,.:;!?\s]+|[-–—,:;\s]+$/g, '');

    // Never return something emptier than we started with.
    return t || title;
  }
}
