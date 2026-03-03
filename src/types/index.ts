// 🍓 Healing Garden - Type Definitions

export type PlantType = 'carrot' | 'turnip' | 'potato' | 'strawberry' | 'watermelon' | 'peach' | 'grape' | 'apple' | 'eggplant';

export type AnimalType = 'rabbit' | 'turtle' | 'hedgehog' | 'raccoon' | 'frog' | 'cat' | 'owl';

export type PlantStage = 0 | 1 | 2 | 3; // 씨앗, 새싹, 꽃, 과일

export type Rarity = 'common' | 'rare' | 'epic';

export type QuestId = 'plant' | 'water' | 'harvest' | 'activeTime' | 'claimAnimal';

export interface DailyQuestState {
  date: string;                        // "YYYY-MM-DD" 리셋 감지용
  progress: Record<string, number>;    // questId → 현재 카운트
  rewardClaimed: boolean;              // 전체 보상 수령 여부
  activeTimeAccumulated: number;       // 누적 활동 초
  lastActiveTimestamp: number | null;  // 마지막 틱 시점 (런타임, persist 안 함)
}

export interface Plant {
  id: string;
  slotIndex: number; // 그리드 위치 (0-8)
  type: PlantType;
  stage: PlantStage;
  plantedAt: Date;
  lastWatered: Date | null;
  waterCount: number;
}

export interface SeedItem {
  type: PlantType;
  count: number; // -1 = 무제한
}

export interface PlantConfig {
  type: PlantType;
  name: string;
  seedPrice: number;
  harvestGold: number;
  growthTime: number; // 분 단위
  waterBonus: number; // 물 1회당 단축 시간 (분)
  emoji: string; // 임시 비주얼
  rarity: Rarity;
  description: string; // 작물 설명
  story?: string; // 특별한 이야기 (선택)
  collectionImage?: any; // 도감 표시용 이미지 (없으면 stage 3 이미지 사용)
  collectionShadow?: any; // 도감 미수집 그림자 이미지
}

export interface AnimalVisitor {
  type: AnimalType;
  appearedAt: Date;
  scheduledTime?: Date; // 예약된 등장 시간 (대기열용)
  isRandom?: boolean; // 랜덤 재등장 여부
}

export interface MailItem {
  id: string;
  title: string;
  from: string;
  content: string;
  reward?: { type: 'seed'; seedType: PlantType; count: number };
  isRead: boolean;
  isClaimed: boolean; // 보상 수령 여부
  createdAt: Date;
  readAt?: Date; // 편지를 읽은 시각
}

export interface DecorationItem {
  id: string;
  name: string;
  receivedAt: Date;
}

export interface FenceItem {
  id: string;
  name: string;
  purchasedAt: Date;
}

export interface PlotItem {
  id: string;
  name: string;
  purchasedAt: Date;
}

export interface GardenState {
  plants: Plant[];
  seeds: SeedItem[]; // 씨앗 가방
  level: number;
  gold: number;
  water: number; // 물방울 (최대 5, 2시간마다 1개 충전)
  lastWaterRechargeTime: Date; // 마지막 물 충전 시간
  collection: PlantType[];
  seenCollection: PlantType[]; // 도감에서 확인한 수집 목록
  mails: MailItem[]; // 우편함
  visitors: AnimalVisitor[]; // 정원에 방문한 동물들
  claimedAnimals: AnimalType[]; // 선물을 받은 동물들 (조건 첫 만족 시에만, 랜덤 재등장 시 포함 안됨)
  decorations: DecorationItem[]; // 꾸미기 아이템 인벤토리
  hasNewDecoration: boolean; // 새 꾸미기 아이템 알림
  equippedDecorations: string[]; // 장착 중인 꾸미기 아이템 ID 목록
  fences: FenceItem[]; // 울타리 인벤토리
  equippedFence: string; // 장착 중인 울타리 ID
  plots: PlotItem[]; // 밭 인벤토리
  equippedPlot: string; // 장착 중인 밭 ID
  soundEnabled: boolean; // 소리/진동 설정
  notificationEnabled: boolean; // 알림 설정
  firstHarvestTime: Date | null; // 첫 수확 시간
  dailyRandomVisitCount: number; // 오늘 랜덤 방문 횟수 (최대 2회)
  lastRandomVisitDate: string; // 마지막 랜덤 방문 날짜 (YYYY-MM-DD, 자정 리셋용)
  visitCountWithoutHarvest: number; // 수확 없이 앱 접속한 횟수 (고양이 트리거용)
  hasHarvestedThisSession: boolean; // 이번 세션에 수확했는지 여부
  lastAppOpenDate: string | null; // 마지막 앱 실행 날짜 (YYYY-MM-DD, 거북이 트리거용)
  totalHarvests: number; // 누적 수확 횟수 (너구리 트리거용)
  dailyQuest: DailyQuestState; // 일일 퀘스트 상태
  lastSaveTime: Date;
}

