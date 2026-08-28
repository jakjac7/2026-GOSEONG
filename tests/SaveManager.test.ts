import { describe, expect, it } from 'vitest';
import { GameState } from '../src/core/GameState';
import { SAVE_KEY, SaveManager } from '../src/core/SaveManager';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('SaveManager', () => {
  it('restores a saved journey', () => {
    const storage = new MemoryStorage();
    const manager = new SaveManager(storage);
    const state = new GameState();
    state.setPosition(4, 2);
    state.completeScene('D1-02', ['M01_FIRST_HEART']);
    manager.save(state);

    expect(manager.load()).toMatchObject({
      currentSceneIndex: 4,
      currentMomentIndex: 2,
      memories: ['M01_FIRST_HEART'],
    });
  });

  it('falls back safely when save JSON is corrupted', () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, '{broken');
    const originalWarn = console.warn;
    console.warn = () => undefined;
    const restored = new SaveManager(storage).load();
    console.warn = originalWarn;
    expect(restored.currentSceneIndex).toBe(0);
    expect(restored.memories).toEqual([]);
  });
});
