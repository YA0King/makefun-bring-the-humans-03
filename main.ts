// bring-the-humans-03 entry (Node 22, standard library only).
//
// The entry itself is a short vertical video ad for make.fun, posted
// publicly on TikTok. This program only hands the video's address to
// the grader: it reads VIDEO.json from the repository root, checks it
// names a TikTok video, and writes it out byte for byte to the output
// directory, where the gate reads it. Nothing this program writes
// about the video is scored: the house reads the video itself from
// TikTok and ranks the entry by its views.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const raw = readFileSync(sourcePath, 'utf8');

const parsed: unknown = JSON.parse(raw);
const urlValue = (parsed as { url?: unknown } | null)?.url;
let url: URL | null = null;
try {
  url = typeof urlValue === 'string' ? new URL(urlValue) : null;
} catch {
  url = null;
}
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  url === null ||
  url.protocol !== 'https:' ||
  url.hostname !== 'www.tiktok.com' ||
  !url.pathname.startsWith('/@')
) {
  console.error(`VIDEO.json in ${BOT_DIR} does not name a TikTok video URL.`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'VIDEO.json'), raw);
