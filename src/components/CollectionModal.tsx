// 🌱 Healing Garden - Collection Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';
import { useGardenStore } from '../stores/gardenStore';
import { PLANT_CONFIGS, ALL_PLANT_TYPES } from '../utils/plantConfigs';
import { PLANT_STAGE_IMAGES } from '../utils/plantStageConfigs';
import { ANIMAL_CONFIGS, ALL_ANIMAL_TYPES } from '../utils/animalConfigs';
import { PlantType } from '../types';

// 미수집 기본 그림자 (collectionShadow 없는 작물용 fallback)
const DEFAULT_SHADOW = require('../assets/collection/plant-shadow-carrot.png');

// 배경 크기 계산 (collection-bg: 1070 x 1351)
const { bgWidth, bgHeight } = calcBackgroundSize(1070, 1351);

// 탭 크기 계산 (animal-tab: 500 x 143)
const { width: tabWidth, height: tabHeight } = calcElementSize(bgWidth, 0.42, 500, 143);

// 아이템 박스 크기 계산 (gift-item-box: 500 x 546)
const { width: itemBoxWidth, height: itemBoxHeight } = calcElementSize(bgWidth, 0.42, 500, 546);

// 아이템 이미지/텍스트 위치 계산
const itemImageHeight = itemBoxHeight * 0.5;
const itemImageTop = itemBoxHeight * 0.12;
const itemTextBottom = itemBoxHeight * 0.1;
const itemFontSize = itemBoxHeight * 0.1;

// 탭 겹침 (탭 너비 기준)
const tabMarginLeft = -tabWidth * 0.01;

// 탭 위치 (배경 높이 기준 퍼센트)

// 스크롤 영역 마진 (배경 높이 기준)
const scrollMarginTop = bgHeight * 0.18;
const scrollMarginBottom = bgHeight * 0.1;

// 하단 그라데이션 높이 (배경 높이 기준)
const fadeHeight = bgHeight * 0.04;

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

interface CollectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ visible, onClose }) => {
  const { collection, seenCollection, markCollectionAsSeen, claimedAnimals } = useGardenStore();
  const [selectedTab, setSelectedTab] = React.useState<'animal' | 'gift'>('animal');
  const [selectedPlant, setSelectedPlant] = React.useState<PlantType | null>(null);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* 반투명 배경 */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* 도감 컨텐츠 */}
        <View style={styles.container} pointerEvents="box-none">
          {/* 도감 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/collection-bg.png')}
            style={styles.collectionBackground}
            resizeMode="stretch"
          >
            {/* 모달 제목 */}
            <Text style={[styles.modalTitle, { fontSize: modalTitleFontSize }]}>도감</Text>

            {/* 탭 버튼 - 배경 안에 배치 */}
            <View style={styles.tabContainer}>
              {/* 동물도감 탭 */}
              <TouchableOpacity
                style={[styles.tab1, { width: tabWidth, height: tabHeight, zIndex: selectedTab === 'animal' ? 2 : 1 }]}
                onPress={() => setSelectedTab('animal')}
                activeOpacity={1}
              >
                {selectedTab === 'animal' ? (
                  <Image
                    source={require('../assets/ui/common/animal-tab-selected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                ) : (
                  <Image
                    source={require('../assets/ui/common/animal-tab-unselected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                )}
              </TouchableOpacity>

              {/* 선물 탭 */}
              <TouchableOpacity
                style={[styles.tab2, { width: tabWidth, height: tabHeight, zIndex: selectedTab === 'gift' ? 2 : 1 }]}
                onPress={() => setSelectedTab('gift')}
                activeOpacity={1}
              >
                {selectedTab === 'gift' ? (
                  <Image
                    source={require('../assets/ui/common/gift-tab-selected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                ) : (
                  <Image
                    source={require('../assets/ui/common/gift-tab-unselected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                )}
              </TouchableOpacity>
            </View>
            {/* 컬렉션 목록 */}
            <View style={styles.scrollContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View style={styles.grid}>
                  {selectedTab === 'animal' && (
                    <>
                      {ALL_ANIMAL_TYPES.filter((t) => ANIMAL_CONFIGS[t].collectionShadow).map((type) => {
                        const config = ANIMAL_CONFIGS[type];
                        const met = claimedAnimals.includes(type);
                        const cs = config.collectionStyle;
                        const imgHeight = itemBoxHeight * (cs?.heightRatio ?? 0.5);
                        const imgTop = itemBoxHeight * (cs?.topRatio ?? 0.12);
                        return (
                          <View key={type} style={[styles.giftItemWrapper, { width: itemBoxWidth }]}>
                            <Image
                              source={require('../assets/ui/common/gift-item-box.png')}
                              style={{ width: itemBoxWidth, height: itemBoxHeight }}
                              resizeMode="contain"
                            />
                            <Image
                              source={
                                met && config.collectionImage
                                  ? config.collectionImage
                                  : config.collectionShadow || DEFAULT_SHADOW
                              }
                              style={[styles.giftItem, { height: imgHeight, top: imgTop, left: itemBoxWidth * (cs?.leftRatio ?? 0.13) }]}
                              resizeMode="contain"
                            />
                            <Text style={[styles.giftItemText, { bottom: itemTextBottom, fontSize: itemFontSize }]}>
                              {met ? config.name : '???'}
                            </Text>
                          </View>
                        );
                      })}
                    </>
                  )}
                  {selectedTab === 'gift' && (
                    <>
                      {ALL_PLANT_TYPES.map((type) => {
                        const collected = collection.includes(type);
                        const isNew = collected && !seenCollection.includes(type);
                        const config = PLANT_CONFIGS[type];
                        return (
                          <TouchableOpacity
                            key={type}
                            style={[styles.giftItemWrapper, { width: itemBoxWidth }]}
                            disabled={!collected}
                            activeOpacity={0.7}
                            onPress={() => {
                              if (collected) {
                                setSelectedPlant(type);
                                if (isNew) {
                                  markCollectionAsSeen(type);
                                }
                              }
                            }}
                          >
                            <Image
                              source={require('../assets/ui/common/gift-item-box.png')}
                              style={{ width: itemBoxWidth, height: itemBoxHeight }}
                              resizeMode="contain"
                            />
                            {isNew && (
                              <Text style={[styles.newBadge, { fontSize: itemBoxHeight * 0.08 }]}>NEW</Text>
                            )}
                            {collected ? (
                              <Image
                                source={PLANT_CONFIGS[type].collectionImage || PLANT_STAGE_IMAGES[type]?.[3]}
                                style={[styles.giftItem, { height: itemImageHeight, top: itemImageTop }]}
                                resizeMode="contain"
                              />
                            ) : (
                              <Image
                                source={config.collectionShadow || DEFAULT_SHADOW}
                                style={[styles.giftItem, { height: itemImageHeight, top: itemImageTop }]}
                                resizeMode="contain"
                              />
                            )}
                            <Text style={[styles.giftItemText, { bottom: itemTextBottom, fontSize: itemFontSize }]}>
                              {collected ? config.name : '???'}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  )}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(252, 239, 215, 0)', 'rgba(252, 239, 215, 0.95)']}
                style={styles.fadeGradient}
                pointerEvents="none"
              />
            </View>

            {/* 닫기 버튼 - 모달 이미지 기준 */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* 작물 상세 정보 모달 */}
        {selectedPlant && (
          <View style={styles.detailModalOverlay} pointerEvents="box-none">
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setSelectedPlant(null)}
            />
            <View style={styles.detailCard}>
              <View style={styles.detailContent}>
                {/* 작물 이미지 */}
                <Image
                  source={PLANT_CONFIGS[selectedPlant].collectionImage || PLANT_STAGE_IMAGES[selectedPlant]?.[3]}
                  style={styles.detailImage}
                  resizeMode="contain"
                />

                {/* 작물 이름 */}
                <Text style={styles.detailName}>{PLANT_CONFIGS[selectedPlant].name}</Text>

                {/* 등급 */}
                <Text style={styles.detailRarity}>
                  {PLANT_CONFIGS[selectedPlant].rarity === 'common' ? '일반' :
                   PLANT_CONFIGS[selectedPlant].rarity === 'rare' ? '희귀' : '전설'}
                </Text>

                {/* 구분선 */}
                <View style={styles.divider} />

                {/* 기본 정보 */}
                <View style={styles.detailInfoRow}>
                  <Text style={styles.detailLabel}>성장시간</Text>
                  <Text style={styles.detailValue}>
                    {PLANT_CONFIGS[selectedPlant].growthTime >= 60
                      ? `${Math.floor(PLANT_CONFIGS[selectedPlant].growthTime / 60)}시간`
                      : `${PLANT_CONFIGS[selectedPlant].growthTime}분`}
                  </Text>
                </View>

                <View style={styles.detailInfoRow}>
                  <Text style={styles.detailLabel}>수확 골드</Text>
                  <Text style={styles.detailValue}>{PLANT_CONFIGS[selectedPlant].harvestGold}</Text>
                </View>

                {/* 구분선 */}
                <View style={styles.divider} />

                {/* 설명 */}
                <Text style={styles.detailDescription}>
                  {PLANT_CONFIGS[selectedPlant].description}
                </Text>

                {/* 특별한 이야기 */}
                {PLANT_CONFIGS[selectedPlant].story && (
                  <Text style={styles.detailStory}>
                    {PLANT_CONFIGS[selectedPlant].story}
                  </Text>
                )}
              </View>

              {/* 닫기 버튼 */}
              <TouchableOpacity
                style={styles.detailCloseButton}
                onPress={() => setSelectedPlant(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.detailCloseText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...modalStyles,
  container: {
    ...modalStyles.container,
    marginTop: bgHeight * 0.07,
  },
  closeButton: {
    ...modalStyles.closeButton,
    position: 'absolute',
    top: bgHeight * 0.02,
    right: bgWidth * 0.05,
  },
  closeButtonText: modalStyles.closeButtonText,
  collectionBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '3%',
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  tabContainer: {
    position: 'absolute',
    top: '-9%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  tab1: {
    zIndex: 2,
  },
  tab2: {
    marginLeft: tabMarginLeft,
    zIndex: 1,
  },
  tabImage: {
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
    width: '85%',
    marginTop: scrollMarginTop,
    marginBottom: scrollMarginBottom,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: fadeHeight,
  },
  scrollContent: {
    paddingVertical: 0
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
  giftItemWrapper: {
    position: 'relative',
  },
  giftItem: {
    position: 'absolute',
    width: '70%',
    left: '13%',
  },
  giftItemText: {
    position: 'absolute',
    left: -5,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Gaegu-Bold',
    color: '#8B6F47',
  },
  newBadge: {
    position: 'absolute',
    top: '8%',
    left: '8%',
    zIndex: 10,
    fontFamily: 'Gaegu-Bold',
    color: '#E08080',
    transform: [{ rotate: '-15deg' }],
  },
  lockedText: {
    position: 'absolute',
    width: '70%',
    left: '13%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Gaegu-Bold',
    color: '#C8B99A',
    lineHeight: undefined,
  },
  detailModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailCard: {
    width: '75%',
    backgroundColor: '#FCEFD7',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#D4C4A8',
  },
  detailContent: {
    alignItems: 'center',
  },
  detailImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  detailName: {
    fontSize: 28,
    fontFamily: 'Gaegu-Bold',
    color: '#5D4037',
    marginBottom: 4,
  },
  detailRarity: {
    fontSize: 16,
    fontFamily: 'Gaegu-Regular',
    color: '#8B6F47',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#D4C4A8',
    marginVertical: 12,
  },
  detailInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 18,
    fontFamily: 'Gaegu-Regular',
    color: '#8B6F47',
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'Gaegu-Bold',
    color: '#5D4037',
  },
  detailDescription: {
    fontSize: 18,
    fontFamily: 'Gaegu-Regular',
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 8,
  },
  detailStory: {
    fontSize: 16,
    fontFamily: 'Gaegu-Regular',
    color: '#8B6F47',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
    fontStyle: 'italic',
  },
  detailCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5EDD6',
    borderWidth: 2,
    borderColor: '#8B6F47',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  detailCloseText: {
    fontSize: 22,
    fontFamily: 'Gaegu-Bold',
    color: '#5D4037',
    marginTop: -2,
  },
});
