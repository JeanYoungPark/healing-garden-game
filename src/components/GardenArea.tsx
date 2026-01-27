// 🍓 Healing Garden - Free Garden Area (자유 배치)

import React, { forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Plant } from '../types';
import { COLORS } from '../utils/colors';

interface GardenAreaProps {
  plants: Plant[];
  onPlantPress?: (plantId: string) => void;
}

// 과일 성장 단계 이모지
const PLANT_EMOJIS = {
  strawberry: ['🌱', '🌿', '🌸', '🍓'],
  watermelon: ['🌱', '🌿', '🌼', '🍉'],
  peach: ['🌱', '🌿', '🌸', '🍑'],
  grape: ['🌱', '🌿', '🌼', '🍇'],
  apple: ['🌱', '🌿', '🌸', '🍎'],
};

export const GardenArea = forwardRef<View, GardenAreaProps>(({
  plants,
  onPlantPress,
}, ref) => {
  return (
    <View style={styles.container}>
      {/* 드롭 가능한 정원 영역 */}
      <View
        ref={ref}
        style={styles.gardenArea}
      >
        {/* 안내 텍스트 (식물 없을 때만) */}
        {plants.length === 0 && (
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>
              씨앗을 끌어서 정원에 심어보세요 🌱
            </Text>
          </View>
        )}

        {/* 식물들 렌더링 */}
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={[
              styles.plantContainer,
              {
                left: plant.position.x - 40, // 중앙 정렬 (80/2)
                top: plant.position.y - 40,
              },
            ]}
            onPress={() => onPlantPress?.(plant.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.plantEmoji}>
              {PLANT_EMOJIS[plant.type][plant.stage]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  gardenArea: {
    width: '100%',
    height: 400,
    backgroundColor: 'rgba(212, 229, 196, 0.4)', // 반투명 잔디색
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(212, 229, 196, 0.6)',
    position: 'relative',
    // 부드러운 그림자
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  guideContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -15 }],
    width: 300,
  },
  guideText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  plantContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  plantEmoji: {
    fontSize: 48,
  },
});
