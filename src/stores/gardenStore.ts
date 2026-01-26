// 🌱 Healing Garden - Garden Store

import { create } from 'zustand';
import { Plant, PlantType, GardenState } from '../types';

interface GardenStore extends GardenState {
  // Actions
  plantSeed: (slotIndex: number, plantType: PlantType) => void;
  waterPlant: (plantId: string) => void;
  harvestPlant: (plantId: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
}

export const useGardenStore = create<GardenStore>((set, get) => ({
  // Initial State
  plants: [],
  gridSize: 3,
  gold: 100, // 시작 골드
  collection: [],
  lastSaveTime: new Date(),

  // Actions
  plantSeed: (slotIndex: number, plantType: PlantType) => {
    set((state) => {
      const newPlant: Plant = {
        id: `plant-${Date.now()}-${slotIndex}`,
        slotIndex,
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
