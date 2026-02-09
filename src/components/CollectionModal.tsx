// 🌱 Healing Garden - Collection Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';
import { useGardenStore } from '../stores/gardenStore';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { PLANT_STAGE_IMAGES } from '../utils/plantStageConfigs';
import { PlantType } from '../types';

const ALL_PLANTS: PlantType[] = ['carrot', 'turnip', 'strawberry', 'watermelon', 'peach', 'grape', 'apple'];

// 도감용 이미지 (씨앗/대표 이미지)
const COLLECTION_IMAGES: Partial<Record<PlantType, any>> = {
  carrot: require('../assets/seeds/carrot-seed.png'),
};

// 미수집 작물 이미지
const GIFT_ITEM_IMAGES = [
  require('../assets/ui/common/gift-item-01.png'),
  require('../assets/ui/common/gift-item-02.png'),
  require('../assets/ui/common/gift-item-03.png'),
  require('../assets/ui/common/gift-item-04.png'),
  require('../assets/ui/common/gift-item-05.png'),
];

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
  const { collection, seenCollection } = useGardenStore();
  const [selectedTab, setSelectedTab] = React.useState<'animal' | 'gift'>('animal');

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
                      {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={[styles.giftItemWrapper, { width: itemBoxWidth }]}>
                          <Image
                            source={require('../assets/ui/common/gift-item-box.png')}
                            style={{ width: itemBoxWidth, height: itemBoxHeight }}
                            resizeMode="contain"
                          />
                          <Image
                            source={
                              item === 1 ? require('../assets/ui/common/animal-item-01.png') :
                              item === 2 ? require('../assets/ui/common/animal-item-02.png') :
                              item === 3 ? require('../assets/ui/common/animal-item-03.png') :
                              require('../assets/ui/common/animal-item-04.png')
                            }
                            style={[styles.giftItem, { height: itemImageHeight, top: itemImageTop }]}
                            resizeMode="contain"
                          />
                          <Text style={[styles.giftItemText, { bottom: itemTextBottom, fontSize: itemFontSize }]}>???</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {selectedTab === 'gift' && (
                    <>
                      {ALL_PLANTS.map((type, index) => {
                        const collected = collection.includes(type);
                        const isNew = collected && !seenCollection.includes(type);
                        const config = PLANT_CONFIGS[type];
                        return (
                          <View key={type} style={[styles.giftItemWrapper, { width: itemBoxWidth }]}>
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
                                source={COLLECTION_IMAGES[type] || PLANT_STAGE_IMAGES[type]?.[3]}
                                style={[styles.giftItem, { height: itemImageHeight, top: itemImageTop }]}
                                resizeMode="contain"
                              />
                            ) : (
                              <Image
                                source={GIFT_ITEM_IMAGES[index % GIFT_ITEM_IMAGES.length]}
                                style={[styles.giftItem, { height: itemImageHeight, top: itemImageTop }]}
                                resizeMode="contain"
                              />
                            )}
                            <Text style={[styles.giftItemText, { bottom: itemTextBottom, fontSize: itemFontSize }]}>
                              {collected ? config.name : '???'}
                            </Text>
                          </View>
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
          </ImageBackground>
        </View>

        {/* 닫기 버튼 - 화면 기준 절대 위치 */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/ui/common/back-btn.png')}
            style={styles.closeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
});
