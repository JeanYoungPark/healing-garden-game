// 🍓 Healing Garden - Garden Screen (Kawaii Cozy Style)

import React, { useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image } from 'react-native';
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

        {/* Quest Button - 헤더 아래 오른쪽 첫번째 */}
        <TouchableOpacity
          style={[styles.questButton, { top: 53 + insets.top }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/garden/icons/quest-icon.png')}
            style={styles.questIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Collection Button - 헤더 아래 오른쪽 두번째 */}
        <TouchableOpacity
          style={[styles.collectionButton, { top: 53 + insets.top }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/garden/icons/collection-icon.png')}
            style={styles.collectionIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Settings Button - 헤더 아래 오른쪽 세번째 */}
        <TouchableOpacity
          style={[styles.settingsButton, { top: 53 + insets.top }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/garden/icons/settings-icon.png')}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Bottom Navigation - 가로 배치 */}
        <View style={styles.bottomNav}>

          {/* Shop Button */}
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <Image
              source={require('../assets/garden/icons/shop-icon.png')}
              style={styles.shopIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Seed Bag Button */}
          <TouchableOpacity style={styles.seedBagButton} activeOpacity={0.7}>
            <Image
              source={require('../assets/garden/icons/seed-bag-icon.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
  questButton: {
    position: 'absolute',
    right: 99,
    padding: 8,
    zIndex: 10,
  },
  questIcon: {
    width: 35,
    height: 35,
  },
  collectionButton: {
    position: 'absolute',
    right: 53,
    padding: 8,
    zIndex: 10,
  },
  collectionIcon: {
    width: 35,
    height: 35,
  },
  settingsButton: {
    position: 'absolute',
    right: 7,
    padding: 8,
    zIndex: 10,
  },
  settingsIcon: {
    width: 35,
    height: 35,
  },
  bottomNav: {
    position: 'absolute',
    left: 7,
    bottom: 7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 0,
    zIndex: 10,
  },
  navButton: {
    padding: 8,
  },
  seedBagButton: {
    padding: 8,
    marginTop: 4,
    marginLeft: -8,
  },
  navIcon: {
    width: 37,
    height: 37,
  },
  shopIcon: {
    width: 44,
    height: 44,
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
