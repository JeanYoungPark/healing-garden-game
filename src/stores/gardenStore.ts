// 🍓 Healing Garden - Garden Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, PlantType, SeedItem, GardenState } from '../types';

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
      soundEnabled: true,
      notificationEnabled: true,
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

          return {
            plants: state.plants.filter((p) => p.id !== plantId),
            collection: newCollection,
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
    }),
    {
      name: 'healing-garden-storage',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          persistedState.seeds = [];
          persistedState.plants = [];
        }
        return persistedState;
      },
      // Date 객체 직렬화/역직렬화 처리
      partialize: (state) => ({
        plants: state.plants,
        seeds: state.seeds,
        level: state.level,
        gold: state.gold,
        water: state.water,
        lastWaterRechargeTime: state.lastWaterRechargeTime,
        collection: state.collection,
        soundEnabled: state.soundEnabled,
        notificationEnabled: state.notificationEnabled,
        lastSaveTime: state.lastSaveTime,
      }),
    }
  )
);
