// 🍓 Healing Garden - Garden Screen (Kawaii Cozy Style)

import React, { useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { GardenArea } from '../components/GardenArea';
import { ScreenLayout } from '../components/ScreenLayout';
import { SeedBagModal } from '../components/SeedBagModal';
import { ShopModal } from '../components/ShopModal';
import { QuestModal } from '../components/QuestModal';
import { CollectionModal } from '../components/CollectionModal';
import { SettingsModal } from '../components/SettingsModal';
import { MailboxModal } from '../components/MailboxModal';
import { useGardenStore } from '../stores/gardenStore';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PlantType } from '../types';

interface GardenScreenProps {
  navigation?: any;
}

export const GardenScreen: React.FC<GardenScreenProps> = ({ navigation }) => {
  const { plants, water, plantSeedInSlot, useSeed, harvestPlant, addGold, waterPlant } = useGardenStore();
  const [seedBagVisible, setSeedBagVisible] = useState(false);
  const [shopVisible, setShopVisible] = useState(false);
  const [questVisible, setQuestVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [mailboxVisible, setMailboxVisible] = useState(false);

  // 심기 모드 상태: null이면 기본(당근), 설정되면 선택된 씨앗
  const [selectedSeed, setSelectedSeed] = useState<PlantType | null>(null);

  // 현재 심을 씨앗 타입 (선택된 게 없으면 기본 당근)
  const currentSeedType = selectedSeed || 'carrot';
  const isPlantingMode = selectedSeed !== null;

  const handleSlotPress = useCallback((slotIndex: number) => {
    const seedType = currentSeedType;

    // 씨앗 소비
    if (!useSeed(seedType)) return;

    // 슬롯에 심기
    const success = plantSeedInSlot(slotIndex, seedType);

    if (!success) return;

    // 한정 씨앗이 다 떨어지면 모드 해제
    if (isPlantingMode) {
      const seeds = useGardenStore.getState().seeds;
      const seedItem = seeds.find((s) => s.type === seedType);
      if (!seedItem || seedItem.count === 0) {
        setSelectedSeed(null);
      }
    }
  }, [currentSeedType, isPlantingMode, plantSeedInSlot, useSeed]);

  const handleSelectSeed = useCallback((seedType: PlantType) => {
    // 당근 선택 시에는 기본 모드로 (인디케이터 안 보임)
    if (seedType === 'carrot') {
      setSelectedSeed(null);
    } else {
      setSelectedSeed(seedType);
    }
  }, []);

  const handleCancelPlanting = useCallback(() => {
    setSelectedSeed(null);
  }, []);

  const handleWaterPlant = useCallback((plantId: string) => {
    waterPlant(plantId);
  }, [waterPlant]);

  const handlePlantPress = useCallback((plantId: string) => {
    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    const config = PLANT_CONFIGS[plant.type];
    addGold(config.harvestGold);
    harvestPlant(plantId);
  }, [plants, addGold, harvestPlant]);

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

        {/* 심기 모드 인디케이터 */}
        {isPlantingMode && (
          <View style={styles.plantingIndicator}>
            <Text style={styles.plantingText}>
              {PLANT_CONFIGS[currentSeedType].emoji} {PLANT_CONFIGS[currentSeedType].name} 씨앗 심는 중...
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelPlanting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Garden Area */}
        <View style={styles.gardenContainer}>
          <GardenArea
            plants={plants}
            water={water}
            plantingMode={isPlantingMode}
            onPlantPress={handlePlantPress}
            onSlotPress={handleSlotPress}
            onWaterPlant={handleWaterPlant}
            onMailboxPress={() => setMailboxVisible(true)}
          />
        </View>

      </View>

      {/* Seed Bag Modal */}
      <SeedBagModal
        visible={seedBagVisible}
        onClose={() => setSeedBagVisible(false)}
        onSelectSeed={handleSelectSeed}
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

      {/* Mailbox Modal */}
      <MailboxModal
        visible={mailboxVisible}
        onClose={() => setMailboxVisible(false)}
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
  plantingIndicator: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  plantingText: {
    fontSize: 15,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cancelButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Gaegu-Regular',
    color: '#A1887F',
  },
});
