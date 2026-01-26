// 🌱 Healing Garden - Plant Slot Component

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../utils/colors';
import { Plant } from '../types';

interface PlantSlotProps {
  plant?: Plant;
  onPress: () => void;
  isEmpty: boolean;
}

// 임시 이모지 (단계별)
const PLANT_EMOJIS = {
  rose: ['🌱', '🌿', '🥀', '🌹'],
  sunflower: ['🌱', '🌿', '🌾', '🌻'],
  tulip: ['🌱', '🌿', '🌷', '🌷'],
  lavender: ['🌱', '🌿', '💜', '💜'],
  cherry: ['🌱', '🌿', '🌸', '🌸'],
};

export const PlantSlot: React.FC<PlantSlotProps> = ({
  plant,
  onPress,
  isEmpty,
}) => {
  const getPlantEmoji = () => {
    if (!plant) return '';
    return PLANT_EMOJIS[plant.type][plant.stage];
  };

  return (
    <TouchableOpacity
      style={[
        styles.slot,
        isEmpty ? styles.emptySlot : styles.filledSlot,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isEmpty ? (
        <Text style={styles.emptyText}>+</Text>
      ) : (
        <View style={styles.plantContainer}>
          <Text style={styles.plantEmoji}>{getPlantEmoji()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slot: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptySlot: {
    backgroundColor: COLORS.soil,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderStyle: 'dashed',
  },
  filledSlot: {
    backgroundColor: COLORS.grass,
  },
  emptyText: {
    fontSize: 32,
    color: COLORS.primaryLight,
    fontWeight: '300',
  },
  plantContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantEmoji: {
    fontSize: 48,
  },
});
