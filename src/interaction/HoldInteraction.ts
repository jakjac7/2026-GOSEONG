export class HoldInteraction {
  private progressMs = 0;
  private lastTick = 0;
  private holding = false;

  constructor(private readonly targetMs: number) {
    if (targetMs <= 0) throw new Error('Hold target must be positive.');
  }

  start(now: number): void {
    if (this.complete) return;
    this.holding = true;
    this.lastTick = now;
  }

  tick(now: number): number {
    if (!this.holding || this.complete) return this.ratio;
    const delta = Math.max(0, now - this.lastTick);
    this.progressMs = Math.min(this.targetMs, this.progressMs + delta);
    this.lastTick = now;
    if (this.complete) this.holding = false;
    return this.ratio;
  }

  release(now: number): number {
    this.tick(now);
    this.holding = false;
    return this.ratio;
  }

  get ratio(): number {
    return this.progressMs / this.targetMs;
  }

  get complete(): boolean {
    return this.progressMs >= this.targetMs;
  }

  get active(): boolean {
    return this.holding;
  }
}
