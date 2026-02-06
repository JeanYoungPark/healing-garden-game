// 🍓 Healing Garden - Garden Screen (Kawaii Cozy Style)

import React, { useRef, useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image } from 'react-native';
import { GardenArea } from '../components/GardenArea';
import { ScreenLayout } from '../components/ScreenLayout';
import { SeedInventory } from '../components/SeedInventory';
import { SeedBagModal } from '../components/SeedBagModal';
import { ShopModal } from '../components/ShopModal';
import { QuestModal } from '../components/QuestModal';
import { CollectionModal } from '../components/CollectionModal';
import { SettingsModal } from '../components/SettingsModal';
import { useGardenStore } from '../stores/gardenStore';
import { COLORS } from '../utils/colors';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PlantType } from '../types';

interface GardenScreenProps {
  navigation?: any;
}

export const GardenScreen: React.FC<GardenScreenProps> = ({ navigation }) => {
  const { plants, level, gold, tickets, plantSeed, spendGold } = useGardenStore();
  const gardenRef = useRef<View>(null);
  const [seedBagVisible, setSeedBagVisible] = useState(false);
  const [shopVisible, setShopVisible] = useState(false);
  const [questVisible, setQuestVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

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
    <ScreenLayout
      onQuestPress={() => setQuestVisible(true)}
      onCollectionPress={() => setCollectionVisible(true)}
      onSettingsPress={() => setSettingsVisible(true)}
    >
      <View style={styles.container}>
        {/* Bottom Navigation - 가로 배치 */}
        <View style={styles.bottomNav}>

          {/* Shop Button */}
          <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={() => setShopVisible(true)}
          >
            <Image
              source={require('../assets/garden/icons/shop-icon.png')}
              style={styles.shopIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Seed Bag Button */}
          <TouchableOpacity
            style={styles.seedBagButton}
            activeOpacity={0.7}
            onPress={() => setSeedBagVisible(true)}
          >
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

      {/* Seed Bag Modal */}
      <SeedBagModal
        visible={seedBagVisible}
        onClose={() => setSeedBagVisible(false)}
      />

      {/* Shop Modal */}
      <ShopModal
        visible={shopVisible}
        onClose={() => setShopVisible(false)}
      />

      {/* Quest Modal */}
      <QuestModal
        visible={questVisible}
        onClose={() => setQuestVisible(false)}
      />

      {/* Collection Modal */}
      <CollectionModal
        visible={collectionVisible}
        onClose={() => setCollectionVisible(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
