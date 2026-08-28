import { ASSETS } from './assets';
import type { MemoryDefinition, MemoryId } from '../core/types';

export const MEMORIES: readonly MemoryDefinition[] = [
  {
    id: 'M01_FIRST_HEART',
    title: '첫 마음',
    caption: '도착하자마자 먼저 예배로.',
    image: ASSETS.churchInterior,
  },
  {
    id: 'M02_FOUR_TENTS',
    title: '천막 네 동',
    caption: '볕 아래 머물 자리를 함께 만들었다.',
    image: ASSETS.tents,
  },
  {
    id: 'M03_BUS_STOP',
    title: '경동대 버스정류장',
    caption: '낭만적이지 않은 반응까지 기억한다.',
    image: ASSETS.bus,
  },
  {
    id: 'M04_THREE_TRUCKS',
    title: '벽돌 세 트럭',
    caption: '땀이 기억보다 먼저 남았던 날.',
    image: ASSETS.brickTruck,
  },
  {
    id: 'M05_VILLAGE_BROADCAST',
    title: '마을방송',
    caption: '한 집의 연결이 마을 전체로 번졌다.',
    image: ASSETS.doorProp,
  },
  {
    id: 'M06_EIGHTY_MEALS',
    title: '80인분',
    caption: '좁은 부엌에 손이 하나둘 모였다.',
    image: ASSETS.mealTable,
  },
  {
    id: 'M07_PRAYER_NORTH',
    title: '북쪽을 향한 기도',
    caption: '고성에서 더 먼 곳으로 시선이 넓어졌다.',
    image: ASSETS.prayerTeam,
  },
  {
    id: 'M08_1004_CAR',
    title: '1004호 차량',
    caption: '기다리는 대신 직접 모시러 갔다.',
    image: ASSETS.bus,
  },
  {
    id: 'M09_THRESHOLD',
    title: '교회 문턱',
    caption: '우리는 사람을 옮기지 않고 문을 열었다.',
    image: ASSETS.threshold,
  },
  {
    id: 'M10_MEAL',
    title: '전복삼계탕',
    caption: '함께 먹는 일이 환대의 중심이 되었다.',
    image: ASSETS.mealTable,
  },
  {
    id: 'M11_MICROPHONE',
    title: '마이크',
    caption: '강한 볕 아래서도 노래와 웃음이 이어졌다.',
    image: ASSETS.feastStage,
  },
  {
    id: 'M12_OBSERVATORY',
    title: '통일전망대',
    caption: '마을 한 사람에서 북한과 일상까지.',
    image: ASSETS.observatoryChurch,
  },
] as const;

export const memoryById = new Map<MemoryId, MemoryDefinition>(
  MEMORIES.map((memory) => [memory.id, memory]),
);
