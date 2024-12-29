import { describe, it, expect } from 'vitest';
import {
  isProduct,
  isBrowser,
  isIterable,
  delay,
  isMobile,
  isUrl,
  isEmoji,
  isUUID,
} from '@/utils';

describe('Utility Functions', () => {
  it('isProduct: should detect environment as "product"', () => {
    process.env.VERCEL_ENV = 'product';
    expect(isProduct()).toBe(true);

    process.env.VERCEL_ENV = 'development';
    expect(isProduct()).toBe(false);
  });

  it('isBrowser: should correctly detect if running in a browser environment', () => {
    expect(isBrowser).toBe(typeof window !== 'undefined');
  });

  it('isIterable: should correctly determine if an object is iterable', () => {
    expect(isIterable([])).toBe(true);
    expect(isIterable(new Set())).toBe(true);
    expect(isIterable('string')).toBe(true);
    expect(isIterable(123)).toBe(false);
    expect(isIterable(null)).toBe(false);
    expect(isIterable(undefined)).toBe(false);
  });

  it('delay: should resolve after specified time', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it('isMobile: should correctly detect mobile devices', () => {
    const userAgentBackup = navigator.userAgent;
    const platformBackup = navigator.platform;

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mobi',
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'Android',
      configurable: true,
    });
    expect(isMobile()).toBe(true);

    Object.defineProperty(navigator, 'userAgent', {
      value: userAgentBackup,
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: platformBackup,
      configurable: true,
    });
  });

  it('isUrl: should correctly validate URLs', () => {
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('ftp://example.com')).toBe(true);
    expect(isUrl('not-a-url')).toBe(false);
    expect(isUrl('example.com')).toBe(false);
  });

  it('isEmoji: should correctly identify emojis', () => {
    expect(isEmoji('😊')).toBe(true);
    expect(isEmoji('Hello')).toBe(false);
    expect(isEmoji('👍🏽')).toBe(true);
    expect(isEmoji('©️')).toBe(true);
  });

  it('isUUID: should correctly validate UUIDs', () => {
    expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isUUID('123e4567-e89b-12d3-a456-42661417400')).toBe(false);
    expect(isUUID('not-a-uuid')).toBe(false);
  });
});
