// 🍓 Healing Garden - Plant Stage Images & Sizes

import { PlantType } from '../types';

// 단계별 이미지 크기·위치 비율 타입
export interface PlantStageSize {
  w: number;   // 너비 (plotSize 기준 비율)
  h: number;   // 높이
  mt?: number; // 위쪽 오프셋 (mt 또는 mb 중 하나 사용)
  mb?: number; // 아래쪽 오프셋
  ml?: number;  // 왼쪽 오프셋 (선택적, 기본값 0)
  tooltipOffset?: number;  // 툴팁 추가 오프셋 (px, 양수=위로)
}

// 공통 크기 설정
const DEFAULT_SEED_SIZE = { w: 0.06, h: 0.11, mb: 0.28 };  // 씨앗

// 작물별 크기 설정 (stage 1, 2, 3에 공통 적용)
const CARROT_SIZE = { w: 0.45, h: 0.45, mb: 0.32 };
const TURNIP_SIZE = { w: 0.7, h: 0.7, mb: 0.25 };
const POTATO_SIZE = { w: 0.6, h: 0.6, mb: 0.26, ml: -0.02 };
const STRAWBERRY_SIZE = { w: 0.6, h: 0.6, mb: 0.33, ml: -0.02 };
const WATERMELON_SIZE = { w: 0.5, h: 0.5, mt: -0.15, ml: -0.02 };
const PEACH_SIZE = { w: 0.5, h: 0.5, mt: -0.15, ml: -0.02 };
const GRAPE_SIZE = { w: 0.5, h: 0.5, mt: -0.15, ml: -0.02 };
const APPLE_SIZE = { w: 0.5, h: 0.5, mt: -0.15, ml: -0.02 };
const EGGPLANT_SIZE = { w: 0.5, h: 0.5, mt: -0.15, ml: -0.02 };

// 작물별 단계 이미지 (0: 씨앗, 1: 새싹, 2: 성장, 3: 수확 가능)
export const PLANT_STAGE_IMAGES: Record<PlantType, Record<number, any>> = {
  carrot: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/carrot-stage-1.png'),
    2: require('../assets/plants/carrot-stage-2.png'),
    3: require('../assets/plants/carrot-stage-3.png'),
  },
  turnip: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/turnip-stage-1.png'),
    2: require('../assets/plants/turnip-stage-2.png'),
    3: require('../assets/plants/turnip-stage-3.png'),
  },
  potato: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/potato-stage-1.png'),
    2: require('../assets/plants/potato-stage-2.png'),
    3: require('../assets/plants/potato-stage-3.png'),
  },
  strawberry: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/strawberry-stage-1.png'),
    2: require('../assets/plants/strawberry-stage-2.png'),
    3: require('../assets/plants/strawberry-stage-3.png'),
  },
  watermelon: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/plant-lv1.png'),
    2: require('../assets/plants/plant-lv1.png'),
    3: require('../assets/plants/plant-lv1.png'),
  },
  peach: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/plant-lv1.png'),
    2: require('../assets/plants/plant-lv1.png'),
    3: require('../assets/plants/plant-lv1.png'),
  },
  grape: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/plant-lv1.png'),
    2: require('../assets/plants/plant-lv1.png'),
    3: require('../assets/plants/plant-lv1.png'),
  },
  apple: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/plant-lv1.png'),
    2: require('../assets/plants/plant-lv1.png'),
    3: require('../assets/plants/plant-lv1.png'),
  },
  eggplant: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/plant-lv1.png'),
    2: require('../assets/plants/plant-lv1.png'),
    3: require('../assets/plants/plant-lv1.png'),
  },
};

// 단계별 이미지 크기·위치 비율 (plotSize 기준)
export const PLANT_STAGE_SIZES: Record<PlantType, PlantStageSize[]> = {
  carrot: [
    DEFAULT_SEED_SIZE,   // stage 0: 씨앗
    { ...CARROT_SIZE, tooltipOffset: -30 },    // stage 1: 새싹
    { ...CARROT_SIZE, tooltipOffset: -10 },    // stage 2: 성장
    CARROT_SIZE,   // stage 3: 수확
  ],
  turnip: [
    DEFAULT_SEED_SIZE,
    { ...TURNIP_SIZE, tooltipOffset: -70 },
    { ...TURNIP_SIZE, tooltipOffset: -20 },
    TURNIP_SIZE,
  ],
  potato: [
    DEFAULT_SEED_SIZE,
    POTATO_SIZE,
    POTATO_SIZE,
    POTATO_SIZE,
  ],
  strawberry: [
    DEFAULT_SEED_SIZE,
    { ...STRAWBERRY_SIZE, tooltipOffset: -50 },
    { ...STRAWBERRY_SIZE, tooltipOffset: -20 },
    STRAWBERRY_SIZE,
  ],
  watermelon: [
    DEFAULT_SEED_SIZE,
    WATERMELON_SIZE,
    WATERMELON_SIZE,
    WATERMELON_SIZE,
  ],
  peach: [
    DEFAULT_SEED_SIZE,
    PEACH_SIZE,
    PEACH_SIZE,
    PEACH_SIZE,
  ],
  grape: [
    DEFAULT_SEED_SIZE,
    GRAPE_SIZE,
    GRAPE_SIZE,
    GRAPE_SIZE,
  ],
  apple: [
    DEFAULT_SEED_SIZE,
    APPLE_SIZE,
    APPLE_SIZE,
    APPLE_SIZE,
  ],
  eggplant: [
    DEFAULT_SEED_SIZE,
    EGGPLANT_SIZE,
    EGGPLANT_SIZE,
    EGGPLANT_SIZE,
  ],
};
