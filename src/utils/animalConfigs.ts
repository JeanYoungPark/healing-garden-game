// 🐰 Healing Garden - Animal Configurations

import { Dimensions, ImageSourcePropType } from 'react-native';
import { AnimalType, PlantType } from '../types';

const { width: screenWidth } = Dimensions.get('window');

// 정원 내 렌더링 위치
// beside-capybara: 카피바라 옆에 나란히 (기본, index 기반 자동 배치)
// custom: containerStyle로 직접 위치 지정
export type AnimalRenderPosition = 'beside-capybara' | 'custom';

export interface AnimalRenderConfig {
  position: AnimalRenderPosition;
  // custom 위치일 때 사용
  containerStyle?: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    width: number;
    height: number;
    zIndex: number;
    marginLeft?: number;
  };
}

export interface AnimalConfig {
  type: AnimalType;
  name: string;        // 표시 이름
  nickname: string;    // 별명 (알럿용)
  emoji: string;
  collectionImage?: ImageSourcePropType; // 도감 수집 후 이미지
  collectionShadow?: ImageSourcePropType; // 도감 미수집 그림자 이미지
  // 도감 이미지 위치 조정 (비율 기반, 아이템 박스 기준)
  collectionStyle?: {
    heightRatio?: number;  // 아이템 박스 높이 대비 비율 (기본 0.5)
    topRatio?: number;     // 아이템 박스 높이 대비 top 비율 (기본 0.12)
    leftRatio?: number;    // 아이템 박스 너비 대비 left 비율 (기본 0.13)
  };
  // 정원 내 렌더링 설정
  render: AnimalRenderConfig;
  giftType?: 'seed' | 'water' | 'gold' | 'decoration';  // 선물 종류
  giftSeedType?: PlantType;  // 선물로 주는 씨앗 (giftType이 'seed'일 때)
  giftSeedCount?: number;
  giftWaterCount?: number;   // 선물로 주는 물 개수 (giftType이 'water'일 때)
  giftGoldAmount?: number;   // 선물로 주는 골드 (giftType이 'gold'일 때)
  giftDecorationId?: string; // 선물로 주는 꾸미기 아이템 ID (giftType이 'decoration'일 때)
  giftMessage: string;      // 선물 알럿 메시지
  // 등장 조건
  trigger: {
    type: 'harvest';         // 특정 작물 수확 후 등장
    requiredPlant: PlantType;
  } | {
    type: 'condition';       // 특수 조건
    condition: 'visitWithoutHarvest';  // 수확 없이 접속
    requiredCount: number;
    requiredVisitor?: AnimalType;  // 이 동물을 먼저 만나야 함 (선택)
  } | {
    type: 'mailRead';        // 특정 편지를 읽은 후 등장
    requiredMailId: string;  // 읽어야 하는 편지 ID
    delayHours: number;      // 편지를 읽은 후 몇 시간 뒤 등장
  } | {
    type: 'disabled';        // 비활성화 (미구현)
  };
  // 랜덤 재등장 설정
  randomReappear?: {
    enabled: boolean;        // 랜덤 재등장 가능 여부
    probability: number;     // 등장 확률 (0.0 ~ 1.0)
    alwaysGift: boolean;     // 항상 선물 줌
    neverGift: boolean;      // 절대 선물 안 줌
    giftMessage?: string;    // 랜덤 재등장 시 선물 메시지 (다를 경우)
    randomGiftOptions?: {    // 랜덤 선물 옵션 (올빼미 전용)
      decoration?: { id: string; message: string };
      water?: { count: number; message: string };
    };
    // alwaysGift, neverGift 둘 다 false면 확률적으로 선물
  };
}

export const ANIMAL_CONFIGS: Record<AnimalType, AnimalConfig> = {
  rabbit: {
    type: 'rabbit',
    name: '토끼',
    nickname: '토깽이',
    emoji: '🐰',
    collectionImage: require('../assets/ui/common/animal-item-rabbit.png'),
    collectionShadow: require('../assets/ui/common/animal-shadow-rabbit.png'),
    collectionStyle: { heightRatio: 0.5, topRatio: 0.12, leftRatio: 0.11 },
    render: { position: 'beside-capybara' },
    giftType: 'seed',
    giftSeedType: 'strawberry',
    giftSeedCount: 1,
    giftMessage: '당근밭을 보고 반가워하는 토깽이가\n딸기 씨앗 1개를 선물로 줬어요!',
    trigger: { type: 'harvest', requiredPlant: 'carrot' },
    randomReappear: {
      enabled: true,
      probability: 0.3,      // 30% 확률로 등장
      alwaysGift: true,      // 항상 선물 줌
      neverGift: false,
      giftMessage: '토깽이가\n딸기 씨앗 1개를 선물로 줬어요!',
    },
  },
  turtle: {
    type: 'turtle',
    name: '거북이',
    nickname: '거붕이',
    emoji: '🐢',
    render: { position: 'beside-capybara' },
    giftType: 'seed',
    giftSeedType: 'strawberry',
    giftSeedCount: 2,
    giftMessage: '새로운 친구 거붕이가\n딸기 씨앗을 선물로 줬어요!',
    trigger: { type: 'disabled' }, // TODO: 게임 시작 7일 후 구현
  },
  hedgehog: {
    type: 'hedgehog',
    name: '고슴도치',
    nickname: '도치',
    emoji: '🦔',
    render: { position: 'beside-capybara' },
    giftType: 'seed',
    giftSeedType: 'watermelon',
    giftSeedCount: 2,
    giftMessage: '새로운 친구 도치가\n수박 씨앗을 선물로 줬어요!',
    trigger: { type: 'disabled' }, // TODO: 감자/무 수확 후 구현
  },
  raccoon: {
    type: 'raccoon',
    name: '너구리',
    nickname: '너굴이',
    emoji: '🦝',
    render: { position: 'beside-capybara' },
    giftType: 'seed',
    giftSeedType: 'peach',
    giftSeedCount: 1,
    giftMessage: '새로운 친구 너굴이가\n복숭아 씨앗을 선물로 줬어요!',
    trigger: { type: 'disabled' }, // TODO: 누적 수확 500회 구현
  },
  frog: {
    type: 'frog',
    name: '개구리',
    nickname: '개굴이',
    emoji: '🐸',
    render: { position: 'beside-capybara' },
    giftType: 'seed',
    giftSeedType: 'grape',
    giftSeedCount: 1,
    giftMessage: '새로운 친구 개굴이가\n포도 씨앗을 선물로 줬어요!',
    trigger: { type: 'disabled' }, // TODO: 물 사용 10회 이상 구현
  },
  cat: {
    type: 'cat',
    name: '고양이',
    nickname: '고영희',
    emoji: '🐱',
    collectionImage: require('../assets/ui/common/animal-item-cat.png'),
    collectionShadow: require('../assets/ui/common/animal-shadow-cat.png'),
    collectionStyle: { heightRatio: 0.5, topRatio: 0.12, leftRatio: 0.11 },
    render: {
      position: 'custom',
      containerStyle: {
        bottom: '8%', right: '5%',
        width: screenWidth * 0.36, height: screenWidth * 0.36, zIndex: 15,
        marginLeft: screenWidth * -0.18,
      },
    },
    giftType: 'water',
    giftWaterCount: 1,
    giftMessage: '길을 지나다 들른 고영희가\n물 1개를 선물로 줬어요!',
    trigger: { type: 'condition', condition: 'visitWithoutHarvest', requiredCount: 2, requiredVisitor: 'rabbit' },
    randomReappear: {
      enabled: true,
      probability: 0.15,     // 15% 확률로 등장
      alwaysGift: false,     // 확률적으로 선물 줌
      neverGift: false,      // 50% 확률
      giftMessage: '고영희가\n물 1개를 선물로 줬어요!',
    },
  },
  owl: {
    type: 'owl',
    name: '올빼미',
    nickname: '올뺌희',
    emoji: '🦉',
    collectionImage: require('../assets/ui/common/animal-item-owl.png'),
    collectionShadow: require('../assets/ui/common/animal-shadow-owl.png'),
    collectionStyle: { heightRatio: 0.5, topRatio: 0.12, leftRatio: 0.13 },
    render: {
      position: 'custom',
      containerStyle: {
        top: '20%', right: '26%',
        width: screenWidth * 0.26, height: screenWidth * 0.26, zIndex: 6,
      },
    },
    giftType: 'decoration',
    giftDecorationId: 'glasses',
    giftMessage: '밤하늘의 친구 올뺌희가\n안경을 선물로 줬어요!',
    trigger: { type: 'mailRead', requiredMailId: 'owl-visit', delayHours: 24 },
    randomReappear: {
      enabled: true,
      probability: 0.02,     // 2% 확률로 등장
      alwaysGift: true,      // 항상 선물 줌
      neverGift: false,
      randomGiftOptions: {
        decoration: { id: 'glasses', message: '올뺌희가\n안경을 선물로 줬어요!' },
        water: { count: 3, message: '올뺌희가\n물 3개를 선물로 줬어요!' },
      },
    },
  },
};

// config에서 자동 파생된 동물 목록 (도감 등에서 사용)
export const ALL_ANIMAL_TYPES = Object.keys(ANIMAL_CONFIGS) as AnimalType[];
