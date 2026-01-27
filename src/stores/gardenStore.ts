// 🍓 Healing Garden - Garden Store

import { create } from 'zustand';
import { Plant, PlantType, GardenState } from '../types';

interface GardenStore extends GardenState {
  // Actions
  plantSeed: (position: { x: number; y: number }, plantType: PlantType) => boolean;
  waterPlant: (plantId: string) => void;
  harvestPlant: (plantId: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
}

export const useGardenStore = create<GardenStore>((set, get) => ({
  // Initial State
  plants: [],
  level: 1,
  gold: 100, // 시작 골드
  tickets: 5, // 시작 티켓
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
      };
    });

    return true; // 성공적으로 심음
  },

  waterPlant: (plantId: string) => {
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
      };
    });
  },

  addGold: (amount: number) => {
    set((state) => ({
      gold: state.gold + amount,
    }));
  },

  spendGold: (amount: number) => {
    const currentGold = get().gold;
    if (currentGold >= amount) {
      set({ gold: currentGold - amount });
      return true;
    }
    return false;
  },
}));
