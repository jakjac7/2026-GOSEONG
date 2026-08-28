import { describe, expect, it } from 'vitest';
import { ASSETS } from '../src/data/assets';
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

  it('keeps group travel and elder pickup vehicles distinct', () => {
    expect(SCENES.find((scene) => scene.id === 'D1-01')?.sticker).toBe(ASSETS.bus);
    expect(SCENES.find((scene) => scene.id === 'D3-01')?.sticker).toBe(ASSETS.pickupSuv);
    expect(ASSETS.pickupSuv).toContain('pickup-suv-1004.webp');
  });

  it('contains the corrected day titles and day-two story beats', () => {
    const arrival = SCENES.find((scene) => scene.id === 'D1-01');
    const bricks = SCENES.find((scene) => scene.id === 'D2-01');
    const meals = SCENES.find((scene) => scene.id === 'D2-03');
    const prayer = SCENES.find((scene) => scene.id === 'D2-04');

    expect(arrival?.theme).toBe('Hello, 고성');
    expect(bricks?.moments.at(-1)?.caption).toContain('아야진 교회를 정비하러 갔다');
    expect(
      meals?.moments.some(
        (moment) => moment.caption === '예배당에 모두가 모여 생닭의 속을 넣었다.',
      ),
    ).toBe(true);
    expect(prayer?.title).toBe('강원도 구석구석 복음화를 향한 낮아짐');
    expect(JSON.stringify(prayer)).not.toContain('북한');
  });
});
