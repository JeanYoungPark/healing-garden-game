// 🍓 Healing Garden - Garden Screen (Kawaii Cozy Style)

import React, { useCallback, useEffect, useState } from 'react';
import { AppState, StyleSheet, View, TouchableOpacity, Image, Text, ImageBackground } from 'react-native';
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
import { calcBackgroundSize } from '../utils/responsive';

export const GardenScreen: React.FC = () => {
  // Zustand selector로 상태 구독
  const plants = useGardenStore((state) => state.plants);
  const water = useGardenStore((state) => state.water);
  const seeds = useGardenStore((state) => state.seeds);
  const visitors = useGardenStore((state) => state.visitors);
  const mails = useGardenStore((state) => state.mails);
  const equippedFence = useGardenStore((state) => state.equippedFence);
  const equippedPlot = useGardenStore((state) => state.equippedPlot);
  const hasNewDecoration = useGardenStore((state) => state.hasNewDecoration);

  // 액션들
  const plantSeedInSlot = useGardenStore((state) => state.plantSeedInSlot);
  const consumeSeed = useGardenStore((state) => state.useSeed);
  const harvestPlant = useGardenStore((state) => state.harvestPlant);
  const addGold = useGardenStore((state) => state.addGold);
  const waterPlant = useGardenStore((state) => state.waterPlant);
  const markCollectionSeen = useGardenStore((state) => state.markCollectionSeen);
  const claimVisitor = useGardenStore((state) => state.claimVisitor);
  const clearNewDecorationFlag = useGardenStore((state) => state.clearNewDecorationFlag);
  const markSeedsSeen = useGardenStore((state) => state.markSeedsSeen);
  const seenSeeds = useGardenStore((state) => state.seenSeeds);
  const initFirstVisitMail = useGardenStore((state) => state.initFirstVisitMail);

  // 하단바 배경 크기 계산
  const { bgWidth, bgHeight } = calcBackgroundSize(1081, 153);

  // 하단 아이콘 크기 계산 (배경 너비 기준)
  const bottomIconSize = bgWidth * 0.085;  // 상단 아이콘과 동일한 비율
  const bottomSeparatorWidth = bgWidth * 0.004;
  const bottomSeparatorHeight = bgWidth * 0.07;
  const bottomTextSize = bgWidth * 0.04;
  const badgeSize = bgWidth * 0.02;
  const [seedBagVisible, setSeedBagVisible] = useState(false);
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

  // 일일 퀘스트: 자정 리셋 + 활동 시간 추적
  useEffect(() => {
    const initQuest = () => {
      useGardenStore.getState().resetDailyQuestsIfNeeded();
      useGardenStore.getState().startActiveTimeTracking();
    };

    if (useGardenStore.persist.hasHydrated()) {
      initQuest();
    } else {
      const unsub = useGardenStore.persist.onFinishHydration(() => {
        initQuest();
        unsub();
      });
    }

    // 1분마다 활동 시간 틱
    const tickInterval = setInterval(() => {
      useGardenStore.getState().tickActiveTime();
    }, 60000);

    // AppState 리스너: foreground/background 전환
    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        useGardenStore.getState().resetDailyQuestsIfNeeded();
        useGardenStore.getState().startActiveTimeTracking();
      } else if (nextState === 'background' || nextState === 'inactive') {
        useGardenStore.getState().stopActiveTimeTracking();
      }
    });

    return () => {
      clearInterval(tickInterval);
      appStateSubscription.remove();
      useGardenStore.getState().stopActiveTimeTracking();
    };
  }, []);

  // 심기 모드 상태: null이면 기본(당근), 설정되면 선택된 씨앗
  const [selectedSeed, setSelectedSeed] = useState<PlantType | null>(null);

  // 현재 심을 씨앗 타입 (선택된 게 없으면 기본 당근)
  const currentSeedType = selectedSeed || 'carrot';
  const isPlantingMode = selectedSeed !== null;

  const handleSlotPress = useCallback((slotIndex: number) => {
    const seedType = currentSeedType;

    // 씨앗 소비
    if (!consumeSeed(seedType)) return;

    // 슬롯에 심기
    const success = plantSeedInSlot(slotIndex, seedType);

    if (!success) return;

    // 한정 씨앗이 다 떨어지면 모드 해제
    if (isPlantingMode) {
      const currentSeeds = useGardenStore.getState().seeds;
      const seedItem = currentSeeds.find((s) => s.type === seedType);
      if (!seedItem || seedItem.count === 0) {
        setSelectedSeed(null);
      }
    }
  }, [currentSeedType, isPlantingMode, plantSeedInSlot, consumeSeed]);

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
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <ImageBackground
              source={require('../assets/ui/common/resource-bar-bg.png')}
              style={[styles.bottomNavBg, { width: bgWidth, height: bgHeight }]}
              resizeMode="contain"
            >
            <View style={styles.bottomNavContent}>
              {/* 왼쪽 영역: 상점 */}
              <View style={styles.bottomNavSection}>
                <TouchableOpacity
                  style={styles.bottomNavItem}
                  activeOpacity={0.7}
                  onPress={() => setShopVisible(true)}
                >
                  <Image
                    source={require('../assets/garden/icons/shop-icon.png')}
                    style={{ width: bottomIconSize, height: bottomIconSize }}
                    resizeMode="contain"
                  />
                  <Text style={[styles.bottomNavText, { fontSize: bottomTextSize }]}>상점</Text>
                </TouchableOpacity>
              </View>

              {/* 구분선 */}
              <Image
                source={require('../assets/ui/common/separator.png')}
                style={{ width: bottomSeparatorWidth, height: bottomSeparatorHeight }}
                resizeMode="contain"
              />

              {/* 오른쪽 영역: 씨앗 */}
              <View style={styles.bottomNavSection}>
                <TouchableOpacity
                  style={styles.bottomNavItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSeedBagVisible(true);
                    markSeedsSeen();
                  }}
                >
                  <Image
                    source={require('../assets/garden/icons/seed-bag-icon.png')}
                    style={{ width: bottomIconSize, height: bottomIconSize }}
                    resizeMode="contain"
                  />
                  <Text style={[styles.bottomNavText, { fontSize: bottomTextSize }]}>씨앗</Text>
                  {seeds.some((s) => !seenSeeds.includes(s.type)) && <View style={[styles.seedBadge, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]} />}
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          </View>
        </View>

        {/* 심기 모드 인디케이터 */}
        {isPlantingMode && (
          <View style={styles.plantingIndicator}>
            <Text style={styles.plantingText}>
              {PLANT_CONFIGS[currentSeedType].name} 씨앗 심는 중...
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
            hasNewDecoration={hasNewDecoration}
            equippedFence={equippedFence}
            equippedPlot={equippedPlot}
            onPlantPress={handlePlantPress}
            onSlotPress={handleSlotPress}
            onWaterPlant={handleWaterPlant}
            onMailboxPress={() => setMailboxVisible(true)}
            onVisitorPress={handleVisitorPress}
            onCapybaraPress={() => { setDressUpVisible(true); clearNewDecorationFlag(); }}
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
  bottomNavContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 6,
    bottom: 16,
    zIndex: 10,
    alignItems: 'center',
  },
  bottomNav: {
    alignItems: 'center',
  },
  bottomNavBg: {
    overflow: 'visible',
  },
  bottomNavContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: '100%',
  },
  bottomNavSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  bottomNavText: {
    color: '#A1887F',
    fontFamily: 'Gaegu-Bold',
  },
  seedBadge: {
    position: 'absolute',
    top: 0,
    right: -8,
    backgroundColor: '#E08080',
    borderWidth: 1.5,
    borderColor: '#7a6854',
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
