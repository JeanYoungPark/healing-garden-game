// 🍓 Healing Garden - Free Garden Area (자유 배치)

import React, { forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ImageBackground, Dimensions } from 'react-native';
import { Plant } from '../types';
import { COLORS } from '../utils/colors';

const { width, height } = Dimensions.get('window');

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
  // 3x3 그리드 생성
  const gridSlots = Array.from({ length: 9 }, (_, index) => index);
  const plotSize = Math.min(width, height) * 0.25; // 화면 크기에 따라 조정

  return (
    <View style={styles.container}>
      {/* 드롭 가능한 정원 영역 */}
      <View
        ref={ref}
        style={styles.gardenArea}
      >
        {/* 3x3 밭 그리드 */}
        <View style={styles.gridContainer}>
          {gridSlots.map((index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;

            return (
              <ImageBackground
                key={index}
                source={require('../assets/farm-plot.png')}
                style={[
                  styles.plotSlot,
                  {
                    width: plotSize,
                    height: plotSize,
                  }
                ]}
                resizeMode="contain"
              />
            );
          })}
        </View>

        {/* 안내 텍스트 (식물 없을 때만) */}
        {/* {plants.length === 0 && (
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>
              씨앗을 끌어서 정원에 심어보세요 🌱
            </Text>
          </View>
        )} */}

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
    flex: 1,
    position: 'relative',
  },
  gardenArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    gap: 8,
    marginTop: 200,
  },
  plotSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  guideContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  guideText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    fontFamily: 'Gaegu-Regular',
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
