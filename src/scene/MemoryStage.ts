import Phaser from 'phaser';
import { ASSETS } from '../data/assets';
import type { SceneDefinition, VisualEffect } from '../core/types';
import {
  outreachPlacements,
  placementFor,
  tentPlacements,
  type StickerPlacement,
} from './assetLayout';

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
    this.cameras.main.setScroll(0, 0).setZoom(1);
    this.doors = [];
    this.focusObject = null;

    const moment = scene.moments[momentIndex] ?? scene.moments[0];
    if (!moment) return;

    const background = this.backgroundFor(scene, moment.effect);
    this.addCoverImage(background, moment.effect, momentIndex);
    this.addVignette(scene.day);

    if (moment.effect === 'threshold') {
      this.buildThreshold();
      return;
    }

    if (moment.effect === 'feast') {
      this.addAmbientPixels(scene.day, momentIndex);
      return;
    }

    if (moment.effect === 'tent' || (moment.effect === 'cleanup' && momentIndex === 1)) {
      this.addTentCluster(moment.effect === 'tent' ? momentIndex : 0);
      this.addAmbientPixels(scene.day, momentIndex);
      return;
    }

    if (moment.effect === 'outreach') {
      this.addOutreachPair(false);
      this.addAmbientPixels(scene.day, momentIndex);
      return;
    }

    if (moment.effect === 'doors') {
      this.addOutreachPair(true);
      this.addAmbientPixels(scene.day, momentIndex);
      return;
    }

    const sticker = this.stickerFor(scene, moment.effect, momentIndex);
    if (sticker) this.addSticker(sticker, moment.effect, momentIndex);

    this.addAmbientPixels(scene.day, momentIndex);
  }

  animateMoment(effect: VisualEffect, momentIndex: number): Promise<void> {
    if (effect === 'threshold') return this.animateThreshold();

    if ((effect === 'travel' || effect === 'return') && this.focusObject) {
      this.tweens.add({
        targets: this.focusObject,
        x: this.focusObject.x + 190 + momentIndex * 24,
        duration: 900,
        ease: 'Sine.easeInOut',
      });
      return new Promise((resolve) => window.setTimeout(resolve, 920));
    }

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
    return new Promise((resolve) => window.setTimeout(resolve, 520));
  }

  private addCoverImage(
    url: string,
    effect: VisualEffect,
    momentIndex: number,
  ): Phaser.GameObjects.Image {
    const key = this.assetKey(url);
    const image = this.add.image(WIDTH / 2, HEIGHT / 2, key);
    const texture = image.texture.getSourceImage() as HTMLImageElement;
    const scale = Math.max(WIDTH / texture.width, HEIGHT / texture.height);
    image.setScale(scale).setScrollFactor(0);
    if (effect === 'feast') {
      const focalX = [620, 620, 650, 480, 240, 240][momentIndex] ?? 480;
      image.setX(focalX);
    }
    return image;
  }

  private addVignette(day: number): void {
    const tone = ['0x123e35', '0x3d301d', '0x3d2719', '0x172f3a'][day - 1] ?? '0x163f36';
    this.add.rectangle(WIDTH / 2, HEIGHT - 78, WIDTH, 156, Number(tone), 0.42);
    this.add.rectangle(WIDTH / 2, 32, WIDTH, 64, 0x0b1f1a, 0.2);
  }

  private addSticker(url: string, effect: VisualEffect, momentIndex: number): void {
    const key = this.assetKey(url);
    const placement = placementFor(url, effect);
    const image = this.add.image(placement.x, placement.y, key).setScrollFactor(0);
    const source = image.texture.getSourceImage() as HTMLImageElement;
    const scale = Math.min(placement.maxWidth / source.width, placement.maxHeight / source.height);
    image
      .setScale(scale)
      .setAngle(placement.angle ?? 0)
      .setDepth(3)
      .setAlpha(0);
    this.focusObject = image;

    this.tweens.add({
      targets: image,
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
      const pixel = this.add.rectangle(x, y, 5, 5, color, 0.35).setDepth(6).setScrollFactor(0);
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
    if (effect === 'cleanup') return undefined;
    if (effect === 'feast' || effect === 'threshold') return undefined;
    return scene.sticker;
  }

  private addTentCluster(momentIndex: number): void {
    tentPlacements(momentIndex).forEach((placement, index) => {
      const tent = this.addPlacedImage(ASSETS.tents, placement, 2 + index);
      tent.setAlpha(0);
      this.tweens.add({
        targets: tent,
        alpha: 1,
        y: tent.y + 10,
        duration: 420,
        delay: index * 110,
        ease: 'Cubic.easeOut',
      });
      this.focusObject = tent;
    });
  }

  private addOutreachPair(village: boolean): void {
    const placements = outreachPlacements(village);
    const volunteers = this.addPlacedImage(ASSETS.outreachVolunteers, placements.volunteers, 3);
    const neighbors = this.addPlacedImage(
      village ? ASSETS.elders : ASSETS.internationalStudents,
      placements.neighbors,
      3,
    );
    volunteers.setAlpha(0);
    neighbors.setAlpha(0);
    this.tweens.add({
      targets: [volunteers, neighbors],
      alpha: 1,
      y: '-=8',
      duration: 520,
      ease: 'Cubic.easeOut',
    });
    this.focusObject = volunteers;
  }

  private addPlacedImage(
    url: string,
    placement: StickerPlacement,
    depth: number,
  ): Phaser.GameObjects.Image {
    const image = this.add
      .image(placement.x, placement.y, this.assetKey(url))
      .setScrollFactor(0)
      .setDepth(depth)
      .setAngle(placement.angle ?? 0);
    const source = image.texture.getSourceImage() as HTMLImageElement;
    image.setScale(
      Math.min(placement.maxWidth / source.width, placement.maxHeight / source.height),
    );
    return image;
  }

  private assetKey(url: string): string {
    const entry = Object.entries(ASSETS).find(([, assetUrl]) => assetUrl === url);
    if (!entry) throw new Error(`Unknown asset URL: ${url}`);
    return entry[0];
  }
}
