import { MEMORIES } from '../data/memories';
import type { MemoryId } from '../core/types';

export class MemoryAlbum {
  private readonly dialog: HTMLDialogElement;
  private readonly grid: HTMLElement;

  constructor(
    private readonly getMemories: () => readonly MemoryId[],
    onOpen?: () => void,
  ) {
    this.dialog = this.getElement<HTMLDialogElement>('album-dialog');
    this.grid = this.getElement('album-grid');
    this.getElement('open-album').addEventListener('click', () => {
      onOpen?.();
      this.open();
    });
    this.getElement('close-album').addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.dialog.close();
    });
  }

  open(): void {
    const collected = new Set(this.getMemories());
    this.grid.innerHTML = MEMORIES.map((memory, index) => {
      const unlocked = collected.has(memory.id);
      return `
        <article class="memory-card ${unlocked ? 'is-unlocked' : 'is-locked'}">
          <div class="memory-card__image" style="--memory-image: url('${memory.image}')">
            <span>${String(index + 1).padStart(2, '0')}</span>
          </div>
          <h3>${unlocked ? this.escape(memory.title) : '아직 걷지 않은 기억'}</h3>
          <p>${unlocked ? this.escape(memory.caption) : '여정을 따라가면 열립니다.'}</p>
        </article>
      `;
    }).join('');
    if (!this.dialog.open) this.dialog.showModal();
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
