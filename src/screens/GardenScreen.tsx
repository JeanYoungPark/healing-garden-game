// 🍓 Healing Garden - Garden Screen (Kawaii Cozy Style)

import React, { useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GardenArea } from '../components/GardenArea';
import { ResourceBar } from '../components/ResourceBar';
import { LayeredBackground } from '../components/LayeredBackground';
import { SeedInventory } from '../components/SeedInventory';
import { useGardenStore } from '../stores/gardenStore';
import { COLORS } from '../utils/colors';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PlantType } from '../types';

export const GardenScreen: React.FC = () => {
  const { plants, level, gold, tickets, plantSeed, spendGold } = useGardenStore();
  const gardenRef = useRef<View>(null);
  const insets = useSafeAreaInsets();

  const handleSeedDrop = async (seedType: PlantType, absolutePosition: { x: number; y: number }) => {
    const seedConfig = PLANT_CONFIGS[seedType];

    // 정원 영역 내 상대 좌표로 변환
    if (gardenRef.current) {
      gardenRef.current.measure((x, y, width, height, pageX, pageY) => {
        const relativeX = absolutePosition.x - pageX;
        const relativeY = absolutePosition.y - pageY;

        // 정원 영역 안인지 체크
        if (relativeX >= 0 && relativeX <= width && relativeY >= 0 && relativeY <= height) {
          // 골드 체크
          if (spendGold(seedConfig.seedPrice)) {
            const success = plantSeed({ x: relativeX, y: relativeY }, seedType);

            if (!success) {
              // 너무 가까운 위치 - 골드 환불
              useGardenStore.getState().addGold(seedConfig.seedPrice);
            }
            // 성공 시 아무 알럿 없이 식물만 심어짐
          } else {
            Alert.alert('💰 골드가 부족해요', `${seedConfig.seedPrice} 골드가 필요해요`, [
              { text: '확인', style: 'cancel' },
            ]);
          }
        }
        // 정원 영역 밖에 드롭 시 아무 일도 일어나지 않음
      });
    }
  };

  const handlePlantPress = (plantId: string) => {
    Alert.alert('🌱 식물 정보', '식물이 자라는 중입니다!', [
      { text: '확인', style: 'default' },
    ]);
  };

  return (
    <LayeredBackground>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Header - 리소스 바 */}
        <View style={styles.header}>
          <ResourceBar level={level} gold={gold} tickets={tickets} />
        </View>

        {/* Garden Area - 드래그 앤 드롭 (전체 영역) */}
        <View style={styles.gardenContainer}>
          <GardenArea
            ref={gardenRef}
            plants={plants}
            onPlantPress={handlePlantPress}
          />
        </View>

        {/* Seed Inventory - 씨앗 드래그 (하단 고정) */}
        {/* <View style={styles.inventoryContainer}>
          <SeedInventory onSeedDrop={handleSeedDrop} gold={gold} />
        </View> */}
      </View>
    </LayeredBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  gardenContainer: {
    flex: 1,
    position: 'relative',
  },
  inventoryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
