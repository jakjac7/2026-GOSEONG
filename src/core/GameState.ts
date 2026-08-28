import { MEMORY_IDS, SCENE_IDS } from './types';
import type { MemoryId, SaveData, SceneId } from './types';

export const SAVE_VERSION = 1;

export function createDefaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    currentSceneIndex: 0,
    currentMomentIndex: 0,
    memories: [],
    completedScenes: [],
    endingSeen: false,
    playCount: 0,
    soundEnabled: true,
    vibrationEnabled: true,
    guestbook: [],
  };
}

export class GameState {
  private data: SaveData;

  constructor(initial: SaveData = createDefaultSave()) {
    this.data = structuredClone(initial);
  }

  snapshot(): SaveData {
    return structuredClone(this.data);
  }

  setPosition(sceneIndex: number, momentIndex: number): void {
    this.data.currentSceneIndex = Math.max(0, Math.min(sceneIndex, SCENE_IDS.length - 1));
    this.data.currentMomentIndex = Math.max(0, momentIndex);
  }

  completeScene(sceneId: SceneId, memories: readonly MemoryId[]): void {
    if (!this.data.completedScenes.includes(sceneId)) {
      this.data.completedScenes.push(sceneId);
    }
    for (const memory of memories) {
      if (!this.data.memories.includes(memory)) this.data.memories.push(memory);
    }
  }

  setEndingSeen(value: boolean): void {
    this.data.endingSeen = value;
  }

  startNewJourney(): void {
    const settings = {
      soundEnabled: this.data.soundEnabled,
      vibrationEnabled: this.data.vibrationEnabled,
      guestbook: this.data.guestbook,
    };
    this.data = {
      ...createDefaultSave(),
      ...settings,
      playCount: this.data.playCount + 1,
    };
  }

  toggleSound(): boolean {
    this.data.soundEnabled = !this.data.soundEnabled;
    return this.data.soundEnabled;
  }

  toggleVibration(): boolean {
    this.data.vibrationEnabled = !this.data.vibrationEnabled;
    return this.data.vibrationEnabled;
  }

  addGuestbookEntry(text: string): void {
    const normalized = text.trim().slice(0, 180);
    if (!normalized) return;
    this.data.guestbook.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: normalized,
      createdAt: new Date().toISOString(),
    });
    this.data.guestbook = this.data.guestbook.slice(0, 20);
  }

  static isKnownScene(value: string): value is SceneId {
    return (SCENE_IDS as readonly string[]).includes(value);
  }

  static isKnownMemory(value: string): value is MemoryId {
    return (MEMORY_IDS as readonly string[]).includes(value);
  }
}
