import { type Generator } from '../generator.interface';
import { WikiGeneratorResult } from './result.interface';

export class WikiGenerator implements Generator<WikiGeneratorResult> {
  async generate() {
    const response = await fetch('https://genshin-impact.fandom.com/wiki/Special:Random', { redirect: 'manual' });
    const url = response.headers.get('Location');
    if (!url) {
      throw new Error('No redirect URL found');
    }
    const rawTitle = this.extractTitle(url);
    if (!rawTitle) {
      throw new Error('Could not extract title from URL');
    }
    return { title: rawTitle };
  }

  private extractTitle(url: string): string {
    // Match everything after /wiki/ up to ? or #
    const m = url.match(/\/wiki\/([^?#]+)/i);
    if (!m || !m[1]) return '';
    let slug = m[1];
    // remove trailing slashes
    slug = slug.replace(/\/+$/, '');
    try {
      slug = decodeURIComponent(slug);
    } catch {}
    // replace underscores with spaces for readability
    return slug.replace(/_/g, ' ');
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
    // collapse whitespace and trim
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  }
}
