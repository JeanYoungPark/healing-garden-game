// 🍓 Healing Garden - Garden Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, PlantType, AnimalType, SeedItem, AnimalVisitor, MailItem, DecorationItem, FenceItem, GardenState } from '../types';
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
  checkForRandomVisitors: (excludeType?: AnimalType) => void; // 랜덤 재등장 체크
  claimVisitor: (animalType: AnimalType) => string | null; // returns gift message
  resetDailyRandomVisits: () => void; // 자정 리셋
  incrementVisitCountIfNoHarvest: () => void; // 수확 없이 접속 시 카운터 증가
  removeOwlIfDaytime: () => void; // 낮이면 올빼미 제거
  updateLastAppOpenDate: () => void; // 앱 실행 날짜 업데이트 (거북이 트리거용)
  // Decoration actions
  equipDecoration: (decorationId: string) => void;
  unequipDecoration: (decorationId: string) => void;
  toggleEquipDecoration: (decorationId: string) => void;
  // Fence actions
  purchaseFence: (fenceId: string, price: number) => boolean;
  equipFence: (fenceId: string) => void;
  // Dev
  resetGame: () => void;
}

// 밤 시간대 체크 함수 (18:00 ~ 03:00)
const isNightTime = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 18 || hour < 3;
};

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

// Date 변환 함수
const convertDatesToObjects = (state: any) => {
  if (!state) return state;

  // 최상위 Date 필드
  if (state.lastWaterRechargeTime && typeof state.lastWaterRechargeTime === 'string') {
    state.lastWaterRechargeTime = new Date(state.lastWaterRechargeTime);
  }
  if (state.firstHarvestTime && typeof state.firstHarvestTime === 'string') {
    state.firstHarvestTime = new Date(state.firstHarvestTime);
  }
  if (state.lastSaveTime && typeof state.lastSaveTime === 'string') {
    state.lastSaveTime = new Date(state.lastSaveTime);
  }

  // plants 배열
  if (state.plants && Array.isArray(state.plants)) {
    state.plants.forEach((plant: any) => {
      if (plant.plantedAt && typeof plant.plantedAt === 'string') {
        plant.plantedAt = new Date(plant.plantedAt);
      }
      if (plant.lastWatered && typeof plant.lastWatered === 'string') {
        plant.lastWatered = new Date(plant.lastWatered);
      }
    });
  }

  // visitors 배열
  if (state.visitors && Array.isArray(state.visitors)) {
    state.visitors.forEach((visitor: any) => {
      if (visitor.appearedAt && typeof visitor.appearedAt === 'string') {
        visitor.appearedAt = new Date(visitor.appearedAt);
      }
    });
  }

  // mails 배열
  if (state.mails && Array.isArray(state.mails)) {
    state.mails.forEach((mail: any) => {
      if (mail.createdAt && typeof mail.createdAt === 'string') {
        mail.createdAt = new Date(mail.createdAt);
      }
      if (mail.readAt && typeof mail.readAt === 'string') {
        mail.readAt = new Date(mail.readAt);
      }
    });
  }

  // decorations 배열
  if (state.decorations && Array.isArray(state.decorations)) {
    state.decorations.forEach((decoration: any) => {
      if (decoration.receivedAt && typeof decoration.receivedAt === 'string') {
        decoration.receivedAt = new Date(decoration.receivedAt);
      }
    });
  }

  // fences 배열
  if (state.fences && Array.isArray(state.fences)) {
    state.fences.forEach((fence: any) => {
      if (fence.purchasedAt && typeof fence.purchasedAt === 'string') {
        fence.purchasedAt = new Date(fence.purchasedAt);
      }
    });
  }

  return state;
};


export const useGardenStore = create<GardenStore>()(
  persist(
    (set, get) => ({
      // Initial State
      plants: [],
      seeds: [], // 구매한 씨앗만 (당근은 기본이라 포함 안 함)
      level: 1,
      gold: 0, // 시작 새싹 0
      water: 5, // 시작 물방울 (최대치)
      lastWaterRechargeTime: new Date(),
      collection: [],
      seenCollection: [],
      mails: [],
      visitors: [],
      claimedAnimals: [],
      decorations: [],
      equippedDecorations: [],
      fences: [], // 구매한 울타리
      equippedFence: 'rope', // 기본 울타리
      soundEnabled: true,
      notificationEnabled: true,
      firstHarvestTime: null, // 첫 수확 시간
      dailyRandomVisitCount: 0, // 오늘 랜덤 방문 횟수
      lastRandomVisitDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      visitCountWithoutHarvest: 0, // 수확 없이 앱 접속한 횟수 (고양이 트리거용)
      hasHarvestedThisSession: false, // 이번 세션에 수확했는지 여부
      lastAppOpenDate: null, // 마지막 앱 실행 날짜 (YYYY-MM-DD, 거북이 트리거용)
      totalHarvests: 0, // 누적 수확 횟수 (너구리 트리거용)
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
            hasHarvestedThisSession: true, // 수확 완료
            visitCountWithoutHarvest: 0, // 카운터 리셋
            totalHarvests: state.totalHarvests + 1, // 누적 수확 횟수 증가
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
            m.id === mailId ? { ...m, isRead: true, readAt: new Date() } : m
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
          } else if (config.trigger.type === 'condition') {
            // 특수 조건 기반 동물
            if (config.trigger.condition === 'visitWithoutHarvest') {
              // 방문 횟수 조건 체크
              const countMet = state.visitCountWithoutHarvest >= config.trigger.requiredCount;
              // 선행 방문자 조건 체크 (있으면)
              const visitorMet = !config.trigger.requiredVisitor ||
                                 state.claimedAnimals.includes(config.trigger.requiredVisitor);

              if (countMet && visitorMet) {
                newVisitors.push({
                  type: config.type,
                  appearedAt: new Date(),
                  isRandom: false,
                });
              }
            }
          } else if (config.trigger.type === 'mailRead') {
            // 편지 읽은 후 등장하는 동물 (올빼미)
            const trigger = config.trigger;
            const mail = state.mails.find((m) => m.id === trigger.requiredMailId);

            // 편지가 읽혀있는지 확인
            if (mail && mail.isRead && mail.readAt) {
              const now = new Date();
              const readTime = new Date(mail.readAt);

              // 자정이 지났는지 확인 (다음날 조건)
              const readDate = readTime.toISOString().split('T')[0];
              const today = now.toISOString().split('T')[0];
              const isNextDay = readDate !== today;

              // 밤 시간대인지 확인 (18:00~03:00)
              const isNight = isNightTime();

              if (isNextDay && isNight) {
                newVisitors.push({
                  type: config.type,
                  appearedAt: now,
                  isRandom: false,
                });
              }
            }
          } else if (config.trigger.type === 'inactiveDays') {
            // N일 이상 미접속 시 등장하는 동물 (거북이)
            if (state.lastAppOpenDate) {
              const lastOpen = new Date(state.lastAppOpenDate);
              const today = new Date();
              const diffMs = today.getTime() - lastOpen.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

              if (diffDays >= config.trigger.requiredDays) {
                newVisitors.push({
                  type: config.type,
                  appearedAt: new Date(),
                  isRandom: false,
                });
              }
            }
          } else if (config.trigger.type === 'harvest_count') {
            // 누적 수확 횟수 조건 (너구리)
            if (state.totalHarvests >= config.trigger.requiredCount) {
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

        if (animalType === 'owl' && !isNightTime()) {
          set({
            visitors: state.visitors.filter((v) => v.type !== 'owl'),
            lastSaveTime: new Date(),
          });
          return '밤이 끝나서 올뺌희가 떠났어요';
        }

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

        // 선물 추가
        let updatedSeeds = state.seeds;
        let updatedWater = state.water;
        let updatedGold = state.gold;
        let updatedDecorations = state.decorations;
        let giftMessage = null;

        if (hasGift) {
          // 올빼미 랜덤 재등장 시 특별 처리 (안경 또는 물 랜덤)
          if (visitor.isRandom && animalType === 'owl' && config.randomReappear?.randomGiftOptions) {
            const isDecorationGift = Math.random() < 0.5; // 50% 확률

            if (isDecorationGift && config.randomReappear.randomGiftOptions.decoration) {
              // 안경 선물
              const { id, message } = config.randomReappear.randomGiftOptions.decoration;
              updatedDecorations = [...state.decorations, { id, name: '안경', receivedAt: new Date() }];
              giftMessage = message;
            } else if (config.randomReappear.randomGiftOptions.water) {
              // 물 선물
              const { count, message } = config.randomReappear.randomGiftOptions.water;
              updatedWater = state.water + count;
              giftMessage = message;
            }
          } else {
            // 일반 선물 처리
            // 랜덤 재등장 시 별도 메시지가 있으면 사용
            giftMessage = visitor.isRandom && config.randomReappear?.giftMessage
              ? config.randomReappear.giftMessage
              : config.giftMessage;

            if (config.giftType === 'seed') {
              // 씨앗 선물
              const existingSeed = state.seeds.find((s) => s.type === config.giftSeedType);
              updatedSeeds = existingSeed
                ? state.seeds.map((s) =>
                    s.type === config.giftSeedType ? { ...s, count: s.count + (config.giftSeedCount || 0) } : s
                  )
                : [...state.seeds, { type: config.giftSeedType!, count: config.giftSeedCount || 0 }];
            } else if (config.giftType === 'water') {
              // 물 선물 (5개 제한 없음)
              updatedWater = state.water + (config.giftWaterCount || 0);
            } else if (config.giftType === 'gold') {
              // 새싹 선물 (너구리 전용)
              if (animalType === 'raccoon') {
                if (isFirstVisit) {
                  // 첫 방문: 1000개
                  updatedGold = state.gold + 1000;
                  giftMessage = '새로운 친구 너굴이가\n새싹 1000개를 선물로 줬어요!';
                } else {
                  // 재방문: 100~1000 랜덤 (100단위)
                  const randomAmount = Math.floor(Math.random() * 10 + 1) * 100; // 100~1000
                  updatedGold = state.gold + randomAmount;
                  giftMessage = `너굴이가\n새싹 ${randomAmount}개를 선물로 줬어요!`;
                }
              } else {
                // 다른 동물의 새싹 선물 (기본값)
                updatedGold = state.gold + (config.giftGoldAmount || 0);
              }
            } else if (config.giftType === 'decoration') {
              // 꾸미기 아이템 선물
              const decorationId = config.giftDecorationId || 'unknown';
              updatedDecorations = [...state.decorations, { id: decorationId, name: '안경', receivedAt: new Date() }];
            }
          }
        }

        // 첫 방문일 때만 claimedAnimals에 추가
        const updatedClaimedAnimals = isFirstVisit
          ? [...state.claimedAnimals, animalType]
          : state.claimedAnimals;

        set({
          visitors: state.visitors.filter((v) => v.type !== animalType),
          claimedAnimals: updatedClaimedAnimals,
          seeds: updatedSeeds,
          water: updatedWater,
          gold: updatedGold,
          decorations: updatedDecorations,
          lastSaveTime: new Date(),
        });

        // 동물 클릭 후 랜덤 동물 체크 (방금 퇴장한 동물 제외)
        setTimeout(() => get().checkForRandomVisitors(animalType), 100);

        return giftMessage;
      },

      // 랜덤 재등장 체크 (excludeType: 방금 퇴장한 동물은 즉시 재등장 방지)
      checkForRandomVisitors: (excludeType?: AnimalType) => {
        const state = get();

        // 자정 리셋
        get().resetDailyRandomVisits();

        // 하루 2회 제한 체크
        if (state.dailyRandomVisitCount >= 2) return;

        // 조건 동물이 대기열에 있으면 패스
        const hasConditionAnimal = state.visitors.some((v) => !v.isRandom);
        if (hasConditionAnimal) return;

        // 이미 방문한 동물 중 랜덤 재등장 가능한 동물들 (방금 퇴장한 동물 제외)
        const eligibleAnimals = state.claimedAnimals
          .filter((type) => type !== excludeType)
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

      // 수확 없이 접속 시 카운터 증가 (고양이 트리거용)
      incrementVisitCountIfNoHarvest: () => {
        const state = get();

        // 이번 세션에 수확하지 않았으면 카운터 증가
        if (!state.hasHarvestedThisSession) {
          const newCount = state.visitCountWithoutHarvest + 1;

          set({
            visitCountWithoutHarvest: newCount,
            hasHarvestedThisSession: false, // 새 세션 시작
            lastSaveTime: new Date(),
          });

          // 카운터 증가 후 조건 동물 체크 (고양이)
          setTimeout(() => get().checkForNewVisitors(), 100);
        } else {
          // 수확했던 세션이면 플래그만 리셋
          set({
            hasHarvestedThisSession: false,
          });
        }
      },

      // 낮이면 올빼미 제거
      removeOwlIfDaytime: () => {
        const state = get();
        const hasOwl = state.visitors.some((v) => v.type === 'owl');

        if (hasOwl && !isNightTime()) {
          // 낮이고 올빼미가 있으면 제거
          set({
            visitors: state.visitors.filter((v) => v.type !== 'owl'),
            lastSaveTime: new Date(),
          });
        }
      },

      // 앱 실행 날짜 업데이트 (거북이 미접속 트리거용, checkForNewVisitors 후 호출)
      updateLastAppOpenDate: () => {
        const today = new Date().toISOString().split('T')[0];
        set({ lastAppOpenDate: today });
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

        // 토끼를 만난 적이 없으면 스킵
        if (!state.claimedAnimals.includes('rabbit')) return;

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

      // 꾸미기 아이템 장착/해제
      equipDecoration: (decorationId: string) => {
        const state = get();
        if (!state.equippedDecorations.includes(decorationId)) {
          set({ equippedDecorations: [...state.equippedDecorations, decorationId] });
        }
      },

      unequipDecoration: (decorationId: string) => {
        set((state) => ({
          equippedDecorations: state.equippedDecorations.filter((id) => id !== decorationId),
        }));
      },

      toggleEquipDecoration: (decorationId: string) => {
        const state = get();
        if (state.equippedDecorations.includes(decorationId)) {
          set({ equippedDecorations: state.equippedDecorations.filter((id) => id !== decorationId) });
        } else {
          set({ equippedDecorations: [...state.equippedDecorations, decorationId] });
        }
      },

      // 울타리 구매
      purchaseFence: (fenceId: string, price: number) => {
        const state = get();

        // 이미 구매했는지 체크
        if (state.fences.some((f) => f.id === fenceId)) return false;

        // 새싹 부족 체크
        if (state.gold < price) return false;

        // 구매 처리
        set({
          gold: state.gold - price,
          fences: [...state.fences, { id: fenceId, name: fenceId, purchasedAt: new Date() }],
          lastSaveTime: new Date(),
        });

        return true;
      },

      // 울타리 장착
      equipFence: (fenceId: string) => {
        set({ equippedFence: fenceId, lastSaveTime: new Date() });
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
          decorations: [],
          equippedDecorations: [],
          fences: [],
          equippedFence: 'rope',
          soundEnabled: true,
          notificationEnabled: true,
          firstHarvestTime: null,
          dailyRandomVisitCount: 0,
          lastRandomVisitDate: new Date().toISOString().split('T')[0],
          visitCountWithoutHarvest: 0,
          hasHarvestedThisSession: false,
          lastAppOpenDate: null,
          totalHarvests: 0,
          lastSaveTime: new Date(),
        });
      },
    }),
    {
      name: 'healing-garden-storage',
      version: 12, // 울타리 시스템 추가
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Hydration error:', error);
          return;
        }
        if (state) {
          // Date 변환 수행
          convertDatesToObjects(state);
        }
      },
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          persistedState.seeds = persistedState.seeds || [];
          persistedState.plants = persistedState.plants || [];
        }
        if (version < 2) {
          persistedState.visitors = persistedState.visitors || [];
          persistedState.claimedAnimals = persistedState.claimedAnimals || [];
        }
        if (version < 3) {
          persistedState.mails = persistedState.mails || [];
        }
        if (version < 4) {
          persistedState.firstHarvestTime = persistedState.firstHarvestTime ?? null;
        }
        if (version < 5) {
          persistedState.dailyRandomVisitCount = persistedState.dailyRandomVisitCount ?? 0;
          persistedState.lastRandomVisitDate = persistedState.lastRandomVisitDate ?? new Date().toISOString().split('T')[0];
        }
        if (version < 6) {
          persistedState.visitCountWithoutHarvest = persistedState.visitCountWithoutHarvest ?? 0;
          persistedState.hasHarvestedThisSession = persistedState.hasHarvestedThisSession ?? false;
        }
        if (version < 7) {
          convertDatesToObjects(persistedState);
        }
        if (version < 8) {
          persistedState.decorations = persistedState.decorations || [];
          convertDatesToObjects(persistedState); // readAt, receivedAt 변환
        }
        if (version < 9) {
          persistedState.equippedDecorations = persistedState.equippedDecorations || [];
        }
        if (version < 10) {
          persistedState.lastAppOpenDate = persistedState.lastAppOpenDate ?? null;
        }
        if (version < 11) {
          persistedState.totalHarvests = persistedState.totalHarvests ?? 0;
        }
        if (version < 12) {
          persistedState.fences = persistedState.fences ?? [];
          persistedState.equippedFence = persistedState.equippedFence ?? 'rope';
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
        decorations: state.decorations,
        equippedDecorations: state.equippedDecorations,
        fences: state.fences,
        equippedFence: state.equippedFence,
        soundEnabled: state.soundEnabled,
        notificationEnabled: state.notificationEnabled,
        firstHarvestTime: state.firstHarvestTime,
        dailyRandomVisitCount: state.dailyRandomVisitCount,
        lastRandomVisitDate: state.lastRandomVisitDate,
        visitCountWithoutHarvest: state.visitCountWithoutHarvest,
        hasHarvestedThisSession: state.hasHarvestedThisSession,
        lastAppOpenDate: state.lastAppOpenDate,
        totalHarvests: state.totalHarvests,
        lastSaveTime: state.lastSaveTime,
      }),
    }
  )
);
