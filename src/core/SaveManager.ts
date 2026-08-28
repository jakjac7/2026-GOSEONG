import { createDefaultSave, GameState, SAVE_VERSION } from './GameState';
import type { GuestbookEntry, SaveData } from './types';

export const SAVE_KEY = 'goseong-memory-v1';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class SaveManager {
  constructor(private readonly storage: StorageLike = window.localStorage) {}

  load(): SaveData {
    try {
      const raw = this.storage.getItem(SAVE_KEY);
      if (!raw) return createDefaultSave();
      const parsed: unknown = JSON.parse(raw);
      return this.migrate(parsed);
    } catch (error) {
      console.warn('저장 데이터를 복구하지 못해 새 여정을 시작합니다.', error);
      return createDefaultSave();
    }
  }

  save(state: GameState): void {
    this.storage.setItem(SAVE_KEY, JSON.stringify(state.snapshot()));
  }

  private migrate(value: unknown): SaveData {
    if (!this.isRecord(value)) return createDefaultSave();
    const fallback = createDefaultSave();
    const memories = Array.isArray(value.memories)
      ? value.memories.filter(
          (item): item is SaveData['memories'][number] =>
            typeof item === 'string' && GameState.isKnownMemory(item),
        )
      : [];
    const completedScenes = Array.isArray(value.completedScenes)
      ? value.completedScenes.filter(
          (item): item is SaveData['completedScenes'][number] =>
            typeof item === 'string' && GameState.isKnownScene(item),
        )
      : [];
    const guestbook = Array.isArray(value.guestbook)
      ? value.guestbook.filter(this.isGuestbookEntry).slice(0, 20)
      : [];

    return {
      version: SAVE_VERSION,
      currentSceneIndex: this.safeInteger(value.currentSceneIndex, fallback.currentSceneIndex),
      currentMomentIndex: this.safeInteger(value.currentMomentIndex, fallback.currentMomentIndex),
      memories: [...new Set(memories)],
      completedScenes: [...new Set(completedScenes)],
      endingSeen: typeof value.endingSeen === 'boolean' ? value.endingSeen : false,
      playCount: this.safeInteger(value.playCount, 0),
      soundEnabled: typeof value.soundEnabled === 'boolean' ? value.soundEnabled : true,
      vibrationEnabled: typeof value.vibrationEnabled === 'boolean' ? value.vibrationEnabled : true,
      guestbook,
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private safeInteger(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : fallback;
  }

  private isGuestbookEntry(value: unknown): value is GuestbookEntry {
    if (typeof value !== 'object' || value === null) return false;
    const item = value as Record<string, unknown>;
    return (
      typeof item.id === 'string' &&
      typeof item.text === 'string' &&
      typeof item.createdAt === 'string'
    );
  }
}
