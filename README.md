# GOSEONG : 다시, 그 여름

2026년 8월 3일–6일 고성 아웃리치의 실제 기록을 Tap / Hold만으로 다시 걷는 모바일 인터랙티브 기억앨범입니다.

**플레이:** <https://jakjac7.github.io/2026-GOSEONG/>

## 경험 원칙

- 점수, 랭크, 게임오버 없이 4일의 기억을 순서대로 걷습니다.
- 플레이어는 Tap / Hold만 사용하며 이동과 카메라는 자동입니다.
- `D3-02 교회 문턱`에서 플레이어는 문만 열고, 인물은 스스로 들어옵니다.
- 마지막은 “내게 고성아웃리치란…” 로컬 방명록으로 마무리됩니다.

## 실행

```bash
pnpm install
pnpm assets
pnpm dev
```

검증:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

## 폴더 구조

```text
src/
  core/          상태, 저장, 오디오
  data/          장면과 기억 데이터
  interaction/   Hold 입력
  scene/         Phaser 기반 장면 렌더러
  styles/        모바일 UI와 오버레이
  ui/            앱, 앨범, 엔딩/방명록
public/assets/
  raw/           제공 원본 이미지(수정 금지)
  processed/     게임용 슬라이스 결과
scripts/         재현 가능한 에셋 처리
tests/           상태·저장·입력·내러티브 회귀 테스트
```

## 에셋 파이프라인

원본 15장은 `public/assets/raw`에 그대로 보존됩니다. `scripts/process_assets.py`가 crop 좌표를 기준으로 게임용 WebP를 만들고, `public/assets/processed/asset-manifest.json`에 원본 파일·좌표·용도를 기록합니다. 레퍼런스 시트의 격자가 남은 crop은 투명 스프라이트로 위장하지 않고 기억카드/스티커 형태로 사용합니다.

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 에셋 처리, lint, test, build를 실행한 뒤 GitHub Pages에 배포합니다.

## Source of Truth

1. `고성로그.md`
2. `Goseong_prd.md`
3. `Goseong_gdd.md`
4. `AGENTS.md`

기록에 없는 실제 사건·대사·영적 결과는 임의로 만들지 않습니다.
