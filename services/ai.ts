// Direct Claude API calls.
// NOTE: VITE_CLAUDE_API_KEY is exposed client-side in this MVP.
// For production, proxy these calls through a Supabase Edge Function.

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

async function callClaude(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) throw new Error('VITE_CLAUDE_API_KEY is not set in .env.local');

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || 'AI request failed');
  }

  const data = await response.json();
  return (data.content as Array<{ type: string; text: string }>)[0].text;
}

function parseJsonResponse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as T;
  } catch {
    return fallback;
  }
}

// ── Bio Writer ────────────────────────────────────────────────────────────────

export type BioTone = 'professional' | 'casual' | 'funny' | 'bold' | 'minimal';

export async function generateBios(input: {
  profession: string;
  keywords: string;
  tone: BioTone;
}): Promise<string[]> {
  const system = `You are a professional bio writer for Indian creators, coaches, and entrepreneurs.
You write short, punchy bio page descriptions (2-3 lines max each).
You understand Indian context — regional pride, startup culture, coaching, content creation.
Always write in English but make it feel warm and relatable.
Return ONLY a JSON array of 5 bio strings. No explanation, no markdown outside the JSON.`;

  const prompt = `Write 5 different bios for:
Profession: ${input.profession}
Keywords/USP: ${input.keywords || 'none given'}
Preferred tone: ${input.tone}

Each bio should be 2-3 lines. Make them distinct from each other.
Return as JSON array: ["bio1", "bio2", "bio3", "bio4", "bio5"]`;

  const raw = await callClaude(prompt, system);
  return parseJsonResponse<string[]>(raw, [raw]);
}

// ── Page Roast ────────────────────────────────────────────────────────────────

export interface RoastResult {
  score: number;
  issues: string[];
  fixes: string[];
}

export async function roastPage(pageData: {
  bio: string;
  blockTypes: string[];
  totalBlocks: number;
}): Promise<RoastResult> {
  const system = `You are a brutally honest but helpful bio page consultant for Indian creators.
You review link-in-bio pages and give specific, actionable feedback.
Be direct. No fluff. Point out real problems.
Return ONLY valid JSON. No text outside the JSON object.`;

  const prompt = `Review this ProfileFlow bio page:
Bio text: "${pageData.bio || '(empty)'}"
Number of blocks: ${pageData.totalBlocks}
Block types used: ${pageData.blockTypes.join(', ') || 'none'}

Score out of 10 and list 3 specific problems and 3 specific fixes.
Return as JSON: { "score": 7, "issues": ["issue1", "issue2", "issue3"], "fixes": ["fix1", "fix2", "fix3"] }`;

  const raw = await callClaude(prompt, system);
  return parseJsonResponse<RoastResult>(raw, {
    score: 5,
    issues: ['Could not analyse page'],
    fixes: ['Try again'],
  });
}

// ── Headline Generator ────────────────────────────────────────────────────────

export async function generateHeadlines(input: {
  profession: string;
  audience: string;
}): Promise<string[]> {
  const system = `You generate catchy one-liner headlines for Indian creator bio pages.
Headlines should be 5-10 words. Punchy. Memorable. Use active voice.
Return ONLY a JSON array of 8 headline strings. No markdown, no explanation.`;

  const prompt = `Generate 8 catchy one-line headlines for:
Profession: ${input.profession}
Target audience: ${input.audience}

Return as JSON array: ["headline1", "headline2", ...]`;

  const raw = await callClaude(prompt, system);
  return parseJsonResponse<string[]>(raw, ['Your page headline here']);
}

// ── Link Title Writer ─────────────────────────────────────────────────────────

export async function generateLinkTitle(url: string): Promise<string> {
  const system = `You write short, catchy link titles for bio pages.
5-7 words max. Add one relevant emoji at the start.
Return ONLY the title string. Nothing else.`;

  const prompt = `Write a catchy link title for this URL: ${url}
If you cannot access the URL, make a good guess from the URL path itself.
Example output: "📱 Free Workout Plan PDF"`;

  return callClaude(prompt, system);
}
