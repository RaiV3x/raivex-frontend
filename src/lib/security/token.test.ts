import { describe, expect, it, vi, afterEach } from 'vitest';
import { generateToken, normalizeToken } from './token';
import { subscriptionUrl } from '../api/subscription';

afterEach(() => vi.restoreAllMocks());
describe('secure anonymous subscription tokens', () => {
  it('uses 32 bytes of browser cryptographic randomness', () => {
    const random = vi.spyOn(crypto, 'getRandomValues');
    expect(generateToken()).toMatch(/^[0-9a-f]{64}$/);
    expect(random).toHaveBeenCalledTimes(1);
    expect((random.mock.calls[0][0] as Uint8Array).length).toBe(32);
  });
  it('normalizes valid tokens, rejects malformed values and URL injection', () => {
    expect(normalizeToken(` ${'A'.repeat(64)} `)).toBe('a'.repeat(64));
    for (const token of ['', 'a'.repeat(63), 'g'.repeat(64), 'a'.repeat(64) + '&uid=1']) {
      expect(normalizeToken(token)).toBeNull();
      expect(subscriptionUrl(token)).toBeNull();
    }
    expect(subscriptionUrl('A'.repeat(64))).toBe(`https://api.raivex.xyz/mysekaibot_cn.sgmodule?token=${'a'.repeat(64)}`);
  });
  it('fails closed if browser entropy is unavailable', () => {
    vi.spyOn(crypto, 'getRandomValues').mockImplementation(() => { throw new Error('unavailable'); });
    expect(() => generateToken()).toThrow('unavailable');
  });
});
