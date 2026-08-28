import Phaser from 'phaser';
import { ASSETS } from '../data/assets';
import type { SceneDefinition, VisualEffect } from '../core/types';

const WIDTH = 960;
const HEIGHT = 720;

export class MemoryStage extends Phaser.Scene {
  readonly ready: Promise<void>;
  private resolveReady!: () => void;
  private doors: Phaser.GameObjects.Rectangle[] = [];
  private focusObject: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('MemoryStage');
    this.ready = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
  }

  preload(): void {
    for (const [key, url] of Object.entries(ASSETS)) this.load.image(key, url);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#163f36');
    this.resolveReady();
  }

  renderScene(scene: SceneDefinition, momentIndex: number): void {
    this.tweens.killAll();
    this.children.removeAll(true);
    this.doors = [];
    this.focusObject = null;

    const moment = scene.moments[momentIndex] ?? scene.moments[0];
    if (!moment) return;

    const background = this.backgroundFor(scene, moment.effect);
    this.addCoverImage(background);
    this.addVignette(scene.day);

    if (moment.effect === 'threshold') {
      this.buildThreshold();
      return;
    }

    if (moment.effect === 'feast') {
      this.cameras.main.pan(500 + momentIndex * 55, HEIGHT / 2, 500, 'Sine.easeInOut');
      this.cameras.main.zoomTo(1.05 + momentIndex * 0.015, 500);
      return;
    }

    const sticker = this.stickerFor(scene, moment.effect, momentIndex);
    if (sticker) this.addSticker(sticker, moment.effect, momentIndex);

    this.addAmbientPixels(scene.day, momentIndex);
  }

  animateMoment(effect: VisualEffect, momentIndex: number): Promise<void> {
    if (effect === 'threshold') return this.animateThreshold();

    if (this.focusObject) {
      const startY = this.focusObject.y;
      this.tweens.add({
        targets: this.focusObject,
        y: startY - 16,
        scaleX: this.focusObject.scaleX * 1.025,
        scaleY: this.focusObject.scaleY * 1.025,
        duration: effect === 'brick' ? 260 : 380,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });
    }

    if (effect === 'prayer' || effect === 'observatory') {
      this.cameras.main.zoomTo(0.92, 900, 'Sine.easeInOut');
    }
    if (effect === 'travel' || effect === 'return') {
      this.cameras.main.pan(560 + momentIndex * 120, 360, 900, 'Sine.easeInOut');
    }

    return new Promise((resolve) => window.setTimeout(resolve, 520));
  }

  private addCoverImage(url: string): Phaser.GameObjects.Image {
    const key = this.assetKey(url);
    const image = this.add.image(WIDTH / 2, HEIGHT / 2, key);
    const texture = image.texture.getSourceImage() as HTMLImageElement;
    const scale = Math.max(WIDTH / texture.width, HEIGHT / texture.height);
    image.setScale(scale).setScrollFactor(0);
    return image;
  }

  private addVignette(day: number): void {
    const tone = ['0x123e35', '0x3d301d', '0x3d2719', '0x172f3a'][day - 1] ?? '0x163f36';
    this.add.rectangle(WIDTH / 2, HEIGHT - 78, WIDTH, 156, Number(tone), 0.42);
    this.add.rectangle(WIDTH / 2, 32, WIDTH, 64, 0x0b1f1a, 0.2);
  }

  private addSticker(url: string, effect: VisualEffect, momentIndex: number): void {
    const key = this.assetKey(url);
    const isCutout = this.isCutout(url);
    const image = this.add.image(isCutout ? WIDTH * 0.58 : WIDTH * 0.68, HEIGHT * 0.55, key);
    const source = image.texture.getSourceImage() as HTMLImageElement;
    const maxWidth = this.stickerMaxWidth(url, effect);
    const maxHeight = url === ASSETS.elders ? 350 : effect === 'prayer' ? 300 : 340;
    const scale = Math.min(maxWidth / source.width, maxHeight / source.height);
    image.setScale(scale).setAngle((momentIndex % 2 === 0 ? -1 : 1) * 1.1);

    const tweenTargets: Phaser.GameObjects.GameObject[] = [image];
    if (!isCutout) {
      const bounds = image.getBounds();
      const frame = this.add
        .rectangle(
          bounds.centerX,
          bounds.centerY,
          bounds.width + 28,
          bounds.height + 28,
          0xf6efd9,
          0.96,
        )
        .setStrokeStyle(4, 0x193d34, 0.65)
        .setAngle(image.angle)
        .setDepth(2);
      tweenTargets.unshift(frame);
    }
    image.setDepth(3);
    this.focusObject = image;

    this.tweens.add({
      targets: tweenTargets,
      alpha: { from: 0, to: 1 },
      y: `+=${momentIndex % 2 === 0 ? 10 : -8}`,
      duration: 520,
      ease: 'Cubic.easeOut',
    });
  }

  private addAmbientPixels(day: number, phase: number): void {
    const color = day === 3 ? 0xf6c458 : 0xe9d9a8;
    for (let index = 0; index < 7; index += 1) {
      const x = 70 + ((index * 137 + phase * 41) % 820);
      const y = 90 + ((index * 71 + phase * 29) % 440);
      const pixel = this.add.rectangle(x, y, 5, 5, color, 0.35).setDepth(6);
      this.tweens.add({
        targets: pixel,
        y: y - 16,
        alpha: 0.08,
        duration: 1800 + index * 130,
        yoyo: true,
        repeat: -1,
        delay: index * 110,
      });
    }
  }

  private buildThreshold(): void {
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x0b1612, 0.42).setDepth(4);
    const light = this.add.rectangle(WIDTH / 2, HEIGHT / 2 - 12, 292, 470, 0xe5c384, 0.22);
    light.setDepth(5);
    const left = this.add
      .rectangle(WIDTH / 2 - 76, HEIGHT / 2, 154, 490, 0x6f351f, 0.98)
      .setStrokeStyle(8, 0x291a14)
      .setDepth(7);
    const right = this.add
      .rectangle(WIDTH / 2 + 76, HEIGHT / 2, 154, 490, 0x6f351f, 0.98)
      .setStrokeStyle(8, 0x291a14)
      .setDepth(7);
    this.add.circle(WIDTH / 2 - 26, HEIGHT / 2 + 8, 7, 0xd4ae62).setDepth(8);
    this.add.circle(WIDTH / 2 + 26, HEIGHT / 2 + 8, 7, 0xd4ae62).setDepth(8);
    this.doors = [left, right];
  }

  private animateThreshold(): Promise<void> {
    const [left, right] = this.doors;
    if (!left || !right) return Promise.resolve();

    return new Promise((resolve) => {
      this.tweens.add({
        targets: left,
        x: WIDTH / 2 - 225,
        scaleX: 0.45,
        duration: 1450,
        ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: right,
        x: WIDTH / 2 + 225,
        scaleX: 0.45,
        duration: 1450,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.walkElders(() => window.setTimeout(resolve, 350));
        },
      });
    });
  }

  private walkElders(done: () => void): void {
    const elders = this.add
      .image(WIDTH / 2, HEIGHT + 150, 'elders')
      .setDepth(6)
      .setAlpha(0);
    const source = elders.texture.getSourceImage() as HTMLImageElement;
    elders.setScale(Math.min(300 / source.width, 350 / source.height));
    this.tweens.add({
      targets: elders,
      y: HEIGHT / 2 + 142,
      alpha: 0.96,
      duration: 2200,
      delay: 500,
      ease: 'Sine.easeInOut',
      onComplete: done,
    });
  }

  private backgroundFor(scene: SceneDefinition, effect: VisualEffect): string {
    if (effect === 'cleanup') return ASSETS.churchArrival;
    if (effect === 'observatory' || effect === 'return') return ASSETS.observatory;
    return scene.background;
  }

  private stickerFor(
    scene: SceneDefinition,
    effect: VisualEffect,
    momentIndex: number,
  ): string | undefined {
    if (effect === 'pickup' && momentIndex >= 2) return ASSETS.elders;
    if (effect === 'return') return ASSETS.bus;
    if (effect === 'cleanup') return ASSETS.tents;
    if (effect === 'feast' || effect === 'threshold') return undefined;
    return scene.sticker;
  }

  private isCutout(url: string): boolean {
    return [
      ASSETS.bus,
      ASSETS.pickupSuv,
      ASSETS.elders,
      ASSETS.prayerTeam,
      ASSETS.mealPrepTeam,
    ].some((asset) => asset === url);
  }

  private stickerMaxWidth(url: string, effect: VisualEffect): number {
    if (url === ASSETS.bus) return 720;
    if (url === ASSETS.pickupSuv) return 620;
    if (url === ASSETS.elders) return 430;
    if (url === ASSETS.prayerTeam) return 650;
    if (url === ASSETS.mealPrepTeam) return 760;
    return effect === 'pickup' ? 590 : 520;
  }

  private assetKey(url: string): string {
    const entry = Object.entries(ASSETS).find(([, assetUrl]) => assetUrl === url);
    if (!entry) throw new Error(`Unknown asset URL: ${url}`);
    return entry[0];
  }
}
