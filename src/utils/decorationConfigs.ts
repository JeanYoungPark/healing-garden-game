// 🎨 Healing Garden - Decoration Item Configurations

export interface DecorationConfig {
  id: string;
  name: string;
  emoji: string; // 임시 비주얼
  description: string;
}

export const DECORATION_CONFIGS: Record<string, DecorationConfig> = {
  glasses: {
    id: 'glasses',
    name: '안경',
    emoji: '👓',
    description: '올빼미가 선물한 귀여운 안경',
  },
  // 추후 추가될 아이템들
  // hat: {
  //   id: 'hat',
  //   name: '모자',
  //   emoji: '🎩',
  //   description: '멋진 모자',
  // },
};
