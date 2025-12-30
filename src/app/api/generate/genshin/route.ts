import { WikiGenerator } from '@/generators/wiki/wiki.generator';

export async function GET() {
  const data = await new WikiGenerator().generate();
  return Response.json(data);
}

export const dynamic = 'force-dynamic';
