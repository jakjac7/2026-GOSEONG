import { describe, expect, it } from 'vitest';
import { SCENES } from '../src/data/scenes';

describe('narrative registry', () => {
  it('contains the 12 documented scenes in order', () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([
      'D1-01',
      'D1-02',
      'D1-03',
      'D1-04',
      'D2-01',
      'D2-02',
      'D2-03',
      'D2-04',
      'D3-01',
      'D3-02',
      'D3-03',
      'D4-01',
    ]);
  });

  it('keeps the threshold as a single door tap without score UI', () => {
    const threshold = SCENES.find((scene) => scene.id === 'D3-02');
    expect(threshold?.moments).toHaveLength(1);
    expect(threshold?.moments[0]?.kind).toBe('tap');
    expect(JSON.stringify(threshold)).not.toMatch(/MISSION CLEAR|SUCCESS|SCORE|RANK|GAME OVER/i);
  });

  it('treats all outreach reactions as equal scene progress', () => {
    const outreach = SCENES.find((scene) => scene.id === 'D1-04');
    expect(outreach?.moments).toHaveLength(3);
    expect(outreach?.moments.every((moment) => moment.kind === 'tap')).toBe(true);
  });
});
