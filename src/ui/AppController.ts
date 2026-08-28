import { AudioManager } from '../core/AudioManager';
import { GameState } from '../core/GameState';
import { SaveManager } from '../core/SaveManager';
import type { SceneDefinition, SceneMoment } from '../core/types';
import { SCENES } from '../data/scenes';
import { memoryById } from '../data/memories';
import { HoldInteraction } from '../interaction/HoldInteraction';
import type { MemoryStage } from '../scene/MemoryStage';
import { EndingView } from './EndingView';
import { MemoryAlbum } from './MemoryAlbum';

export class AppController {
  private readonly saves = new SaveManager();
  private readonly state = new GameState(this.saves.load());
  private readonly audio = new AudioManager(this.state.snapshot().soundEnabled);
  private readonly album: MemoryAlbum;
  private readonly ending: EndingView;
  private readonly actionButton = this.getElement<HTMLButtonElement>('action-button');
  private readonly holdFill = this.getElement('hold-fill');
  private hold: HoldInteraction | null = null;
  private animationFrame = 0;
  private interactionBusy = false;
  private timers = new Set<number>();
  private lastDay: number | null = null;

  constructor(private readonly stage: MemoryStage) {
    this.album = new MemoryAlbum(
      () => this.state.snapshot().memories,
      () => this.haptic(12),
    );
    this.ending = new EndingView(
      this.state,
      this.saves,
      () => this.startNewJourney(),
      () => this.album.open(),
    );
    this.bindEvents();
    this.updateSettingsLabels();
    this.updateMemoryCount();
    this.prepareCover();
    this.prepareDevelopmentPreview();
  }

  private bindEvents(): void {
    this.getElement('start-journey').addEventListener('click', () => this.startNewJourney());
    this.getElement('continue-journey').addEventListener('click', () => this.continueJourney());
    this.getElement('toggle-sound').addEventListener('click', () => this.toggleSound());
    this.getElement('toggle-vibration').addEventListener('click', () => this.toggleVibration());
    this.actionButton.addEventListener('click', () => this.handleTap());
    this.actionButton.addEventListener('pointerdown', (event) => this.handleHoldStart(event));
    for (const eventName of ['pointerup', 'pointercancel', 'pointerleave']) {
      this.actionButton.addEventListener(eventName, () => this.handleHoldRelease());
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleHoldRelease();
        this.saves.save(this.state);
      }
    });
  }

  private prepareCover(): void {
    const save = this.state.snapshot();
    const hasProgress =
      save.currentSceneIndex > 0 ||
      save.currentMomentIndex > 0 ||
      save.completedScenes.length > 0 ||
      save.endingSeen;
    this.getElement<HTMLButtonElement>('continue-journey').hidden = !hasProgress;
  }

  private prepareDevelopmentPreview(): void {
    if (!import.meta.env.DEV) return;
    const search = new URLSearchParams(window.location.search);
    const preview = search.get('preview');
    if (!preview) return;
    this.getElement('cover-screen').classList.remove('is-open');

    if (preview === 'ending') {
      for (const scene of SCENES) this.state.completeScene(scene.id, scene.memories);
      this.updateMemoryCount();
      this.ending.show(true);
      return;
    }

    const sceneIndex = SCENES.findIndex((scene) => scene.id === preview);
    const scene = SCENES[sceneIndex];
    if (sceneIndex < 0 || !scene) return;
    const requestedMoment = Number.parseInt(search.get('moment') ?? '0', 10);
    const momentIndex = Number.isFinite(requestedMoment)
      ? Math.min(Math.max(requestedMoment, 0), scene.moments.length - 1)
      : 0;
    this.state.setPosition(sceneIndex, momentIndex);
    this.lastDay = scene.day;
    this.renderCurrentMoment();
  }

  private startNewJourney(): void {
    this.cancelCurrentInteraction();
    this.ending.hide();
    this.state.startNewJourney();
    this.state.setPosition(0, 0);
    this.saves.save(this.state);
    this.getElement('cover-screen').classList.remove('is-open');
    this.lastDay = null;
    this.showDayTransition(SCENES[0], () => this.renderCurrentMoment());
  }

  private continueJourney(): void {
    this.getElement('cover-screen').classList.remove('is-open');
    if (this.state.snapshot().endingSeen) {
      this.ending.show(true);
      return;
    }
    this.renderCurrentMoment();
  }

  private renderCurrentMoment(): void {
    this.cancelCurrentInteraction();
    this.interactionBusy = false;
    document.body.classList.remove('quiet-scene');

    const save = this.state.snapshot();
    const scene = SCENES[save.currentSceneIndex];
    if (!scene) {
      this.showEnding();
      return;
    }
    const moment = scene.moments[save.currentMomentIndex];
    if (!moment) {
      void this.finishScene(scene);
      return;
    }

    if (this.lastDay !== null && this.lastDay !== scene.day) {
      this.showDayTransition(scene, () =>
        this.renderMoment(scene, moment, save.currentMomentIndex),
      );
      return;
    }
    this.renderMoment(scene, moment, save.currentMomentIndex);
  }

  private renderMoment(scene: SceneDefinition, moment: SceneMoment, momentIndex: number): void {
    this.lastDay = scene.day;
    this.stage.renderScene(scene, momentIndex);
    this.setText('scene-date', scene.date);
    this.setText('scene-day', `DAY ${scene.day}`);
    this.setText('scene-code', `${scene.id} · ${scene.theme}`);
    this.setText('scene-title', scene.title);
    this.setText('scene-caption', moment.caption);
    this.setText('action-label', moment.action);
    this.setText('action-hint', moment.hint);
    this.setText('idle-hint', '');
    this.holdFill.style.width = '0%';
    this.actionButton.disabled = moment.kind === 'auto';
    this.actionButton.dataset.kind = moment.kind;
    this.actionButton.classList.toggle('is-hold', moment.kind === 'hold');
    this.actionButton.classList.toggle('is-auto', moment.kind === 'auto');
    this.setText('action-glyph', moment.kind === 'hold' ? '◉' : moment.kind === 'auto' ? '→' : '●');

    if (moment.kind === 'hold') this.hold = new HoldInteraction(moment.holdMs ?? 2500);
    if (moment.kind === 'auto') this.scheduleAuto(moment);
    this.scheduleIdleHint(moment.hint);
  }

  private handleTap(): void {
    const context = this.currentContext();
    if (!context || context.moment.kind !== 'tap' || this.interactionBusy) return;
    void this.completeMoment(context.scene, context.moment, context.momentIndex);
  }

  private handleHoldStart(event: PointerEvent): void {
    const context = this.currentContext();
    if (!context || context.moment.kind !== 'hold' || this.interactionBusy || !this.hold) return;
    event.preventDefault();
    this.actionButton.setPointerCapture?.(event.pointerId);
    this.hold.start(performance.now());
    this.actionButton.classList.add('is-pressing');
    this.haptic(10);
    this.tickHold();
  }

  private handleHoldRelease(): void {
    if (!this.hold) return;
    this.hold.release(performance.now());
    this.actionButton.classList.remove('is-pressing');
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
  }

  private tickHold(): void {
    if (!this.hold?.active) return;
    const ratio = this.hold.tick(performance.now());
    this.holdFill.style.width = `${Math.round(ratio * 100)}%`;
    if (this.hold.complete) {
      this.actionButton.classList.remove('is-pressing');
      const context = this.currentContext();
      if (context) void this.completeMoment(context.scene, context.moment, context.momentIndex);
      return;
    }
    this.animationFrame = window.requestAnimationFrame(() => this.tickHold());
  }

  private scheduleAuto(moment: SceneMoment): void {
    const startedAt = performance.now();
    const duration = moment.autoMs ?? 1800;
    const update = (): void => {
      const ratio = Math.min(1, (performance.now() - startedAt) / duration);
      this.holdFill.style.width = `${Math.round(ratio * 100)}%`;
      if (ratio < 1) {
        this.animationFrame = window.requestAnimationFrame(update);
        return;
      }
      const context = this.currentContext();
      if (context) void this.completeMoment(context.scene, context.moment, context.momentIndex);
    };
    this.animationFrame = window.requestAnimationFrame(update);
  }

  private async completeMoment(
    scene: SceneDefinition,
    moment: SceneMoment,
    momentIndex: number,
  ): Promise<void> {
    if (this.interactionBusy) return;
    this.interactionBusy = true;
    this.clearTimers();
    this.actionButton.disabled = true;
    this.haptic(18);
    if (moment.effect === 'brick') this.audio.brick();
    else if (moment.effect === 'threshold') {
      document.body.classList.add('quiet-scene');
      this.setText('scene-caption', '');
      this.setText('action-hint', '');
      this.audio.doorAndFootsteps();
    } else this.audio.tap();

    await this.stage.animateMoment(moment.effect, momentIndex);
    const nextMoment = momentIndex + 1;
    this.state.setPosition(this.state.snapshot().currentSceneIndex, nextMoment);
    this.saves.save(this.state);

    if (nextMoment < scene.moments.length) {
      this.setTimer(() => this.renderCurrentMoment(), moment.effect === 'threshold' ? 500 : 260);
      return;
    }
    await this.finishScene(scene);
  }

  private async finishScene(scene: SceneDefinition): Promise<void> {
    this.state.completeScene(scene.id, scene.memories);
    this.saves.save(this.state);
    this.updateMemoryCount();

    if (scene.memories.length > 0) {
      const lastMemoryId = scene.memories.at(-1);
      const memory = lastMemoryId ? memoryById.get(lastMemoryId) : undefined;
      if (memory) {
        this.setText('memory-toast-title', memory.title);
        this.setText('memory-toast-caption', memory.caption);
        const toast = this.getElement('memory-toast');
        toast.classList.add('is-visible');
        await this.wait(1450);
        toast.classList.remove('is-visible');
      }
    } else {
      await this.wait(420);
    }

    const nextSceneIndex = this.state.snapshot().currentSceneIndex + 1;
    if (nextSceneIndex >= SCENES.length) {
      this.showEnding();
      return;
    }
    this.state.setPosition(nextSceneIndex, 0);
    this.saves.save(this.state);
    this.renderCurrentMoment();
  }

  private showEnding(): void {
    this.cancelCurrentInteraction();
    this.state.setEndingSeen(false);
    this.saves.save(this.state);
    this.ending.show();
  }

  private showDayTransition(scene: SceneDefinition | undefined, done: () => void): void {
    if (!scene) return done();
    const transition = this.getElement('day-transition');
    this.setText('transition-date', scene.date);
    this.setText('transition-day', `DAY ${scene.day}`);
    this.setText('transition-theme', scene.theme);
    transition.classList.add('is-visible');
    this.setTimer(() => {
      transition.classList.remove('is-visible');
      this.lastDay = scene.day;
      done();
    }, 1650);
  }

  private toggleSound(): void {
    const enabled = this.state.toggleSound();
    this.audio.setEnabled(enabled);
    this.saves.save(this.state);
    this.updateSettingsLabels();
  }

  private toggleVibration(): void {
    this.state.toggleVibration();
    this.saves.save(this.state);
    this.updateSettingsLabels();
    this.haptic(15);
  }

  private updateSettingsLabels(): void {
    const save = this.state.snapshot();
    this.setText('toggle-sound', save.soundEnabled ? '소리 켬' : '소리 끔');
    this.setText('toggle-vibration', save.vibrationEnabled ? '진동 켬' : '진동 끔');
  }

  private updateMemoryCount(): void {
    this.setText('memory-count', `${this.state.snapshot().memories.length} / 12`);
  }

  private scheduleIdleHint(hint: string): void {
    this.setTimer(() => this.actionButton.classList.add('needs-attention'), 4000);
    this.setTimer(() => this.setText('idle-hint', hint), 8000);
  }

  private currentContext():
    { scene: SceneDefinition; moment: SceneMoment; momentIndex: number } | undefined {
    const save = this.state.snapshot();
    const scene = SCENES[save.currentSceneIndex];
    const moment = scene?.moments[save.currentMomentIndex];
    if (!scene || !moment) return undefined;
    return { scene, moment, momentIndex: save.currentMomentIndex };
  }

  private cancelCurrentInteraction(): void {
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.hold = null;
    this.audio.stop();
    this.clearTimers();
    this.actionButton.classList.remove('is-pressing', 'needs-attention');
  }

  private wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => this.setTimer(resolve, milliseconds));
  }

  private setTimer(callback: () => void, milliseconds: number): void {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, milliseconds);
    this.timers.add(timer);
  }

  private clearTimers(): void {
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
  }

  private haptic(duration: number): void {
    if (this.state.snapshot().vibrationEnabled && 'vibrate' in navigator)
      navigator.vibrate(duration);
  }

  private setText(id: string, value: string): void {
    this.getElement(id).textContent = value;
  }

  private getElement<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing element #${id}`);
    return element as T;
  }
}
