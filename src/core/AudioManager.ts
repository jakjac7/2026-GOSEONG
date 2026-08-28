export class AudioManager {
  private context: AudioContext | null = null;
  private timers = new Set<number>();

  constructor(private enabled: boolean) {}

  setEnabled(value: boolean): void {
    this.enabled = value;
    if (!value) this.stop();
  }

  tap(): void {
    this.tone(320, 0.05, 0.025);
  }

  brick(): void {
    this.tone(95, 0.09, 0.045, 'square');
  }

  doorAndFootsteps(): void {
    if (!this.enabled) return;
    this.tone(120, 0.4, 0.035, 'sawtooth');
    for (const delay of [2100, 2800, 3500, 4200]) {
      const timer = window.setTimeout(() => this.tone(75, 0.08, 0.035, 'triangle'), delay);
      this.timers.add(timer);
    }
  }

  wind(): void {
    this.tone(180, 0.7, 0.018, 'sine');
  }

  stop(): void {
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
  }

  private tone(
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine',
  ): void {
    if (!this.enabled) return;
    const context = this.getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  private getContext(): AudioContext {
    this.context ??= new AudioContext();
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }
}
