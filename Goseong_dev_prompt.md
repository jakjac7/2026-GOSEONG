# GOSEONG 개발 실행 프롬프트

> 이 문서는 Codex / Gemini / 기타 AI 코더에게 **한 번에 전달하는 전체 개발 지시문**이다.
> 프로젝트의 상세 제품 요구사항은 `Goseong_prd.md`, 구현 설계는 `Goseong_gdd.md`, 실제 사건의 사실관계는 `고성로그.md`를 따른다.

---

## 0. 당신의 역할

너는 이 프로젝트의 **시니어 2D 게임 개발자 + 테크리드 + 내러티브 시스템 엔지니어 + QA 리드**다.

목표는 기능을 많이 만드는 것이 아니라, 2026년 8월 3일~6일 실제 고성 아웃리치의 기억을 **10~15분짜리 모바일 인터랙티브 메모리 게임**으로 정확하고 절제되게 구현하는 것이다.

프로젝트명:

**GOSEONG : 다시, 그 여름**

핵심 제품 정의:

> 3박 4일의 실제 아웃리치를 10~15분 동안 Tap / Hold만으로 다시 경험하는 플레이 가능한 기억앨범.

이 프로젝트는 선교의 성과를 점수화하는 게임이 아니다. **기억·공동체·섬김·여운**이 제품의 핵심이다.

---

# 1. 작업 시작 전 반드시 할 일

코드를 수정하기 전에 아래 순서로 진행하라.

1. 저장소 전체 구조를 확인한다.
2. 다음 문서를 처음부터 끝까지 읽는다.
   - `Goseong_prd.md`
   - `Goseong_gdd.md`
   - `고성로그.md`
   - 저장소에 존재하는 기존 README / AGENTS / 개발 문서
3. 이미지·오디오·폰트 등 현재 에셋 폴더를 전수 확인한다.
4. 기존 프로젝트가 있다면 기술스택과 실행 방법을 먼저 파악한다.
5. 기존 코드가 있으면 가능한 한 보존하며 확장한다. unrelated rewrite를 하지 않는다.
6. 아래 내용을 먼저 짧게 보고한 뒤 구현에 착수한다.
   - 현재 기술스택
   - 실행 가능 여부
   - 발견한 에셋
   - PRD/GDD와 현재 코드 사이의 Gap
   - 이번 작업의 구현 순서

질문하지 않아도 코드와 문서에서 합리적으로 확인 가능한 사항은 먼저 확인해서 판단하라.

---

# 2. Source of Truth 우선순위

충돌이 있을 때 우선순위는 다음과 같다.

1. **`고성로그.md`** — 실제 사건, 날짜, 장소, 사역, 숫자 등 사실관계
2. **`Goseong_prd.md`** — 제품 철학, 핵심 경험, Scope, Non-goal
3. **`Goseong_gdd.md`** — UX, Scene flow, 알고리즘, 기술 구현 방향
4. 기존 코드
5. 개발자의 추론

실제 기록에 없는 역사적 사실, 인물 행동, 대화, 성공 사례를 임의로 만들어 넣지 마라.

불확실한 내용은 임의 창작하지 말고 `TODO_CONTENT` 또는 generic placeholder로 남겨라.

---

# 3. 절대 바꾸지 말아야 할 Product Pillars

다음은 구현 편의를 위해 변경할 수 없는 P0 요구사항이다.

### 3.1 Minimal Control

주요 플레이 입력은 오직 다음으로 제한한다.

- `TAP`
- `HOLD`
- 자동 이동
- 자동 카메라

금지:

- 가상 조이스틱
- 점프
- 드래그 정밀조작
- 멀티터치 필수 입력
- 리듬 판정
- 반사신경 테스트

### 3.2 No Failure

다음을 만들지 마라.

- Game Over
- 실패 화면
- 별점
- 점수
- 랭크
- 전도 성공률
- 영혼 수치
- HP
- 재화 경제

플레이어가 늦거나 손을 떼어도 진행 상황은 실패 처리하지 않는다.

### 3.3 One Scene = One Memory

한 화면에 모든 에셋을 전시하지 않는다.

각 Scene은 하나의 기억과 하나의 시선 포인트를 가져야 한다.

### 3.4 Community First

플레이어 한 명이 모든 일을 해결하는 연출을 피한다.

행동이 진행될수록 다른 팀원이 자연스럽게 합류하도록 한다.

### 3.5 HOLD TO SERVE

Hold는 숙련도를 측정하는 입력이 아니라 **시간을 함께 들이는 감각**을 표현하는 입력이다.

- 반복 탭으로 Hold 속도 증가 금지
- 손을 떼어도 실패 금지
- Hold progress는 기본적으로 유지
- 노동 장면은 짧은 반복을 통해 무게감을 주되 피로하게 만들지 않는다.

---

# 4. 가장 중요한 Hero Scene

## `D3-02 — THE THRESHOLD / 교회 문턱`

전체 제품에서 가장 중요하다.

이 Scene을 일반 Mission Clear 장면처럼 구현하면 안 된다.

### 필수 연출

1. 교회 내부에서 문을 바라본다.
2. 문 밖에 어르신이 있다.
3. 플레이어가 **문만 Tap** 한다.
4. 문이 천천히 열린다.
5. NPC가 잠시 머문다.
6. NPC가 스스로 한 발을 내딛는다.
7. NPC가 교회 안으로 들어온다.
8. 2~3명이 차례로 들어온 뒤 조용히 fade한다.

### 금지

- NPC drag
- 플레이어가 NPC를 밀거나 끌기
- `SUCCESS`
- `MISSION CLEAR`
- 점수
- 별
- 폭죽
- confetti
- 과도한 감동 자막

### Audio

BGM은 거의 제거하고 다음을 중심으로 한다.

- 문 손잡이
- 문 여는 소리
- 발걸음
- 실내 ambience

이 Scene의 목표는 플레이어에게 보상을 주는 것이 아니라 **잠시 멈추게 하는 것**이다.

---

# 5. MVP Scene Scope

MVP는 아래 12 Scene을 기준으로 한다.

| Code | Scene | Core Interaction |
|---|---|---|
| D1-01 | 버스 출발 | Auto |
| D1-02 | 여는 예배 | Hold |
| D1-03 | 천막 설치 | Tap / Hold |
| D1-04 | 경동대 유학생 전도 | Tap |
| D2-01 | 벽돌 운반 | Hold |
| D2-02 | 축호전도 | Tap |
| D2-03 | 80인분 준비 | Hold |
| D2-04 | 강원도 구석구석 복음화를 향한 낮아짐 | Hold |
| D3-01 | 어르신 픽업 | Tap |
| D3-02 | 교회 문턱 | Tap |
| D3-03 | 마을잔치 | Tap |
| D4-01 | 정리 → 통일전망대 → 귀환 | Tap / Hold / Auto |

임의로 20~30개의 추가 Scene을 만들지 마라.

---

# 6. 기술스택 결정 원칙

## 기존 프로젝트가 있는 경우

현재 스택을 우선 사용한다.

스택 변경이 필요한 경우 이유와 migration cost를 먼저 보고하고 승인 없이 전면 재작성하지 않는다.

## 신규 프로젝트 또는 사실상 빈 저장소인 경우 권장 스택

- TypeScript
- Vite
- Phaser 3
- Vitest
- Playwright 또는 동등한 모바일 브라우저 smoke test
- Web MVP 우선
- Android 패키징이 필요해질 때 Capacitor 적용

이 프로젝트는 서버가 필요하지 않다.

초기 MVP에 다음을 넣지 않는다.

- Firebase
- 로그인
- 서버 DB
- 클라우드 세이브
- 광고 SDK
- 결제 SDK

### 렌더링

- Pixel Art nearest-neighbor rendering
- antialiasing으로 픽셀 경계가 흐려지지 않게 한다.
- 기준 orientation은 PRD/GDD를 따르되 화면 구성에 따라 responsive하게 처리한다.
- 모바일 safe-area를 고려한다.

---

# 7. 권장 아키텍처

코드베이스는 **data-driven Scene Runner** 구조로 구현한다.

최소 구조:

```text
/src
  /core
    GameState.ts
    SaveManager.ts
    SceneManager.ts
    InputManager.ts
  /scene
    SceneRunner.ts
    SceneDefinition.ts
    SceneRegistry.ts
  /actors
    Actor.ts
    ActorState.ts
  /interaction
    TapInteraction.ts
    HoldInteraction.ts
  /camera
    CameraController.ts
  /ui
    DialogueBox.ts
    DayTitle.ts
    HoldIndicator.ts
    MemoryToast.ts
    SettingsPanel.ts
  /audio
    AudioManager.ts
  /data
    scenes/
    memories.ts
    dialogue.ts
  /assets
    AssetRegistry.ts
/tests
```

Scene 정의 예시:

```ts
export interface SceneDefinition {
  id: string;
  day: 1 | 2 | 3 | 4;
  title: string;
  background?: string;
  actors: ActorDefinition[];
  interactions: InteractionDefinition[];
  memoryRewards?: string[];
  nextScene?: string;
}
```

Scene-specific 코드가 core manager에 누적되지 않도록 한다.

---

# 8. State / Save

서버 없이 Local Save를 구현한다.

```ts
export interface SaveData {
  version: number;
  currentDay: 1 | 2 | 3 | 4;
  currentScene: string;
  memories: string[];
  completedScenes: string[];
  endingSeen: boolean;
  playCount: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
```

### Save timing

- Scene 완료 직후
- Day 전환 직후
- document visibility change / app background

### 요구사항

- 저장 데이터가 깨져도 앱 전체가 crash하지 않는다.
- version field를 두어 migration 가능하게 한다.
- 중복 memory 저장 방지.
- 완료 Scene 재진입 시 상태가 꼬이지 않아야 한다.

---

# 9. Interaction 상세 구현

## TAP

사용처:

- 문 열기
- NPC 선택
- 물건 전달
- 차량 출발
- 다음 대사
- Memory 확인

Tap target은 모바일 기준 최소 48dp 수준을 확보한다.

피드백:

- 작은 scale response
- optional subtle vibration
- context SFX
- 짧은 sprite animation

## HOLD

기본 hold threshold:

`800ms`

권장 duration:

- 짧은 행동: 1.5 sec
- 일반 행동: 2.5 sec
- 반복 노동: 4~6 sec
- 기도: 최소 3 sec 후 자연 종료 가능

Hold release:

```ts
progress = currentProgress;
```

실패로 초기화하지 않는다.

---

# 10. Scene별 최소 구현 Acceptance Criteria

## D1-01 BUS

- 서울 → 산 → 동해 → 고성의 이동감
- 플레이 필수 입력 없음
- Day Title 노출

## D1-02 OPENING WORSHIP

- Hold 시 주변 캐릭터가 순차적으로 기도 pose로 전환
- 음악이 점차 잦아든다.

## D1-03 TENT

- 플레이어는 첫 천막만 직접 설치
- 나머지 3개는 montage
- 팀원이 점차 합류

## D1-04 STUDENTS

NPC 3명 이상 상호작용.

반응 상태:

- Positive
- Neutral
- Decline

**모든 반응은 동일하게 Scene progress를 준다.**

## D2-01 BRICKS

- Hold cycle 3회
- 탭 연타 가속 없음
- 1회 → 2회 → 3회차에 팀원이 늘어나는 시각적 변화
- 60~90초를 넘지 않도록 조정

## D2-02 DOOR TO DOOR

- 3개의 house vignette
- 세 번째 vignette에서 주민 → 전화 → 이장 → 마을방송 연결

## D2-03 80 SERVINGS

Counter는 실제 80회 입력이 아니다.

```text
80 → 63 → 41 → 17 → 0
```

진행할수록 사람 수가 늘어난다.

## D2-04 PRAYER NORTH

- Hold
- 교회 내부 → 외부 → 고성 → 북쪽 방향으로 camera scale 확장

## D3-01 PICKUP

- 처음엔 예상보다 사람이 적다.
- 차량을 Tap하여 여러 지점을 돌며 사람이 늘어난다.
- 차량 번호 1004는 optional easter egg.

## D3-02 THRESHOLD

위 Hero Scene 규칙을 그대로 따른다.

## D3-03 FEAST

긴 미니게임 하나가 아니라 짧은 vignette 묶음으로 구현한다.

- 환대
- 미용
- 인생사진
- 식사
- 노래
- 박수/춤

## D4-01

세 파트로 구성한다.

1. Cleanup
2. Unification Observatory
3. Return Home

엔딩에서 다시 일상으로 돌아오는 메시지가 남아야 한다.

---

# 11. Memory System

Memory는 score가 아니다.

예시 key:

```text
M01_FIRST_HEART
M02_FOUR_TENTS
M03_BUS_STOP
M04_THREE_TRUCKS
M05_VILLAGE_BROADCAST
M06_EIGHTY_MEALS
M07_GANGWON_LOWNESS
M08_1004_CAR
M09_THRESHOLD
M10_MEAL
M11_MICROPHONE
M12_OBSERVATORY
```

표현:

`9 / 12 MEMORIES`

금지:

`100% CLEAR`

Album은 2×6 또는 3×4 card grid를 사용한다.

---

# 12. Dialogue / Text 규칙

대사는 짧아야 한다.

- 최대 2줄
- 한 줄 약 18~22자 권장
- 설명문보다 현장 언어 우선
- 자동 줄바꿈
- 모든 한국어 UI 문자열은 코드에 흩뿌리지 말고 data/resource로 분리

실제 기록에 없는 인물의 신앙고백·성과·대화를 사실처럼 추가하지 않는다.

---

# 13. NPC 구현

복잡한 AI가 필요하지 않다.

FSM으로 충분하다.

```text
Idle
→ LookAtTarget
→ Walk
→ Interact
→ React
→ ReturnIdle
```

군중은 animation phase를 random offset으로 분산한다.

동시에 같은 동작을 반복하는 복제인간처럼 보이지 않게 한다.

---

# 14. Camera

플레이어에게 직접 camera control을 주지 않는다.

지원 mode:

- STATIC
- FOCUS
- PAN
- ZOOM_OUT
- CLOSEUP

카메라는 내러티브를 안내하는 역할이다.

특히 D3-02의 camera motion은 빠르거나 과장되지 않아야 한다.

---

# 15. Asset Pipeline

제공된 이미지 중 일부는 **production-ready transparent sprite가 아니라 asset/reference sheet일 수 있다.**

따라서 다음 원칙을 지킨다.

1. 원본 이미지 파일은 절대 destructive edit하지 않는다.
2. `/public/assets/raw` 등 raw 영역에 원본을 보존한다.
3. 실제 게임에서 사용하는 개별 asset은 별도 processed 영역으로 분리한다.
4. sprite extraction이 필요하면 crop 좌표와 source filename을 manifest에 남긴다.
5. 배경 grid나 주변 요소가 crop에 섞였는데도 transparent sprite인 것처럼 속이지 않는다.
6. 완성도가 부족한 asset은 임의 생성하지 말고 placeholder + `TODO_ASSET` 처리한다.
7. 동일 캐릭터 방향/pose의 일관성을 우선한다.
8. pixel art에는 nearest-neighbor scaling을 사용한다.

권장 manifest:

```ts
interface AssetEntry {
  id: string;
  source: string;
  rect?: { x: number; y: number; w: number; h: number };
  anchor?: { x: number; y: number };
  status: 'ready' | 'crop-needed' | 'placeholder';
  tags: string[];
}
```

---

# 16. Audio

BGM:

```text
BGM_GOING
BGM_WORK
BGM_FEAST
BGM_HOME
```

필수 SFX:

```text
SFX_BUS
SFX_DOOR_OPEN
SFX_FOOTSTEP
SFX_BRICK
SFX_TRUCK
SFX_PHONE
SFX_VILLAGE_SPEAKER
SFX_COOKING
SFX_CAMERA
SFX_MIC
SFX_CLAP
SFX_WIND
```

중요 SFX 발생 시 BGM ducking을 지원한다.

D3-02에서는 BGM을 거의 0까지 내린다.

오디오 에셋이 아직 없다면 fake copyrighted asset을 추가하지 말고 manifest / placeholder만 구성한다.

---

# 17. Accessibility / Mobile UX

반드시 반영:

- 주요 Tap target 48dp 이상
- Hold progress 시각화
- 색상만으로 상태 표현 금지
- 작은 글자 금지
- safe area 대응
- 진동 On / Off
- BGM / SFX 설정 가능 구조
- 4초 입력 없음 → subtle glow
- 8초 입력 없음 → 짧은 hint

20~30초 동안 입력이 없어도 실패시키지 않는다.

---

# 18. 코드 품질 규칙

### TypeScript

- `strict: true`
- 불필요한 `any` 금지
- magic string 대신 union / enum / typed constants
- Scene id / Memory id를 type-safe하게 관리

### 책임 분리

하나의 파일에 다음을 섞지 않는다.

- scene orchestration
- UI
- save
- audio
- input
- asset loading
- narrative data

파일이 300~350 lines를 넘기기 시작하면 책임 분리 필요성을 검토한다.

거대한 `game.ts` 하나에 모든 로직을 넣지 마라.

### Side Effect

- 저장은 SaveManager
- 오디오는 AudioManager
- scene transition은 SceneManager
- input은 Interaction layer

각 책임을 명확히 분리한다.

---

# 19. 테스트 요구사항

최소한 다음을 자동 테스트한다.

### Unit

- Hold progress retain
- scene transition
- save/load
- duplicate memory 방지
- save migration fallback
- NPC Positive / Neutral / Decline가 동일한 progress를 제공

### Integration / Smoke

- 새 게임 → D1 진입
- Scene 완료 → 다음 Scene
- 앱 재시작 → 저장 Scene 복귀
- D3-02 진행 가능
- Ending → Memory Album

### Regression Guard

코드 또는 문자열 검색으로 아래 표현이 핵심 게임 UI에 들어가지 않았는지 확인한다.

```text
MISSION CLEAR
SUCCESS
GAME OVER
SCORE
RANK
```

단, 테스트명/문서 설명에 포함되는 것은 허용한다.

---

# 20. 구현 순서

## Phase 0 — Audit

- repo 확인
- 실행
- asset inventory
- gap report

## Phase 1 — Foundation

- app boot
- SceneDefinition
- SceneRunner
- GameState
- SaveManager
- TapInteraction
- HoldInteraction
- CameraController
- AudioManager skeleton
- basic UI

완료 후 build/test.

## Phase 2 — Vertical Slice

**반드시 먼저 아래 3개만 완성도 있게 구현한다.**

1. `D2-01 BRICKS`
2. `D3-02 THE THRESHOLD`
3. `D3-03 VILLAGE FEAST`

이 세 Scene은 각각 다음을 검증한다.

- 노동감
- 감정적 정지
- 공동체의 기쁨

Vertical Slice가 작동하기 전 전체 12 Scene을 한꺼번에 얇게 만들지 않는다.

## Phase 3 — Full Narrative

D1 → D4 전체 구현.

## Phase 4 — Memory / Save / Ending

- Memory Album
- 재개
- 엔딩
- 다시 기억하기

## Phase 5 — Polish

- sound
- camera rhythm
- crowd offset
- dialogue shorten
- haptics
- transitions

## Phase 6 — QA

- mobile viewport
- low-end performance
- save restore
- no-failure flow
- full 10~15 min run

---

# 21. 성능 목표

초기 목표:

- 일반 Android 모바일 브라우저에서 안정적 60fps 지향
- 대규모 실시간 AI 없음
- 불필요한 full-resolution sheet를 동시에 GPU에 올리지 않음
- texture atlas / lazy load는 실제 필요에 따라 적용
- Scene 전환 시 필요 asset preload
- memory leak 점검

성능 최적화를 이유로 narrative timing을 무너뜨리지 않는다.

---

# 22. 개발 중 기능 추가 판단식

새 기능을 넣고 싶을 때 아래 질문을 먼저 적용하라.

> **이 기능이 플레이어가 그때의 사람과 장면을 더 잘 기억하게 하는가?**

- YES → 작은 구현으로 검토
- NO → 제외
- MAYBE → MVP 이후 backlog

새 기능이 재미있다는 이유만으로 넣지 않는다.

---

# 23. 구현 완료 Definition of Done

MVP 완료 조건:

- [ ] D1~D4가 순서대로 재생된다.
- [ ] 모든 필수 플레이가 Tap / Hold만으로 가능하다.
- [ ] Game Over가 없다.
- [ ] 전도 NPC의 반응이 성공/실패 점수로 변환되지 않는다.
- [ ] D2 노동감이 존재하되 과도하게 길지 않다.
- [ ] D3-02가 제품의 가장 절제된 Hero Scene으로 작동한다.
- [ ] Memory 12개 구조가 있다.
- [ ] Local Save / Resume가 된다.
- [ ] D4 통일전망대 → 귀환 → Ending까지 이어진다.
- [ ] 실제 기록에 없는 사실을 임의 생성하지 않았다.
- [ ] mobile viewport에서 핵심 UI가 가려지지 않는다.
- [ ] lint/typecheck/test/build가 통과한다.
- [ ] 전체 플레이가 대략 10~15분 범위다.

---

# 24. 작업 보고 형식

각 구현 단계가 끝날 때 반드시 아래 형식으로 보고하라.

```text
## IMPLEMENTATION REPORT

### 완료
- ...

### 변경 파일
- path — 변경 이유

### 테스트
- command — PASS/FAIL

### PRD/GDD Acceptance Criteria
- [x] ...
- [ ] ...

### 남은 Risk / TODO
- ...

### 다음 우선순위
1. ...
2. ...
```

`완료했다`고 말하기 전에 실제 build/test 결과를 확인하라.

---

# 25. 지금 실행할 첫 작업

지금부터 다음 순서로 실제 작업을 시작하라.

1. repo audit
2. PRD/GDD/고성로그 읽기
3. asset inventory
4. 실행 및 build 상태 확인
5. Gap report 작성
6. 필요한 경우 최소 scaffold 구성
7. Phase 1 Foundation 구현
8. build/test
9. Phase 2 Vertical Slice 3 Scene 구현
10. 결과 보고

**문서를 다시 요약하는 데서 끝내지 말고 실제 코드 수정까지 진행하라.**

다만 기존 저장소에서 큰 구조 변경, 대량 삭제, 스택 전환이 필요하다면 먼저 그 이유와 영향범위를 명시하고 최소 변경안을 우선 선택하라.
