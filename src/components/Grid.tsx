// 🌱 Healing Garden - Grid Component

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PlantSlot } from './PlantSlot';
import { Plant } from '../types';
import { COLORS } from '../utils/colors';

interface GridProps {
  plants: Plant[];
  gridSize: number;
  onSlotPress: (slotIndex: number) => void;
}

export const Grid: React.FC<GridProps> = ({ plants, gridSize, onSlotPress }) => {
  const totalSlots = gridSize * gridSize;

  const getPlantAtSlot = (slotIndex: number): Plant | undefined => {
    return plants.find((plant) => plant.slotIndex === slotIndex);
  };

  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < totalSlots; i++) {
      const plant = getPlantAtSlot(i);
      slots.push(
        <PlantSlot
          key={i}
          plant={plant}
          isEmpty={!plant}
          onPress={() => onSlotPress(i)}
        />
      );
    }
    return slots;
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>{renderSlots()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 340,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 20,
  },
});
