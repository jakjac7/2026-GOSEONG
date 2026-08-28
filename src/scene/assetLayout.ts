import type { VisualEffect } from '../core/types';
import { ASSETS } from '../data/assets';

export interface StickerPlacement {
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
  angle?: number;
}

export const tentPlacements = (momentIndex: number): readonly StickerPlacement[] => {
  const layouts: readonly (readonly StickerPlacement[])[] = [
    [{ x: 650, y: 438, maxWidth: 470, maxHeight: 310 }],
    [
      { x: 390, y: 450, maxWidth: 390, maxHeight: 270 },
      { x: 710, y: 438, maxWidth: 390, maxHeight: 270 },
    ],
    [
      { x: 165, y: 475, maxWidth: 310, maxHeight: 230 },
      { x: 390, y: 450, maxWidth: 330, maxHeight: 240 },
      { x: 635, y: 450, maxWidth: 330, maxHeight: 240 },
      { x: 840, y: 475, maxWidth: 300, maxHeight: 220 },
    ],
  ];
  return layouts[Math.min(momentIndex, layouts.length - 1)] ?? layouts[0] ?? [];
};

export const outreachPlacements = (
  village: boolean,
): { volunteers: StickerPlacement; neighbors: StickerPlacement } => ({
  volunteers: {
    x: village ? 245 : 280,
    y: 452,
    maxWidth: 345,
    maxHeight: 360,
  },
  neighbors: village
    ? { x: 718, y: 450, maxWidth: 360, maxHeight: 350 }
    : { x: 700, y: 454, maxWidth: 390, maxHeight: 350 },
});

export const placementFor = (url: string, effect: VisualEffect): StickerPlacement => {
  if (url === ASSETS.bus) return { x: 245, y: 474, maxWidth: 650, maxHeight: 270 };
  if (url === ASSETS.pickupSuv) return { x: 650, y: 535, maxWidth: 530, maxHeight: 270 };
  if (url === ASSETS.elders) return { x: 690, y: 535, maxWidth: 390, maxHeight: 350 };
  if (url === ASSETS.prayerTeam) return { x: 490, y: 438, maxWidth: 650, maxHeight: 310 };
  if (url === ASSETS.mealPrepTeam) return { x: 480, y: 465, maxWidth: 840, maxHeight: 370 };
  if (url === ASSETS.brickTruck) return { x: 555, y: 478, maxWidth: 650, maxHeight: 320 };
  if (url === ASSETS.observatoryChurch) return { x: 285, y: 438, maxWidth: 430, maxHeight: 340 };
  return {
    x: 560,
    y: 440,
    maxWidth: effect === 'pickup' ? 560 : 520,
    maxHeight: 340,
  };
};
