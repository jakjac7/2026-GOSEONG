export const SCENE_IDS = [
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
] as const;

export const MEMORY_IDS = [
  'M01_FIRST_HEART',
  'M02_FOUR_TENTS',
  'M03_BUS_STOP',
  'M04_THREE_TRUCKS',
  'M05_VILLAGE_BROADCAST',
  'M06_EIGHTY_MEALS',
  'M07_PRAYER_NORTH',
  'M08_1004_CAR',
  'M09_THRESHOLD',
  'M10_MEAL',
  'M11_MICROPHONE',
  'M12_OBSERVATORY',
] as const;

export type SceneId = (typeof SCENE_IDS)[number];
export type MemoryId = (typeof MEMORY_IDS)[number];
export type Day = 1 | 2 | 3 | 4;
export type InteractionKind = 'tap' | 'hold' | 'auto';

export type VisualEffect =
  | 'travel'
  | 'gather'
  | 'tent'
  | 'outreach'
  | 'brick'
  | 'doors'
  | 'cooking'
  | 'prayer'
  | 'pickup'
  | 'threshold'
  | 'feast'
  | 'cleanup'
  | 'observatory'
  | 'return';

export interface SceneMoment {
  readonly kind: InteractionKind;
  readonly action: string;
  readonly caption: string;
  readonly hint: string;
  readonly effect: VisualEffect;
  readonly holdMs?: number;
  readonly autoMs?: number;
}

export interface SceneDefinition {
  readonly id: SceneId;
  readonly day: Day;
  readonly date: string;
  readonly title: string;
  readonly theme: string;
  readonly background: string;
  readonly sticker?: string;
  readonly moments: readonly SceneMoment[];
  readonly memories: readonly MemoryId[];
}

export interface MemoryDefinition {
  readonly id: MemoryId;
  readonly title: string;
  readonly caption: string;
  readonly image: string;
}

export interface GuestbookEntry {
  readonly id: string;
  readonly text: string;
  readonly createdAt: string;
}

export interface SaveData {
  readonly version: number;
  currentSceneIndex: number;
  currentMomentIndex: number;
  memories: MemoryId[];
  completedScenes: SceneId[];
  endingSeen: boolean;
  playCount: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  guestbook: GuestbookEntry[];
}
