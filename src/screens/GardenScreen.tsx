// 🍓 Healing Garden - Garden Screen (Kawaii Cozy Style)

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { GardenArea } from '../components/GardenArea';
import { ScreenLayout } from '../components/ScreenLayout';
import { SeedBagModal } from '../components/SeedBagModal';
import { ShopModal } from '../components/ShopModal';
import { QuestModal } from '../components/QuestModal';
import { CollectionModal } from '../components/CollectionModal';
import { SettingsModal } from '../components/SettingsModal';
import { MailboxModal } from '../components/MailboxModal';
import { DressUpModal } from '../components/DressUpModal';
import { GameAlert } from '../components/GameAlert';
import { useGardenStore } from '../stores/gardenStore';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PlantType, AnimalType } from '../types';

interface GardenScreenProps {
  navigation?: any;
}

export const GardenScreen: React.FC<GardenScreenProps> = ({ navigation }) => {
  // Zustand selector로 상태 구독
  const plants = useGardenStore((state) => state.plants);
  const water = useGardenStore((state) => state.water);
  const seeds = useGardenStore((state) => state.seeds);
  const visitors = useGardenStore((state) => state.visitors);
  const mails = useGardenStore((state) => state.mails);
  const equippedFence = useGardenStore((state) => state.equippedFence);
  const equippedPlot = useGardenStore((state) => state.equippedPlot);

  // 액션들
  const plantSeedInSlot = useGardenStore((state) => state.plantSeedInSlot);
  const useSeed = useGardenStore((state) => state.useSeed);
  const harvestPlant = useGardenStore((state) => state.harvestPlant);
  const addGold = useGardenStore((state) => state.addGold);
  const waterPlant = useGardenStore((state) => state.waterPlant);
  const markCollectionSeen = useGardenStore((state) => state.markCollectionSeen);
  const claimVisitor = useGardenStore((state) => state.claimVisitor);
  const initFirstVisitMail = useGardenStore((state) => state.initFirstVisitMail);
  const [seedBagVisible, setSeedBagVisible] = useState(false);
  const [seedBagChecked, setSeedBagChecked] = useState(false); // 씨앗가방 확인 여부
  const [shopVisible, setShopVisible] = useState(false);
  const [questVisible, setQuestVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [mailboxVisible, setMailboxVisible] = useState(false);
  const [dressUpVisible, setDressUpVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // 첫 방문 메일 초기화
  useEffect(() => {
    // 이미 hydration이 완료된 경우 즉시 실행
    if (useGardenStore.persist.hasHydrated()) {
      initFirstVisitMail();
      return; // cleanup 불필요
    }

    // hydration 대기
    const unsub = useGardenStore.persist.onFinishHydration(() => {
      initFirstVisitMail();
    });
    return () => unsub();
  }, [initFirstVisitMail]);

  // 앱 시작 시 딱 한 번만 동물 방문자 체크
  useEffect(() => {
    const run = () => {
      useGardenStore.getState().checkForNewVisitors();
    };

    if (useGardenStore.persist.hasHydrated()) {
      run();
    } else {
      const unsub = useGardenStore.persist.onFinishHydration(() => {
        run();
        unsub();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleVisitorPress = useCallback((animalType: AnimalType) => {
    const message = claimVisitor(animalType);
    if (message) {
      setAlertMessage(message);
      setAlertVisible(true);
    }
  }, [claimVisitor]);

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
            onPress={() => {
              setSeedBagVisible(true);
              setSeedBagChecked(true); // 씨앗가방 확인함
            }}
          >
            <Image
              source={require('../assets/garden/icons/seed-bag-icon.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
            {seeds.length > 0 && !seedBagChecked && <View style={styles.seedBadge} />}
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
            visitors={visitors}
            hasUnreadMail={mails.some((m) => !m.isRead)}
            equippedFence={equippedFence}
            equippedPlot={equippedPlot}
            onPlantPress={handlePlantPress}
            onSlotPress={handleSlotPress}
            onWaterPlant={handleWaterPlant}
            onMailboxPress={() => setMailboxVisible(true)}
            onVisitorPress={handleVisitorPress}
            onCapybaraPress={() => setDressUpVisible(true)}
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
        onClose={() => { markCollectionSeen(); setCollectionVisible(false); }}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* Dress Up Modal */}
      <DressUpModal
        visible={dressUpVisible}
        onClose={() => setDressUpVisible(false)}
      />

      {/* Mailbox Modal */}
      <MailboxModal
        visible={mailboxVisible}
        onClose={() => setMailboxVisible(false)}
        onClaimReward={(message) => {
          setAlertMessage(message);
          setAlertVisible(true);
        }}
      />

      {/* 동물 선물 알럿 */}
      <GameAlert
        visible={alertVisible}
        message={alertMessage}
        duration={2000}
        onClose={() => setAlertVisible(false)}
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
  },
  seedBadge: {
    position: 'absolute',
    top: 5,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E08080',
    borderWidth: 1.5,
    borderColor: '#7a6854',
  },
  navIcon: {
    width: 46,
    height: 46,
  },
  shopIcon: {
    width: 46,
    height: 46,
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
