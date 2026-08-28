import { describe, expect, it } from 'vitest';
import { HoldInteraction } from '../src/interaction/HoldInteraction';

describe('HoldInteraction', () => {
  it('retains progress when the pointer is released', () => {
    const hold = new HoldInteraction(1000);
    hold.start(0);
    expect(hold.release(400)).toBeCloseTo(0.4);
    expect(hold.ratio).toBeCloseTo(0.4);

    hold.start(1000);
    hold.tick(1600);
    expect(hold.complete).toBe(true);
  });

  it('does not gain progress while inactive', () => {
    const hold = new HoldInteraction(1000);
    expect(hold.tick(5000)).toBe(0);
  });
});
