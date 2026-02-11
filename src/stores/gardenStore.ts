// 🍓 Healing Garden - Garden Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, PlantType, AnimalType, SeedItem, AnimalVisitor, MailItem, GardenState } from '../types';
import { ANIMAL_CONFIGS } from '../utils/animalConfigs';

// 상수
const MAX_WATER = 5;
const WATER_RECHARGE_MINUTES = 120; // 2시간마다 1개 충전

interface GardenStore extends GardenState {
  // Actions
  plantSeedInSlot: (slotIndex: number, plantType: PlantType) => boolean;
  waterPlant: (plantId: string) => void;
  harvestPlant: (plantId: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  useWater: () => boolean;
  useSeed: (plantType: PlantType) => boolean;
  rechargeWater: () => void;
  toggleSound: () => void;
  toggleNotification: () => void;
  markCollectionSeen: () => void;
  markCollectionAsSeen: (plantType: PlantType) => void;
  // Mail actions
  initFirstVisitMail: () => void;
  readMail: (mailId: string) => void;
  claimMailReward: (mailId: string) => void;
  checkForOwlMail: () => void; // 올빼미 편지 체크
  // Animal actions
  checkForNewVisitors: () => void;
  checkForRandomVisitors: () => void; // 랜덤 재등장 체크
  claimVisitor: (animalType: AnimalType) => string | null; // returns gift message
  resetDailyRandomVisits: () => void; // 자정 리셋
  // Dev
  resetGame: () => void;
}

// 물 충전량 계산 함수
const calculateWaterRecharge = (lastRechargeTime: Date, currentWater: number): { water: number; lastRechargeTime: Date } => {
  const now = new Date();
  const elapsed = now.getTime() - new Date(lastRechargeTime).getTime();
  const minutesElapsed = Math.floor(elapsed / (1000 * 60));
  const rechargeable = Math.floor(minutesElapsed / WATER_RECHARGE_MINUTES);

  if (rechargeable > 0 && currentWater < MAX_WATER) {
    const newWater = Math.min(currentWater + rechargeable, MAX_WATER);
    const usedRecharges = newWater - currentWater;
    const newLastRechargeTime = new Date(new Date(lastRechargeTime).getTime() + usedRecharges * WATER_RECHARGE_MINUTES * 60 * 1000);

    return { water: newWater, lastRechargeTime: newLastRechargeTime };
  }

  return { water: currentWater, lastRechargeTime: new Date(lastRechargeTime) };
};

export const useGardenStore = create<GardenStore>()(
  persist(
    (set, get) => ({
      // Initial State
      plants: [],
      seeds: [], // 구매한 씨앗만 (당근은 기본이라 포함 안 함)
      level: 1,
      gold: 0, // 시작 골드 0
      water: 5, // 시작 물방울 (최대치)
      lastWaterRechargeTime: new Date(),
      collection: [],
      seenCollection: [],
      mails: [],
      visitors: [],
      claimedAnimals: [],
      soundEnabled: true,
      notificationEnabled: true,
      firstHarvestTime: null, // 첫 수확 시간
      dailyRandomVisitCount: 0, // 오늘 랜덤 방문 횟수
      lastRandomVisitDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      lastSaveTime: new Date(),

      // Actions
      plantSeedInSlot: (slotIndex: number, plantType: PlantType) => {
        const state = get();

        // 이미 해당 슬롯에 식물이 있는지 체크
        const occupied = state.plants.some((p) => p.slotIndex === slotIndex);
        if (occupied) return false;

        const newPlant: Plant = {
          id: `plant-${Date.now()}`,
          slotIndex,
          type: plantType,
          stage: 0, // 씨앗 상태
          plantedAt: new Date(),
          lastWatered: null,
          waterCount: 0,
        };

        set({
          plants: [...state.plants, newPlant],
          lastSaveTime: new Date(),
        });

        return true;
      },

      waterPlant: (plantId: string) => {
        const state = get();

        // 물이 없으면 실패
        if (state.water <= 0) return;

        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  lastWatered: new Date(),
                  waterCount: plant.waterCount + 1,
                }
              : plant
          ),
          water: state.water - 1,
          lastSaveTime: new Date(),
        }));
      },

      harvestPlant: (plantId: string) => {
        set((state) => {
          const plant = state.plants.find((p) => p.id === plantId);
          if (!plant) return state;

          // 도감에 추가 (중복 방지)
          const newCollection = state.collection.includes(plant.type)
            ? state.collection
            : [...state.collection, plant.type];

          // 첫 수확 시간 기록
          const firstHarvestTime = state.firstHarvestTime ?? new Date();

          return {
            plants: state.plants.filter((p) => p.id !== plantId),
            collection: newCollection,
            firstHarvestTime,
            lastSaveTime: new Date(),
          };
        });
      },

      addGold: (amount: number) => {
        set((state) => ({
          gold: state.gold + amount,
          lastSaveTime: new Date(),
        }));
      },

      spendGold: (amount: number) => {
        const currentGold = get().gold;
        if (currentGold >= amount) {
          set({ gold: currentGold - amount, lastSaveTime: new Date() });
          return true;
        }
        return false;
      },

      useWater: () => {
        const state = get();
        if (state.water > 0) {
          set({ water: state.water - 1, lastSaveTime: new Date() });
          return true;
        }
        return false;
      },

      useSeed: (plantType: PlantType) => {
        // 당근은 기본 씨앗 - 항상 사용 가능
        if (plantType === 'carrot') return true;

        const state = get();
        const seedItem = state.seeds.find((s) => s.type === plantType);
        if (!seedItem || seedItem.count <= 0) return false;

        set({
          seeds: state.seeds.map((s) =>
            s.type === plantType ? { ...s, count: s.count - 1 } : s
          ).filter((s) => s.count !== 0),
          lastSaveTime: new Date(),
        });
        return true;
      },

      rechargeWater: () => {
        const state = get();
        const { water, lastRechargeTime } = calculateWaterRecharge(
          state.lastWaterRechargeTime,
          state.water
        );

        if (water !== state.water) {
          set({ water, lastWaterRechargeTime: lastRechargeTime, lastSaveTime: new Date() });
        }
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      toggleNotification: () => {
        set((state) => ({ notificationEnabled: !state.notificationEnabled }));
      },

      markCollectionSeen: () => {
        set((state) => ({ seenCollection: [...state.collection] }));
      },

      markCollectionAsSeen: (plantType: PlantType) => {
        set((state) => {
          if (!state.seenCollection.includes(plantType)) {
            return { seenCollection: [...state.seenCollection, plantType] };
          }
          return state;
        });
      },

      // 첫 방문 메일 생성
      initFirstVisitMail: () => {
        const state = get();
        // 이미 메일이 있으면 스킵 (첫 방문 아님)
        if (state.mails.length > 0) return;

        const welcomeMail: MailItem = {
          id: 'welcome',
          title: '농장에 온 걸 환영해!',
          from: '카피바라',
          content: '안녕! 이 농장에 처음 온 것 같네\n가끔 친구들이 씨앗을 두고 가니까\n우편함을 자주 확인해봐!',
          reward: { type: 'seed', seedType: 'turnip', count: 2 },
          isRead: false,
          isClaimed: false,
          createdAt: new Date(),
        };

        set({ mails: [welcomeMail], lastSaveTime: new Date() });
      },

      // 메일 읽음 처리
      readMail: (mailId: string) => {
        set((state) => ({
          mails: state.mails.map((m) =>
            m.id === mailId ? { ...m, isRead: true } : m
          ),
        }));
      },

      // 메일 보상 수령
      claimMailReward: (mailId: string) => {
        const state = get();
        const mail = state.mails.find((m) => m.id === mailId);
        if (!mail || mail.isClaimed || !mail.reward) return;

        if (mail.reward.type === 'seed') {
          const existingSeed = state.seeds.find((s) => s.type === mail.reward!.seedType);
          const updatedSeeds = existingSeed
            ? state.seeds.map((s) =>
                s.type === mail.reward!.seedType ? { ...s, count: s.count + mail.reward!.count } : s
              )
            : [...state.seeds, { type: mail.reward.seedType, count: mail.reward.count }];

          set({
            mails: state.mails.map((m) =>
              m.id === mailId ? { ...m, isClaimed: true } : m
            ),
            seeds: updatedSeeds,
            lastSaveTime: new Date(),
          });
        }
      },

      // 새 동물 방문자 체크 (조건 기반)
      checkForNewVisitors: () => {
        const state = get();
        const newVisitors: AnimalVisitor[] = [];

        for (const [, config] of Object.entries(ANIMAL_CONFIGS)) {
          // disabled 동물은 스킵
          if (config.trigger.type === 'disabled') continue;
          // 이미 선물 받은 동물은 스킵 (조건 첫 만족 시에만 체크)
          if (state.claimedAnimals.includes(config.type)) continue;
          // 이미 방문 중인 동물은 스킵
          if (state.visitors.some((v) => v.type === config.type)) continue;

          if (config.trigger.type === 'harvest') {
            // 특정 작물 수확 후 등장하는 동물
            if (state.collection.includes(config.trigger.requiredPlant)) {
              newVisitors.push({
                type: config.type,
                appearedAt: new Date(),
                isRandom: false,
              });
            }
          }
        }

        if (newVisitors.length > 0) {
          set({
            visitors: [...state.visitors, ...newVisitors],
            lastSaveTime: new Date(),
          });
        }
      },

      // 동물 방문자 클릭 → 선물 수령
      claimVisitor: (animalType: AnimalType) => {
        const state = get();
        const visitor = state.visitors.find((v) => v.type === animalType);
        if (!visitor) return null;

        const config = ANIMAL_CONFIGS[animalType];
        const isFirstVisit = !visitor.isRandom;

        // 선물 유무 판단
        let hasGift = true;
        if (visitor.isRandom && config.randomReappear) {
          if (config.randomReappear.neverGift) {
            hasGift = false;
          } else if (!config.randomReappear.alwaysGift) {
            // 50% 확률
            hasGift = Math.random() < 0.5;
          }
        }

        // 씨앗 선물 추가
        let updatedSeeds = state.seeds;
        let giftMessage = null;

        if (hasGift) {
          const existingSeed = state.seeds.find((s) => s.type === config.giftSeedType);
          updatedSeeds = existingSeed
            ? state.seeds.map((s) =>
                s.type === config.giftSeedType ? { ...s, count: s.count + config.giftSeedCount } : s
              )
            : [...state.seeds, { type: config.giftSeedType, count: config.giftSeedCount }];
          giftMessage = config.giftMessage;
        }

        // 첫 방문일 때만 claimedAnimals에 추가
        const updatedClaimedAnimals = isFirstVisit
          ? [...state.claimedAnimals, animalType]
          : state.claimedAnimals;

        set({
          visitors: state.visitors.filter((v) => v.type !== animalType),
          claimedAnimals: updatedClaimedAnimals,
          seeds: updatedSeeds,
          lastSaveTime: new Date(),
        });

        // 동물 클릭 후 랜덤 동물 체크
        setTimeout(() => get().checkForRandomVisitors(), 100);

        return giftMessage;
      },

      // 랜덤 재등장 체크
      checkForRandomVisitors: () => {
        const state = get();

        // 자정 리셋
        get().resetDailyRandomVisits();

        // 하루 2회 제한 체크
        if (state.dailyRandomVisitCount >= 2) return;

        // 조건 동물이 대기열에 있으면 패스
        const hasConditionAnimal = state.visitors.some((v) => !v.isRandom);
        if (hasConditionAnimal) return;

        // 이미 방문한 동물 중 랜덤 재등장 가능한 동물들
        const eligibleAnimals = state.claimedAnimals
          .map((type) => ANIMAL_CONFIGS[type])
          .filter((config) => config.randomReappear?.enabled);

        if (eligibleAnimals.length === 0) return;

        // 확률에 따라 동물 선택
        for (const config of eligibleAnimals) {
          const chance = Math.random();
          if (chance < (config.randomReappear?.probability ?? 0)) {
            // 이미 방문 중인지 체크
            if (state.visitors.some((v) => v.type === config.type)) continue;

            // 랜덤 방문자 추가
            const newVisitor: AnimalVisitor = {
              type: config.type,
              appearedAt: new Date(),
              isRandom: true,
            };

            set({
              visitors: [...state.visitors, newVisitor],
              dailyRandomVisitCount: state.dailyRandomVisitCount + 1,
              lastSaveTime: new Date(),
            });

            // 하루 2회 제한
            if (state.dailyRandomVisitCount + 1 >= 2) break;
          }
        }
      },

      // 자정 리셋
      resetDailyRandomVisits: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.lastRandomVisitDate !== today) {
          set({
            dailyRandomVisitCount: 0,
            lastRandomVisitDate: today,
          });
        }
      },

      // 올빼미 편지 체크 (첫 수확 후 3일)
      checkForOwlMail: () => {
        const state = get();

        // 첫 수확 시간이 없으면 스킵
        if (!state.firstHarvestTime) return;

        // 이미 올빼미 편지가 있으면 스킵
        if (state.mails.some((m) => m.id === 'owl-visit')) return;

        // 3일(72시간) 경과 체크
        const now = new Date();
        const elapsed = now.getTime() - new Date(state.firstHarvestTime).getTime();
        const hoursElapsed = elapsed / (1000 * 60 * 60);

        if (hoursElapsed >= 72) {
          // 3일 경과 → 올빼미 편지 발송
          const owlMail: MailItem = {
            id: 'owl-visit',
            title: '밤하늘의 친구',
            from: '올빼미',
            content: '안녕 난 올빼미야. 밤마다 이 근처를 날아다니다가 네 밭을 보게 됐어. 작물을 정성껏 키우고 있더라. 조만간 직접 인사하러 갈게',
            reward: undefined, // 선물 없음
            isRead: false,
            isClaimed: false, // 선물이 없어도 필드는 유지
            createdAt: new Date(),
          };

          set({
            mails: [...state.mails, owlMail],
            lastSaveTime: new Date(),
          });
        }
      },

      resetGame: () => {
        AsyncStorage.removeItem('healing-garden-storage');
        set({
          plants: [],
          seeds: [],
          level: 1,
          gold: 0,
          water: 5,
          lastWaterRechargeTime: new Date(),
          collection: [],
          seenCollection: [],
          mails: [],
          visitors: [],
          claimedAnimals: [],
          soundEnabled: true,
          notificationEnabled: true,
          firstHarvestTime: null,
          dailyRandomVisitCount: 0,
          lastRandomVisitDate: new Date().toISOString().split('T')[0],
          lastSaveTime: new Date(),
        });
      },
    }),
    {
      name: 'healing-garden-storage',
      version: 5,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          persistedState.seeds = [];
          persistedState.plants = [];
        }
        if (version < 2) {
          persistedState.visitors = [];
          persistedState.claimedAnimals = [];
        }
        if (version < 3) {
          persistedState.mails = [];
        }
        if (version < 4) {
          persistedState.firstHarvestTime = null;
        }
        if (version < 5) {
          persistedState.dailyRandomVisitCount = 0;
          persistedState.lastRandomVisitDate = new Date().toISOString().split('T')[0];
        }
        return persistedState;
      },
      partialize: (state) => ({
        plants: state.plants,
        seeds: state.seeds,
        level: state.level,
        gold: state.gold,
        water: state.water,
        lastWaterRechargeTime: state.lastWaterRechargeTime,
        collection: state.collection,
        seenCollection: state.seenCollection,
        mails: state.mails,
        visitors: state.visitors,
        claimedAnimals: state.claimedAnimals,
        soundEnabled: state.soundEnabled,
        notificationEnabled: state.notificationEnabled,
        firstHarvestTime: state.firstHarvestTime,
        dailyRandomVisitCount: state.dailyRandomVisitCount,
        lastRandomVisitDate: state.lastRandomVisitDate,
        lastSaveTime: state.lastSaveTime,
      }),
    }
  )
);
