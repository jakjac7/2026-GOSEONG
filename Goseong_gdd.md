# GOSEONG — Game Design Document

**Project Name:** GOSEONG : 다시, 그 여름  
**File:** `Goseong_gdd.md`  
**Version:** MVP Design v1.0  
**Platform:** Mobile Web / Android  
**Orientation:** Portrait preferred / Landscape optional depending on final art composition  
**Target Session:** 10–15 minutes  
**Input:** Tap / Hold only  
**Design Basis:** Goseong PRD + 2026 고성 아웃리치 Journey Log + 제공 픽셀 아트 에셋

---

# 1. Game Overview

## 1.1 Core Loop

```text
장면 진입
  ↓
짧은 관찰
  ↓
Tap 또는 Hold
  ↓
NPC / 공간 변화
  ↓
Memory 획득
  ↓
짧은 여운
  ↓
다음 장면 자동 이동
```

전체 루프에서 플레이어가 해야 하는 행동은 거의 동일하다.

- 누른다.
- 기다린다.
- 함께한다.
- 다음 장면으로 이동한다.

조작의 단순함 대신 **장면·사운드·NPC 반응의 변화량**으로 플레이 경험을 만든다.

---

# 2. Game State Architecture

```text
BOOT
 ↓
TITLE
 ↓
INTRO
 ↓
DAY_1
 ↓
DAY_2
 ↓
DAY_3
 ↓
DAY_4
 ↓
ENDING
 ↓
MEMORY_ALBUM
```

각 DAY는 여러 Scene으로 구성한다.

```text
DAY
 ├─ SCENE_INTRO
 ├─ SCENE_A
 ├─ SCENE_B
 ├─ SCENE_C
 └─ DAY_OUTRO
```

---

# 3. Save Structure

서버 없이 로컬 저장을 기본으로 한다.

### Save Data Example

```ts
interface SaveData {
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

### Save Timing

- Scene 종료 직후
- Day 전환 직후
- App Background 진입 시

---

# 4. Input System

## 4.1 TAP

### 사용처

- 문 열기
- NPC 선택
- 물건 전달
- 다음 대사
- 차량 출발
- 소품 상호작용
- Memory 확인

### Tap Feedback

1. UI scale 95% → 100%
2. 짧은 vibration optional
3. sprite animation trigger
4. contextual SFX

---

## 4.2 HOLD

### Default Hold Duration

`0.8 sec`부터 Hold로 인식.

### Hold Progress

권장 범위:

- 짧은 행동: 1.5 sec
- 일반 행동: 2.5 sec
- 반복 노동: 4~6 sec
- 기도 장면: 고정 completion 없음, 최소 3 sec 후 자연 종료 가능

### Hold Release

손을 떼면 실패하지 않는다.

```text
progress = retain current progress
```

일부 장면에서는 천천히 progress가 감소하지 않고 그대로 유지한다.

---

# 5. Scene Design

# DAY 1 — Hello, 고성

---

## D1-01 — BUS TO GOSEONG

### Objective
서울에서 고성으로 이동하는 감각을 전달한다.

### Duration
30–45 sec

### Interaction
None / Tap to observe optional hotspots

### Visual Sequence

```text
서울 도심
→ 고속도로
→ 산
→ 동해
→ 고성
```

### UI

```text
2026. 8. 3
DAY 1
Hello, 고성
```

### Audio
- Bus engine ambience
- GOING BGM
- occasional turn signal / road noise

### Exit Condition
자동 종료.

---

## D1-02 — OPENING WORSHIP

### Location
설악산선교교회 내부

### Character Count
약 8~15명 화면 노출

### Interaction
`HOLD`

### Flow

1. 팀원들이 자유롭게 앉아 있음.
2. Hold 시작.
3. 주변 인물이 하나씩 기도 자세로 전환.
4. 배경음 감소.
5. 화면 밝기가 미세하게 안정됨.
6. Hold 완료 후 짧은 자막.

### Text

> 첫 마음으로 시작합니다.

### Memory
`M01_FIRST_HEART`

---

## D1-03 — TENT SETUP

### Location
설악산교회 마당

### Props
- Tent × 4
- Large Fan
- Portable AC

### Interaction
Tap + Hold

### Flow

```text
접힌 천막
 ↓ TAP
2명 합류
 ↓ HOLD
천막 펼쳐짐
 ↓
추가 팀원 합류
```

네 개의 천막을 모두 개별 조작시키지 않는다.

- 1호: 직접 플레이
- 2~4호: montage 처리

### Memory
`M02_FOUR_TENTS`

---

## D1-04 — FOREIGN STUDENT OUTREACH

### Location
경동대 버스정류장

### NPC State

```text
WALKING
APPROACHABLE
RESPOND_POSITIVE
RESPOND_NEUTRAL
RESPOND_DECLINE
LEAVE
```

### Player Interaction
NPC Tap

### Item Animation
랜덤 표시:

- 전도지
- 선크림
- 십자가 목걸이

### Response Probability
점수나 성공률이 아니며 장면 다양성을 위한 확률.

```text
Positive: 30%
Neutral: 40%
Decline: 30%
```

### Important Rule
모든 반응은 같은 gameplay progress를 제공한다.

### Exit
NPC 3명 상호작용 후 자동 종료.

### Memory
`M03_BUS_STOP`

---

# DAY 2 — 우리가 땀을 흘렸다

---

## D2-01 — BRICKS

### Design Goal
의도적인 반복을 통해 노동의 무게를 짧게 느끼게 한다.

### Duration
60–90 sec

### Location
설악산교회 ↔ 아야진교회 작업공간

### Interaction
`HOLD`

### Cycle

```text
벽돌 더미
 ↓ HOLD 3 sec
벽돌 운반
 ↓
트럭 적재량 증가
 ↓
짧은 숨 고르기
```

3번 반복.

### Visual Reinforcement

- 처음: 혼자 들기 시작
- 2회차: 다른 팀원 합류
- 3회차: 여러 명이 chain 형태로 옮김

### No Speed Bonus
연속 탭으로 속도를 높일 수 없다.

### Memory
`M04_THREE_TRUCKS`

---

## D2-02 — DOOR TO DOOR

### Location
성천리 / 원암리

### Map Structure
복잡한 맵 탐험 금지.

3개 집을 좌우 슬라이드식 vignette로 표현한다.

### House State

```text
EMPTY
SHORT_TALK
DECLINE
CONNECT_TO_VILLAGE_HEAD
```

### Interaction
문 Tap

### Special Event
세 번째 집에서 주민이 이장과 연결한다.

Animation:

```text
주민
  ↓
전화 아이콘
  ↓
이장
  ↓
스피커
  ↓
마을 전체
```

### Memory
`M05_VILLAGE_BROADCAST`

---

## D2-03 — 80 SERVINGS

### Location
설악산선교교회 예배당

### Interaction
Hold

### Main Counter

```text
80
↓
63
↓
41
↓
17
↓
0
```

실제 80회 입력은 요구하지 않는다.

### Visual Growth

시작:
- 2명

중반:
- 예배당에 팀원들이 하나둘 모임

후반:
- 모두가 한자리에 모여 생닭의 속을 채움

### Props
- 닭
- 찹쌀
- 마늘
- 전복
- 냄비
- 테이블

### Memory
`M06_EIGHTY_MEALS`

---

## D2-04 — LOWLINESS FOR GANGWON EVANGELIZATION

### Time
Night

### Location
설악산선교교회

### Interaction
Hold

### Camera

```text
교회 내부
↓ zoom out
교회 외부
↓
고성
↓
강원도 구석구석의 마을과 교회
```

### Sound
WORK BGM fade out → ambient pad

### Haptic
Hold 시작 시 1회만 subtle vibration.

### Memory
`M07_GANGWON_LOWNESS`

---

# DAY 3 — 사람들이 교회 안으로 들어왔다

DAY 3은 전체 게임의 감정적 중심이다.

---

## D3-01 — PICKUP

### Location
성천마을회관 / 마을길

### Starting State
예상보다 적은 인원.

### Dialogue

> 어? 생각보다 많이 안 오셨네.

### Interaction
차량 Tap

### Sequence

```text
마을회관
→ 집 1
→ 집 2
→ 공공근로 지점
→ 교회
```

각 정류장마다 차량 내 인원이 조금씩 증가한다.

### Special Prop
차량 번호 `1004`는 Easter Egg로 표시 가능.

### Memory
`M08_1004_CAR`

---

## D3-02 — THE THRESHOLD

### Priority
**Game Hero Scene**

### Design Rule
UI 최소화 / BGM 거의 제거 / 연출 절제.

### Initial Camera
교회 내부에서 문을 바라보는 구도.

문 밖에 어르신 silhouette.

### Interaction
`TAP DOOR`

### Animation Timing

```text
0.0 sec  Tap
0.2 sec  handle move
0.6 sec  door begins open
1.5 sec  full open
2.0 sec  elder pauses
3.0 sec  first step
4.5 sec  enters church
```

### Crucial Rule
플레이어가 어르신을 Drag하거나 강제로 이동시키지 않는다.

플레이어는 **문만 연다.**

NPC는 스스로 들어간다.

### Sound
- door hinge
- footsteps
- room ambience

### No UI

다음 금지:

- SUCCESS
- Mission Clear
- Score
- Confetti

### Memory
`M09_THRESHOLD`

### Scene Exit
2~3명의 어르신이 차례로 들어간 뒤 fade.

---

## D3-03 — VILLAGE FEAST

한 개의 긴 미니게임이 아니라 여러 vignette를 짧게 이어 붙인다.

### Vignette A — Welcome
NPC Tap

→ 어깨 마사지 / 물 전달

### Vignette B — Hair & Makeup
NPC Tap

→ 염색 / 화장

### Vignette C — Portrait
Camera prop Tap

→ flash

### Vignette D — Meal
Table Tap

→ 전복삼계탕 제공

### Vignette E — Singing
Microphone Tap

→ 어르신 노래

### Vignette F — Together
Stage Tap

→ 여러 캐릭터 박수 / 웃음 / 춤

### Optional Environmental Event
강한 햇빛 표현 후 바람이 불며 천막 천이 흔들림.

### Memories

- `M10_MEAL`
- `M11_MICROPHONE`

### Sound
FEAST BGM

---

# DAY 4 — 우리는 다시 삶으로 돌아갔다

---

## D4-01A — CLEANUP

### Location
전날 잔치 공간

### Interaction
Tap objects

Objects:

- 의자
- 박스
- 배너
- 천막

Tap하면 즉시 사라지는 대신 정리 animation을 보여준다.

### Narrative Effect
사람으로 가득했던 공간이 다시 비어간다.

---

## D4-01B — UNIFICATION OBSERVATORY

### Location
통일전망대 / 통일전망대교회

### Interaction
Hold

### Camera

```text
팀원들
↓
전망대
↓
바다 / 산
↓
북쪽 방향
```

### Text

> 여기에서 끝나는 것이 아니라,
> 다시 우리의 삶으로.

### Memory
`M12_OBSERVATORY`

---

## D4-01C — RETURN HOME

### Structure
D1 버스 이동 장면을 반대로 사용.

```text
고성
→ 산
→ 고속도로
→ 서울
```

### Visual Callback
D1에 사용했던 캐릭터가 같은 자리로 돌아온다.

### Final Text

> 고성은 끝났지만
> 우리가 돌아갈 곳은 다시 우리의 삶이었다.

---

# 6. Memory Album

## 6.1 Album UI

2×6 또는 3×4 카드 배치.

```text
[M01] [M02] [M03]
[M04] [M05] [M06]
...
```

잠기지 않은 기억은 이미지 + 한 줄 텍스트.

예:

### 벽돌 세 트럭
> 땀이 기억보다 먼저 남았던 날.

### 교회 문턱
> 우리가 사람을 안으로 옮긴 것이 아니라, 문을 열어두었다.

### 통일전망대
> 마을 한 사람에서 더 먼 곳까지 시선이 넓어졌다.

---

# 7. Dialogue System

대화는 최소화한다.

## Rule

- 최대 2줄
- 한 줄 18~22자 권장
- 설명문보다 현장 언어 우선
- 플레이 흐름을 막지 않음

### Dialogue Box Types

1. Normal speech
2. Narrative caption
3. Memory caption

### Example

```text
[팀원]
어? 생각보다 많이 안 오셨네.
```

```text
[NARRATION]
그래서 직접 모시러 갔다.
```

---

# 8. NPC AI

복잡한 AI 불필요.

State Machine 기반으로 충분하다.

```ts
Idle
→ LookAtTarget
→ Walk
→ Interact
→ React
→ ReturnIdle
```

### Crowd NPC

각 NPC는 서로 다른 idle animation offset을 사용하여 군중이 동시에 움직이지 않도록 한다.

```ts
idleDelay = random(0, 2.5)
```

---

# 9. Camera System

카메라는 플레이어가 직접 조작하지 않는다.

## Camera Modes

### STATIC
일반 장면.

### FOCUS
Tap 대상 확대.

### PAN
마을 / 행사 공간 이동.

### ZOOM_OUT
기도 / 통일전망대.

### CLOSEUP
D3-02 교회 문턱.

---

# 10. Art Implementation

## 10.1 Sprite Scale

권장 reference:

- Character: 48–96 px base sprite
- Large prop: 128–256 px
- Building: modular composition

실제 해상도는 사용 엔진과 화면 비율에 맞게 조정한다.

## 10.2 Character Requirements

필수 animation:

- idle
- walk
- hold / carry
- pray
- clap
- talk
- sit

일부 role-specific:

- microphone
- cooking
- camera
- makeup
- brick carrying

---

# 11. Scene Asset Map

| Scene | Required Assets |
|---|---|
| D1-01 | bus, road, mountain, sea |
| D1-02 | church interior, chairs, team characters |
| D1-03 | tents, fans, AC, church yard |
| D1-04 | bus stop, students, leaflet, sunblock, necklace |
| D2-01 | bricks, truck, workers |
| D2-02 | village houses, doors, village speaker |
| D2-03 | kitchen, table, chicken, pots, food props |
| D2-04 | church night state, praying poses |
| D3-01 | SUV/van, elders, village hall |
| D3-02 | church door, elders, interior threshold |
| D3-03 | makeup, camera, meal tables, stage, microphone, tents |
| D4-01 | cleanup props, observatory, coast, bus return |

---

# 12. Audio Implementation

## BGM

```text
BGM_GOING
BGM_WORK
BGM_FEAST
BGM_HOME
```

## Essential SFX

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

### Mixing Rule

Narrative-important SFX가 발생하면 BGM volume ducking:

```text
BGM volume → -8dB for 1.2 sec
```

D3-02에서는 BGM을 거의 0까지 내린다.

---

# 13. Accessibility

- 모든 주요 상호작용 영역 최소 48dp 이상
- Hold 진행을 시각적으로 표시
- 작은 텍스트 금지
- 긴 대사 자동 줄바꿈
- 진동 On / Off 제공
- BGM / SFX 독립 On / Off optional
- 색만으로 상태 구분하지 않음

---

# 14. UX Rules

## Interaction Prompt

기본적으로 손가락 아이콘과 1~2단어만 사용한다.

Examples:

```text
TAP
HOLD
열기
함께하기
```

## Hint Timing

- 4 sec 입력 없음 → subtle glow
- 8 sec 입력 없음 → short text hint

자동 진행은 20~30 sec 이후만 고려한다.

---

# 15. Scene Transition

기본:

```text
Fade 250ms
→ black 150ms
→ next scene fade-in 350ms
```

Day transition:

```text
DAY 2
우리가 땀을 흘렸다
```

2 sec 표시.

---

# 16. Ending Implementation

## Ending Card Sequence

각 카드 1.5 sec.

```text
8.3
Hello, 고성.
```

```text
8.4
우리가 땀을 흘렸다.
```

```text
8.5
사람들이 교회 안으로 들어왔다.
```

```text
8.6
우리는 다시 삶으로 돌아갔다.
```

Final:

```text
GOSEONG
2026. 8. 3 — 8. 6

주의 마음, 품 고!성!
```

Button:

`다시 기억하기`

Secondary button optional:

`기억 보기`

---

# 17. Technical Architecture Recommendation

MVP에는 복잡한 엔진 구조보다 데이터 기반 Scene Runner를 권장한다.

```ts
interface SceneDefinition {
  id: string;
  day: number;
  background: string;
  actors: ActorDefinition[];
  interactions: InteractionDefinition[];
  memoryReward?: string;
  nextScene?: string;
}
```

### Advantages

- 장면 추가가 쉽다.
- 코드 중복이 줄어든다.
- 텍스트·에셋 교체가 쉽다.
- 1인 개발에 적합하다.

---

# 18. Suggested Source Structure

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
  /actors
    Actor.ts
    ActorState.ts
  /interaction
    TapInteraction.ts
    HoldInteraction.ts
  /ui
    DialogueBox.ts
    DayTitle.ts
    HoldIndicator.ts
    MemoryToast.ts
  /audio
    AudioManager.ts
  /data
    scenes.ts
    memories.ts
    dialogue.ts
```

---

# 19. Production Priority

## P0 — Must Have

- Scene Runner
- Tap
- Hold
- Character idle / walk
- Scene transition
- Save
- 12 MVP scenes
- Ending

## P1 — Strongly Recommended

- Memory Album
- Camera focus / zoom
- subtle vibration
- multiple NPC reactions
- environment animation

## P2 — Optional Polish

- Photo frame effect
- particle effects
- dynamic weather
- richer crowd animation
- hidden easter eggs

---

# 20. Development Milestones

## M1 — Vertical Slice

Implement:

- D2-01 Bricks
- D3-02 Threshold
- D3-03 Feast

이 세 장면만으로 게임의 핵심 감정이 작동하는지 먼저 검증한다.

### Pass Criteria

- Tap / Hold가 직관적
- 조작보다 장면에 집중됨
- D2 반복이 귀찮지만 너무 길지 않음
- D3-02에서 실제 감정적 정지가 발생함

---

## M2 — Full Narrative

D1~D4 전 장면 구현.

---

## M3 — Polish

- Sound
- Camera
- Crowd timing
- Dialogue shortening
- transition rhythm

---

## M4 — Community Test

실제 아웃리치 참가자에게 플레이시킨다.

질문:

1. 가장 기억이 떠오른 장면은?
2. 실제와 어색했던 장면은?
3. 너무 게임 같았던 부분은?
4. 너무 설명적이었던 부분은?
5. 엔딩 이후 어떤 생각이 들었는가?

---

# 21. QA Checklist

## Core

- [ ] 모든 장면 Tap 또는 Hold만으로 완료 가능
- [ ] 모든 장면에 Skip 불가능한 긴 입력이 없음
- [ ] Game Over 없음
- [ ] NPC 반응이 실패로 표시되지 않음

## Narrative

- [ ] D1 첫 마음이 전달됨
- [ ] D2 반복 노동이 존재함
- [ ] D3 마을잔치가 명확한 Peak
- [ ] D3-02 문턱에 점수 / 성공 UI 없음
- [ ] D4에서 다시 일상으로 연결됨

## UX

- [ ] Tap target 48dp 이상
- [ ] Hold 상태 명확
- [ ] 8초 이상 멈출 경우 Hint
- [ ] UI가 캐릭터 얼굴 / 핵심 액션을 가리지 않음

## Audio

- [ ] D3-02 BGM 최소화
- [ ] 문 / 발걸음 소리가 명확
- [ ] 각 DAY BGM 구분됨

## Save

- [ ] Scene 종료마다 저장
- [ ] App 종료 후 재개 가능
- [ ] Ending Seen 저장

---

# 22. Final Design Rule

개발 중 새로운 기능을 넣기 전에 반드시 아래 질문을 한다.

> **이 기능이 플레이어가 그때의 사람과 장면을 더 잘 기억하게 하는가?**

YES → 검토 후 추가.

NO → 제외.

GOSEONG의 경쟁력은 기능 수가 아니라 **실제 있었던 4일을 얼마나 절제되고 정확하게 다시 걷게 하는가**에 있다.
