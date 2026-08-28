# GOSEONG — AI Development Agent Rules

**Project:** GOSEONG : 다시, 그 여름  
**Purpose:** AI 코더가 저장소에서 반복 작업할 때 항상 지켜야 할 프로젝트 규칙

---

## 1. Project Identity

GOSEONG은 2026년 8월 3일~6일의 실제 고성 아웃리치를 바탕으로 한 **Interactive Memory / Narrative Mini Game**이다.

제품의 목적은 선교를 점수화하거나 공략하게 만드는 것이 아니다.

핵심 경험:

> **기억 → 함께함 → 섬김 → 여운 → 다시 일상**

한 문장 정의:

> 3박 4일의 실제 아웃리치를 10~15분 동안 Tap / Hold만으로 다시 경험하는 플레이 가능한 기억앨범.

---

## 2. Source of Truth

사실/요구사항 충돌 시 우선순위:

1. `고성로그.md` — 실제 사건 및 사실관계
2. `Goseong_prd.md` — 제품 철학 / 요구사항 / Scope
3. `Goseong_gdd.md` — 구현 / Scene / UX / 기술 설계
4. 현 코드
5. 추론

문서에 없는 실제 사건, 인물 행동, 대화, 수치, 영적 결과를 사실처럼 창작하지 않는다.

불확실한 내용은 `TODO_CONTENT`로 표시한다.

---

## 3. Non-Negotiable Product Rules

### Controls

필수 입력:

- Tap
- Hold
- Auto Move
- Auto Camera

금지:

- virtual joystick
- jump
- reflex challenge
- rhythm judgement
- complex drag
- mandatory multitouch

### No Failure

금지:

- Game Over
- Mission Clear
- Score
- Rank
- Star rating
- evangelism success rate
- soul counter
- HP
- resource economy

NPC의 긍정/중립/거절 반응은 모두 동일한 게임 진행 가치를 가진다.

### One Scene = One Memory

한 Scene에서 하나의 감정·기억·시선 포인트에 집중한다.

Asset showcase처럼 만들지 않는다.

---

## 4. Hero Scene Guardrail

`D3-02 THE THRESHOLD`는 전체 프로젝트의 Hero Scene이다.

필수:

- 플레이어는 문만 연다.
- NPC는 스스로 걸어 들어간다.
- BGM 최소화.
- 문 소리 / 발걸음 / 공간 ambience 중심.
- 느리고 절제된 timing.

금지:

- NPC drag
- 강제 이동
- confetti
- success banner
- score
- 과도한 감동 문구

이 규칙을 깨는 변경은 하지 않는다.

---

## 5. MVP Scope

MVP scene list:

```text
D1-01 BUS TO GOSEONG
D1-02 OPENING WORSHIP
D1-03 TENT SETUP
D1-04 FOREIGN STUDENT OUTREACH
D2-01 BRICKS
D2-02 DOOR TO DOOR
D2-03 80 SERVINGS
D2-04 PRAYER FOR NORTH KOREA
D3-01 PICKUP
D3-02 THE THRESHOLD
D3-03 VILLAGE FEAST
D4-01 CLEANUP → OBSERVATORY → RETURN HOME
```

MVP 외 기능은 우선 backlog로 둔다.

---

## 6. Preferred Technical Direction

기존 repo가 있으면 기존 stack을 먼저 존중한다.

신규/빈 repo fallback:

```text
TypeScript
Vite
Phaser 3
Vitest
Playwright
Web MVP
Android packaging later with Capacitor
```

MVP는 serverless/local-first.

기본적으로 사용하지 않는다:

- Firebase
- account/login
- server database
- ads
- IAP

---

## 7. Architecture Rules

Data-driven Scene Runner를 사용한다.

책임을 분리한다.

```text
GameState       → global runtime state
SaveManager     → save/load/migration
SceneManager    → scene lifecycle/transition
SceneRunner     → SceneDefinition 실행
InputManager    → pointer input normalization
TapInteraction  → tap behavior
HoldInteraction → hold behavior
AudioManager    → BGM/SFX/ducking
CameraController→ focus/pan/zoom
DialogueBox     → text rendering
AssetRegistry   → asset ids and loading
```

Scene-specific narrative data는 manager class 내부에 hardcode하지 않는다.

---

## 8. Suggested Source Layout

```text
/src
  /core
  /scene
  /actors
  /interaction
  /camera
  /ui
  /audio
  /data
  /assets
/tests
/public/assets/raw
/public/assets/processed
```

기존 repo가 다른 구조를 이미 안정적으로 쓰고 있다면 강제 migration하지 않는다.

---

## 9. TypeScript Rules

- `strict: true`
- 신규 `any` 금지. 불가피하면 이유 주석.
- scene id / memory id는 typed constant 또는 union.
- side effect는 manager/service 책임 안에서만 처리.
- UI가 save logic을 직접 소유하지 않는다.
- scene data와 scene engine을 분리한다.
- async 오류를 swallow하지 않는다.
- user-facing crash 대신 recoverable fallback을 우선한다.

---

## 10. File Size / Responsibility

거대한 단일 파일 금지.

특히 다음 안티패턴을 피한다.

```text
game.ts
  ├ scene logic
  ├ input
  ├ save
  ├ UI
  ├ audio
  ├ assets
  └ narrative data
```

한 파일이 약 300~350 lines를 넘으면 우선 책임 분리 가능성을 검토한다.

라인 수만을 맞추기 위한 기계적 분리는 하지 않는다. **의미/책임 단위 분리**가 기준이다.

---

## 11. Interaction Rules

### Tap

- target minimum ≈ 48dp
- context feedback
- no precision requirement

### Hold

Hold threshold:

```text
800ms
```

손을 떼면 기본적으로 progress 유지.

```ts
progress = currentProgress;
```

Hold mash로 속도 보너스를 주지 않는다.

노동 장면은 반복감을 주되 불필요하게 길게 만들지 않는다.

---

## 12. Save Rules

Local save only for MVP.

Save data에는 version을 포함한다.

필수 저장 시점:

- scene complete
- day transition
- background / visibility change

필수 방어:

- corrupted save fallback
- duplicate memory prevention
- idempotent scene completion
- version migration path

---

## 13. Memory Rules

Memory는 achievement가 아니다.

사용 가능:

```text
9 / 12 MEMORIES
```

사용 금지:

```text
100% CLEAR
PERFECT
S RANK
```

Memory key는 stable id로 관리한다.

---

## 14. Dialogue Rules

- 최대 2줄
- 한 줄 18~22자 권장
- UI 흐름을 막는 긴 설명 금지
- 현장 언어 우선
- 문자열은 data/resource에서 관리
- 기록에 없는 실제 인물의 대사를 사실처럼 생성 금지

---

## 15. NPC Rules

복잡한 AI 대신 FSM을 사용한다.

```text
Idle
LookAtTarget
Walk
Interact
React
ReturnIdle
```

Crowd는 idle phase와 작은 행동 timing을 분산한다.

NPC를 player achievement token처럼 취급하지 않는다.

---

## 16. Camera Rules

플레이어 직접 조작 금지.

지원:

- STATIC
- FOCUS
- PAN
- ZOOM_OUT
- CLOSEUP

Camera movement는 정보 전달보다 감정적 시선 유도에 사용한다.

motion sickness를 유발할 정도의 빠른 pan/zoom 금지.

---

## 17. Asset Rules

제공 asset sheet를 production-ready sprite라고 가정하지 않는다.

- raw source 보존
- processed output 분리
- source → crop 좌표 → asset id 추적 가능하게 유지
- 원본 destructive edit 금지
- pixel art nearest-neighbor scaling
- background grid가 포함된 crop을 투명 sprite라고 속이지 않기
- asset 부족 시 임의로 다른 캐릭터를 사실상의 실제 인물로 대체하지 않기
- 부족한 asset은 `TODO_ASSET`

---

## 18. Audio Rules

BGM categories:

```text
GOING
WORK
FEAST
HOME
```

Narrative SFX가 BGM보다 우선한다.

D3-02 BGM ≈ silence.

라이선스가 불명확한 음원을 저장소에 추가하지 않는다.

---

## 19. Accessibility

항상 확인:

- tap area 48dp+
- hold progress visible
- color-only state 금지
- text readable on mobile
- safe-area
- vibration toggle
- sound controls
- idle hint

입력이 느린 플레이어를 실패시키지 않는다.

---

## 20. Testing Rules

변경 후 가능한 범위에서 반드시 실행:

```text
lint
format/check
TypeScript typecheck
unit tests
build
relevant smoke test
```

최소 regression tests:

- Hold retain
- Save restore
- Duplicate memory
- Scene progression
- NPC reaction parity
- D3-02 completes without score/success UI
- Ending → Memory Album

테스트하지 않은 것을 `PASS`라고 쓰지 않는다.

---

## 21. Vertical Slice First

전체 Scene을 얇게 만들기 전에 아래 순서로 완성도를 검증한다.

1. `D2-01 BRICKS`
2. `D3-02 THE THRESHOLD`
3. `D3-03 VILLAGE FEAST`

세 Scene이 각각 다음을 증명해야 한다.

```text
BRICKS    → 반복 노동도 최소 입력으로 체감되는가?
THRESHOLD → 조용한 장면이 실제 감정적 Peak가 되는가?
FEAST     → 작은 상호작용만으로 공동체의 기쁨이 전달되는가?
```

---

## 22. No Unrelated Rewrites

한 요청을 해결하기 위해 저장소 전체를 다시 쓰지 않는다.

- unrelated refactor 금지
- naming mass-change 금지
- package 교체 최소화
- 기존 테스트 삭제 금지
- 대량 asset 삭제 금지

필요한 변경만 작게 수행한다.

---

## 23. No Hidden Assumptions

다음은 추정으로 처리하지 않는다.

- 실제 인물 이름
- 실제 대사
- 실제 선교 결과
- 정확한 asset identity
- 실제 공간 구조
- 저작권/라이선스 상태

확인이 안 되면 표시하고 진행 가능한 부분을 먼저 구현한다.

---

## 24. Performance

모바일 기준:

- stable frame pacing 우선
- 필요 asset만 preload
- 큰 source sheet 동시 로딩 최소화
- scene cleanup에서 listener/timer/tween 제거
- object leak 방지
- crowd 수는 화면 가독성과 성능을 함께 고려

이 프로젝트는 수백 NPC simulation이 필요하지 않다.

---

## 25. Product Decision Filter

모든 신규 기능은 이 질문을 통과해야 한다.

> **이 기능이 플레이어가 그때의 사람과 장면을 더 잘 기억하게 하는가?**

YES → 검토  
NO → 제외  
MAYBE → backlog

---

## 26. Definition of Done

기능은 아래 조건을 만족해야 완료다.

- PRD 요구 충족
- GDD flow 충족
- mobile interaction 가능
- loading/error path 고려
- test/build 확인
- unrelated regression 없음
- 실제 기록을 임의 왜곡하지 않음
- 필요한 TODO가 명시됨

---

## 27. Agent Work Routine

매 작업마다:

1. 관련 문서 확인
2. 관련 코드 검색
3. 변경 범위 정의
4. 최소 구현
5. typecheck/test/build
6. diff 자체 리뷰
7. PRD/GDD acceptance criteria와 대조
8. 결과 보고

---

## 28. Self Review Before Final Response

코딩을 끝냈다고 말하기 전에 스스로 확인한다.

### Product

- 게임이 점수화 방향으로 미끄러지지 않았는가?
- 플레이어가 사람을 공략 대상으로 보게 만들지 않았는가?
- One Scene = One Memory가 유지되는가?

### Code

- 책임이 한 파일에 몰리지 않았는가?
- magic string이 늘지 않았는가?
- save / scene state가 idempotent한가?
- listener / timer cleanup이 되는가?

### UX

- Tap/Hold만으로 가능한가?
- 입력하지 않아도 실패하지 않는가?
- mobile에서 UI가 핵심 scene을 가리지 않는가?

### Narrative

- 실제 기록에 없는 내용을 만들어내지 않았는가?
- D3-02가 과장된 성공 연출로 변하지 않았는가?
- Ending이 다시 삶으로 돌아가는 감정으로 닫히는가?

---

## 29. Report Template

```md
## IMPLEMENTATION REPORT

### 완료
- ...

### 변경 파일
- `path`: reason

### 검증
- `npm run typecheck`: PASS/FAIL
- `npm test`: PASS/FAIL
- `npm run build`: PASS/FAIL

### Acceptance Criteria
- [x] ...
- [ ] ...

### Risk / TODO
- ...

### Next
1. ...
2. ...
```

---

## 30. Final Rule

GOSEONG의 품질은 기능의 개수가 아니라 **실제로 있었던 4일의 사람·장면·감정을 얼마나 정확하고 절제되게 다시 걷게 하는가**로 판단한다.
