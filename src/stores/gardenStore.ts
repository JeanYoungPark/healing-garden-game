// 🍓 Healing Garden - Garden Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, PlantType, GardenState } from '../types';

// 상수
const MAX_WATER = 5;
const WATER_RECHARGE_MINUTES = 30;

interface GardenStore extends GardenState {
  // Actions
  plantSeed: (position: { x: number; y: number }, plantType: PlantType) => boolean;
  waterPlant: (plantId: string) => void;
  harvestPlant: (plantId: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  useWater: () => boolean;
  rechargeWater: () => void;
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
      level: 1,
      gold: 0, // 시작 골드 0
      water: 5, // 시작 물방울 (최대치)
      lastWaterRechargeTime: new Date(),
      collection: [],
      lastSaveTime: new Date(),

      // Actions
      plantSeed: (position: { x: number; y: number }, plantType: PlantType) => {
        const state = get();

        // 다른 식물과 너무 가까운지 체크 (최소 거리 80px)
        const MIN_DISTANCE = 80;
        const tooClose = state.plants.some((plant) => {
          const dx = plant.position.x - position.x;
          const dy = plant.position.y - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < MIN_DISTANCE;
        });

        if (tooClose) {
          return false; // 너무 가까우면 심을 수 없음
        }

        set((state) => {
          const newPlant: Plant = {
            id: `plant-${Date.now()}`,
            position,
            type: plantType,
            stage: 0, // 씨앗 상태
            plantedAt: new Date(),
            lastWatered: null,
            waterCount: 0,
          };

          return {
            plants: [...state.plants, newPlant],
            lastSaveTime: new Date(),
          };
        });

        return true; // 성공적으로 심음
      },

      waterPlant: (plantId: string) => {
        const state = get();

        // 물이 없으면 실패
        if (state.water <= 0) return;

        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId && plant.waterCount < 3
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
    }),
    {
      name: 'healing-garden-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Date 객체 직렬화/역직렬화 처리
      partialize: (state) => ({
        plants: state.plants,
        level: state.level,
        gold: state.gold,
        water: state.water,
        lastWaterRechargeTime: state.lastWaterRechargeTime,
        collection: state.collection,
        lastSaveTime: state.lastSaveTime,
      }),
    }
  )
);
