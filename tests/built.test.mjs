import test from 'node:test';import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
test('built Cloudflare Worker runs without Node fs dependencies',async()=>{if(!existsSync(new URL('../dist/worker.mjs',import.meta.url)))throw Error('Build first');const {default:worker}=await import('../dist/worker.mjs');const response=await worker.fetch(new Request('https://test.scholarz.invalid/applymate/google-ai-courses-free-2026'));assert.equal(response.status,200);assert.match(await response.text(),/Google AI Courses 2026/)});
