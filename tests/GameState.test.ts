import { describe, expect, it } from 'vitest';
import { GameState } from '../src/core/GameState';

describe('GameState', () => {
  it('prevents duplicate scenes and memories', () => {
    const state = new GameState();
    state.completeScene('D1-02', ['M01_FIRST_HEART']);
    state.completeScene('D1-02', ['M01_FIRST_HEART']);
    const save = state.snapshot();
    expect(save.completedScenes).toEqual(['D1-02']);
    expect(save.memories).toEqual(['M01_FIRST_HEART']);
  });

  it('preserves settings and guestbook while replaying', () => {
    const state = new GameState();
    state.toggleSound();
    state.addGuestbookEntry('함께 흘린 땀을 기억하는 일');
    state.startNewJourney();
    const save = state.snapshot();
    expect(save.soundEnabled).toBe(false);
    expect(save.guestbook).toHaveLength(1);
    expect(save.memories).toEqual([]);
  });
});
