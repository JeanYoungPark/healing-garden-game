// 🎨 Healing Garden - Decoration Item Configurations

import { ImageSourcePropType } from 'react-native';

// 꾸미기 모달 카피바라 오버레이 위치 (kapyWidth/kapyHeight 비율 기반)
interface ModalOverlay {
  image: ImageSourcePropType;
  imageWidth: number;       // 원본 이미지 너비 (비율 계산용)
  imageHeight: number;      // 원본 이미지 높이
  widthRatio: number;       // kapyWidth 대비 크기 비율
  topRatio: number;         // kapyHeight 대비 top 위치
  rightRatio: number;       // kapyWidth 대비 right 위치
}

// 메인 정원 카피바라 오버레이 위치 (base units, * scale 적용)
interface MainOverlay {
  image: ImageSourcePropType;
  width: number;
  height: number;
  top: number;
  right: number;
}

export interface DecorationConfig {
  id: string;
  name: string;
  emoji: string;
  image?: ImageSourcePropType;      // 슬롯 아이콘
  description: string;
  modalOverlay?: ModalOverlay;      // 꾸미기 모달 오버레이
  mainOverlay?: MainOverlay;        // 메인 정원 오버레이
}

export const DECORATION_CONFIGS: Record<string, DecorationConfig> = {
  glasses: {
    id: 'glasses',
    name: '안경',
    emoji: '👓',
    image: require('../assets/garden/props/eyeglasses.png'),
    description: '올빼미가 선물한 귀여운 안경',
    modalOverlay: {
      image: require('../assets/garden/props/capybara-glasses.png'),
      imageWidth: 189,
      imageHeight: 76,
      widthRatio: 0.35,
      topRatio: 0.37,
      rightRatio: 0.17,
    },
    mainOverlay: {
      image: require('../assets/animations/capybara-eyeclasses.png'),
      width: 56,
      height: 28,
      top: 37,
      right: -7,
    },
  },
  // 추후 추가 예시:
  // hat: {
  //   id: 'hat',
  //   name: '모자',
  //   emoji: '🎩',
  //   image: require('../assets/garden/props/hat.png'),
  //   description: '귀여운 모자',
  //   modalOverlay: {
  //     image: require('../assets/garden/props/capybara-hat.png'),
  //     imageWidth: 200, imageHeight: 150,
  //     widthRatio: 0.4, topRatio: 0.05, rightRatio: 0.2,
  //   },
  //   mainOverlay: {
  //     image: require('../assets/animations/capybara-hat.png'),
  //     width: 50, height: 40, top: 10, right: -5,
  //   },
  // },
};
