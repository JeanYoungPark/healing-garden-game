// 🍓 Healing Garden - Plant Stage Images & Sizes

import { PlantType } from '../types';

// 단계별 이미지 크기·위치 비율 타입
export interface PlantStageSize {
  w: number;   // 너비 (plotSize 기준 비율)
  h: number;   // 높이
  mt: number;  // 위쪽 오프셋
  ml: number;  // 왼쪽 오프셋
}

// 작물별 단계 이미지 (0: 씨앗, 1: 새싹, 2: 성장, 3: 수확 가능)
export const PLANT_STAGE_IMAGES: Record<PlantType, Record<number, any>> = {
  carrot: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/carrot-stage-1.png'),
    2: require('../assets/plants/carrot-stage-2.png'),
    3: require('../assets/plants/carrot-stage-3.png'),
  },
  strawberry: {
    0: require('../assets/plants/plant-lv1.png'),
    1: require('../assets/plants/plant-lv1.png'),
    2: require('../assets/plants/plant-lv1.png'),
    3: require('../assets/plants/plant-lv1.png'),
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
};

// 단계별 이미지 크기·위치 비율 (plotSize 기준)
export const PLANT_STAGE_SIZES: Record<PlantType, PlantStageSize[]> = {
  carrot: [
    { w: 0.06, h: 0.11, mt: 0, ml: 0 },   // stage 0: 씨앗
    { w: 0.23, h: 0.28, mt: -0.1, ml: -0.03 },    // stage 1: 새싹
    { w: 0.38, h: 0.44, mt: -0.2, ml: -0.02 },    // stage 2: 성장
    { w: 0.40, h: 0.53, mt: -0.23, ml: -0.02 },   // stage 3: 수확
  ],
  strawberry: [
    { w: 0.06, h: 0.11, mt: 0.03, ml: -0.05 },
    { w: 0.2, h: 0.28, mt: -0.15, ml: -0.05 },
    { w: 0.38, h: 0.44, mt: -0.1, ml: -0.05 },
    { w: 0.40, h: 0.53, mt: -0.10, ml: -0.05 },
  ],
  watermelon: [
    { w: 0.06, h: 0.11, mt: 0.03, ml: -0.05 },
    { w: 0.2, h: 0.28, mt: -0.15, ml: -0.05 },
    { w: 0.38, h: 0.44, mt: -0.1, ml: -0.05 },
    { w: 0.40, h: 0.53, mt: -0.10, ml: -0.05 },
  ],
  peach: [
    { w: 0.06, h: 0.11, mt: 0.03, ml: -0.05 },
    { w: 0.2, h: 0.28, mt: -0.15, ml: -0.05 },
    { w: 0.38, h: 0.44, mt: -0.1, ml: -0.05 },
    { w: 0.40, h: 0.53, mt: -0.10, ml: -0.05 },
  ],
  grape: [
    { w: 0.06, h: 0.11, mt: 0.03, ml: -0.05 },
    { w: 0.2, h: 0.28, mt: -0.15, ml: -0.05 },
    { w: 0.38, h: 0.44, mt: -0.1, ml: -0.05 },
    { w: 0.40, h: 0.53, mt: -0.10, ml: -0.05 },
  ],
  apple: [
    { w: 0.06, h: 0.11, mt: 0.03, ml: -0.05 },
    { w: 0.2, h: 0.28, mt: -0.15, ml: -0.05 },
    { w: 0.38, h: 0.44, mt: -0.1, ml: -0.05 },
    { w: 0.40, h: 0.53, mt: -0.10, ml: -0.05 },
  ],
};
