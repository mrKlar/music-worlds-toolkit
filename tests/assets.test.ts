import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {describe, expect, it} from 'vitest';
import manifest from '../textures.json' with {type: 'json'};

describe('CC0 texture assets', () => {
  it('ships exactly the files recorded by size and SHA-256', async () => {
    expect(manifest).toHaveLength(15);
    for (const entry of manifest) {
      expect(entry.file).toMatch(/^assets\/textures\/[^/]+\.jpg$/);
      expect(entry.license).toBe('CC0');
      expect(entry.source).toMatch(/^https:\/\/polyhaven\.com\/a\//);
      const bytes = await readFile(new URL(`../${entry.file}`, import.meta.url));
      expect(bytes).toHaveLength(entry.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(entry.sha256);
    }
  });
});
