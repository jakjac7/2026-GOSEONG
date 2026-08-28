import type { GameState } from '../core/GameState';
import type { SaveManager } from '../core/SaveManager';

const ENDING_CARDS = [
  ['8.3', '우리가 왔다.'],
  ['8.4', '우리가 땀을 흘렸다.'],
  ['8.5', '사람들이 교회 안으로 들어왔다.'],
  ['8.6', '우리는 다시 삶으로 돌아갔다.'],
] as const;

export class EndingView {
  private readonly screen: HTMLElement;
  private readonly cards: HTMLElement;
  private readonly guestbook: HTMLElement;
  private readonly form: HTMLFormElement;
  private readonly input: HTMLTextAreaElement;
  private readonly after: HTMLElement;
  private timers: number[] = [];

  constructor(
    private readonly state: GameState,
    private readonly saves: SaveManager,
    onReplay: () => void,
    onAlbum: () => void,
  ) {
    this.screen = this.getElement('ending-screen');
    this.cards = this.getElement('ending-cards');
    this.guestbook = this.getElement('guestbook-panel');
    this.form = this.getElement<HTMLFormElement>('guestbook-form');
    this.input = this.getElement<HTMLTextAreaElement>('guestbook-input');
    this.after = this.getElement('guestbook-after');
    this.form.addEventListener('submit', (event) => this.submit(event));
    this.getElement('replay-journey').addEventListener('click', onReplay);
    this.getElement('ending-album').addEventListener('click', onAlbum);
  }

  show(skipSequence = false): void {
    this.clearTimers();
    this.screen.classList.add('is-open');
    this.guestbook.classList.remove('is-visible');
    this.cards.innerHTML = '';
    this.after.classList.toggle('is-visible', this.state.snapshot().guestbook.length > 0);
    this.form.hidden = this.state.snapshot().guestbook.length > 0;
    this.renderGuestbook();

    if (skipSequence) {
      this.showGuestbook();
      return;
    }

    ENDING_CARDS.forEach(([date, text], index) => {
      const timer = window.setTimeout(() => {
        this.cards.innerHTML = `<article><span>${date}</span><strong>${text}</strong></article>`;
      }, index * 1500);
      this.timers.push(timer);
    });
    const finalTimer = window.setTimeout(() => this.showGuestbook(), ENDING_CARDS.length * 1500);
    this.timers.push(finalTimer);
  }

  hide(): void {
    this.clearTimers();
    this.screen.classList.remove('is-open');
  }

  private showGuestbook(): void {
    this.cards.innerHTML = `
      <article class="final-card">
        <span>2026. 8. 3 — 8. 6</span>
        <strong>GOSEONG</strong>
        <p>주의 마음, 품 고!성!</p>
      </article>
    `;
    this.guestbook.classList.add('is-visible');
    window.setTimeout(() => this.input.focus({ preventScroll: true }), 400);
  }

  private submit(event: SubmitEvent): void {
    event.preventDefault();
    this.state.addGuestbookEntry(this.input.value);
    this.state.setEndingSeen(true);
    this.saves.save(this.state);
    this.form.hidden = true;
    this.after.classList.add('is-visible');
    this.input.value = '';
    this.renderGuestbook();
  }

  private renderGuestbook(): void {
    const list = this.getElement('guestbook-list');
    const entries = this.state.snapshot().guestbook.slice(0, 3);
    list.innerHTML = entries
      .map(
        (entry) => `
          <blockquote>
            “${this.escape(entry.text)}”
            <time>${new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(entry.createdAt))}</time>
          </blockquote>
        `,
      )
      .join('');
  }

  private clearTimers(): void {
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers = [];
  }

  private getElement<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing element #${id}`);
    return element as T;
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (char) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;',
      };
      return entities[char] ?? char;
    });
  }
}
