import { Mistral } from '@mistralai/mistralai';
import { type Generator } from '../generator.interface';
import { type GachaGeneratorResult } from './result.interface';
import { randomElements } from '@/lib/utils';

export class GachaGenerator implements Generator<GachaGeneratorResult> {
  async generate() {
    const mistral = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });
    const { choices } = await mistral.agents.complete({
      agentId: process.env.GACHA_AGENT_ID!,
      messages: [{ role: 'user', content: `Generate 50 items as JSON array of strings. Random seed: ${crypto.randomUUID()}` }],
      responseFormat: { type: 'json_object' },
    });

    const content = choices?.[0].message?.content;
    if (typeof content === 'string') {
      const parsed = this.parseAiResponse(content);
      return {
        items: randomElements(parsed, 3),
      };
    } else {
      throw new Error(`Error parsing AI response: content is not a string ${content}`);
    }
  }

  private parseAiResponse(response: string): string[] {
    try {
      const parsed = JSON.parse(response);
      if (!this.validateAiResponse(parsed)) {
        throw new Error(`Invalid AI response ${response}`);
      }
      return parsed;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error(`Error parsing AI response ${response}`);
    }
  }

  private validateAiResponse(response: string[]): boolean {
    return Array.isArray(response) && response.every((item) => typeof item === 'string');
  }
}
