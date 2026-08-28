export function mountAppShell(root: HTMLElement): void {
  const coverImageUrl = `${import.meta.env.BASE_URL}assets/processed/bg-church-arrival.webp`;

  root.innerHTML = `
    <main class="game-shell" aria-label="고성 아웃리치 기억 게임">
      <header class="hud">
        <div class="hud__place">
          <span id="scene-date">8.3</span>
          <strong id="scene-day">DAY 1</strong>
        </div>
        <button class="memory-count" id="open-album" type="button" aria-label="기억앨범 열기">
          <span id="memory-count">0 / 12</span>
          <small>MEMORIES</small>
        </button>
      </header>

      <section class="stage-wrap" aria-label="현재 기억 장면">
        <div id="game-canvas"></div>
        <div class="stage-grain" aria-hidden="true"></div>
        <p class="idle-hint" id="idle-hint" aria-live="polite"></p>
      </section>

      <section class="story-panel" aria-live="polite">
        <p class="scene-code" id="scene-code">D1-01 · 우리가 왔다</p>
        <h1 id="scene-title">버스 출발</h1>
        <p class="scene-caption" id="scene-caption">고성으로 향할 준비를 합니다.</p>
      </section>

      <section class="interaction-panel">
        <button class="action-button" id="action-button" type="button">
          <span class="action-button__fill" id="hold-fill" aria-hidden="true"></span>
          <span class="action-button__content">
            <span class="action-glyph" id="action-glyph">●</span>
            <strong id="action-label">시작하기</strong>
          </span>
        </button>
        <p class="action-hint" id="action-hint">한 손가락으로 천천히 시작하세요.</p>
      </section>

      <footer class="utility-bar">
        <button id="toggle-sound" type="button" aria-label="소리 켜기 또는 끄기">소리 켬</button>
        <span>GOSEONG · 2026</span>
        <button id="toggle-vibration" type="button" aria-label="진동 켜기 또는 끄기">진동 켬</button>
      </footer>
    </main>

    <section class="cover-screen is-open" id="cover-screen" aria-labelledby="cover-title">
      <div class="cover-screen__image" style="background-image: url('${coverImageUrl}')" aria-hidden="true"></div>
      <div class="cover-screen__shade" aria-hidden="true"></div>
      <div class="cover-screen__content">
        <p class="cover-kicker">2026. 8. 3 — 8. 6</p>
        <h2 id="cover-title"><span>GOSEONG</span>다시, 그 여름</h2>
        <p>기억하고 · 함께하고 · 다시 일상으로</p>
        <div class="cover-actions">
          <button class="primary-button" id="start-journey" type="button">처음부터 걷기</button>
          <button class="ghost-button" id="continue-journey" type="button">이어 걷기</button>
        </div>
        <small>약 10–15분 · TAP / HOLD · 실패 없음</small>
      </div>
    </section>

    <section class="day-transition" id="day-transition" aria-live="assertive">
      <p id="transition-date">8.3</p>
      <strong id="transition-day">DAY 1</strong>
      <span id="transition-theme">우리가 왔다</span>
    </section>

    <section class="memory-toast" id="memory-toast" aria-live="polite">
      <span>MEMORY</span>
      <strong id="memory-toast-title">첫 마음</strong>
      <p id="memory-toast-caption"></p>
    </section>

    <dialog class="album-dialog" id="album-dialog">
      <div class="modal-header">
        <div><small>MEMORY ALBUM</small><h2>고성의 기억</h2></div>
        <button id="close-album" type="button" aria-label="기억앨범 닫기">닫기</button>
      </div>
      <div class="album-grid" id="album-grid"></div>
    </dialog>

    <section class="ending-screen" id="ending-screen" aria-labelledby="ending-title">
      <div class="ending-cards" id="ending-cards" aria-live="polite"></div>
      <div class="guestbook" id="guestbook-panel">
        <p class="cover-kicker">그리고, 지금의 나에게</p>
        <h2 id="ending-title">내게 고성아웃리치란…</h2>
        <form id="guestbook-form">
          <label for="guestbook-input">이 기억의 마지막 장을 남겨주세요.</label>
          <textarea id="guestbook-input" maxlength="180" rows="4" placeholder="한 문장으로 남겨보세요" required></textarea>
          <button class="primary-button" type="submit">방명록 남기기</button>
        </form>
        <div class="guestbook-after" id="guestbook-after">
          <p>당신의 문장이 이 기기의 기억앨범에 남았습니다.</p>
          <div class="ending-actions">
            <button id="ending-album" class="ghost-button" type="button">기억앨범 보기</button>
            <button id="replay-journey" class="primary-button" type="button">다시 기억하기</button>
          </div>
          <div class="guestbook-list" id="guestbook-list"></div>
        </div>
      </div>
    </section>
  `;
}
