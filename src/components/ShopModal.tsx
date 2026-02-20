// 🌱 Healing Garden - Shop Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';
import { useGardenStore } from '../stores/gardenStore';
import { GameAlert } from './GameAlert';
import { ConfirmModal } from './ConfirmModal';
import { FENCE_CONFIGS, ALL_FENCE_IDS } from '../utils/fenceConfigs';
import { PLOT_CONFIGS, ALL_PLOT_IDS } from '../utils/plotConfigs';

// 배경 크기 계산 (shop-bg: 1079 x 1488)
const { bgWidth, bgHeight } = calcBackgroundSize(1079, 1488);

// 탭 크기 계산 (shop-tab: 414 x 144)
const { width: tabWidth, height: tabHeight } = calcElementSize(bgWidth, 0.33, 414, 144);

// 탭 간격 (음수로 겹침)
const tabGap = -bgWidth * 0.01;

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

// 탭 텍스트 크기 계산 (탭 높이 기준)
const tabFontSize = tabHeight * 0.55;

// 아이템 박스 크기 계산 (shop-item-box: 500 x 600)
const { width: itemBoxWidth, height: itemBoxHeight } = calcElementSize(bgWidth, 0.41, 500, 600);

// 아이템 이미지/가격 위치 계산
const itemImageHeight = itemBoxHeight * 0.5;
const itemImageTop = itemBoxHeight * 0.13;
const priceTop = itemBoxHeight * 0.6;

// 스크롤 영역 마진 (배경 높이 기준)
const scrollMarginTop = bgHeight * 0.27;
const scrollMarginBottom = bgHeight * 0.07;

// 하단 그라데이션 높이 (배경 높이 기준)
const fadeHeight = bgHeight * 0.04;

// 가격 아이콘/텍스트 크기 (아이템 박스 기준)
const priceIconSize = itemBoxHeight * 0.1;
const priceFontSize = itemBoxHeight * 0.1;
const priceGap = itemBoxWidth * 0.03;
const priceMarginLeft = -itemBoxWidth * 0.05;

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose }) => {
  const [selectedTab, setSelectedTab] = React.useState<'tab1' | 'tab2'>('tab1');
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('새싹이 부족해요');
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [pendingPurchase, setPendingPurchase] = React.useState<{
    type: 'fence' | 'plot';
    id?: string;
    name: string;
    price: number;
    index?: number; // 밭 인덱스
  } | null>(null);
  const gold = useGardenStore((state) => state.gold);
  const fences = useGardenStore((state) => state.fences);
  const equippedFence = useGardenStore((state) => state.equippedFence);
  const purchaseFence = useGardenStore((state) => state.purchaseFence);
  const equipFence = useGardenStore((state) => state.equipFence);
  const plots = useGardenStore((state) => state.plots);
  const equippedPlot = useGardenStore((state) => state.equippedPlot);
  const purchasePlot = useGardenStore((state) => state.purchasePlot);
  const equipPlot = useGardenStore((state) => state.equipPlot);

  // 울타리 구매/장착 핸들러
  const handleFenceClick = (fenceId: string) => {
    const config = FENCE_CONFIGS[fenceId];
    if (!config) return;

    // 기본 울타리는 바로 장착
    if (config.isDefault) {
      equipFence(fenceId);
      setAlertMessage(`${config.name}를 장착했어요!`);
      setAlertVisible(true);
      return;
    }

    // 이미 구매한 울타리면 바로 장착
    if (fences.some((f) => f.id === fenceId)) {
      equipFence(fenceId);
      setAlertMessage(`${config.name}를 장착했어요!`);
      setAlertVisible(true);
      return;
    }

    // 새싹 부족 체크
    if (gold < config.price) {
      setAlertMessage('새싹이 부족해요');
      setAlertVisible(true);
      return;
    }

    // 구매 확인 모달 표시
    setPendingPurchase({ type: 'fence', id: fenceId, name: config.name, price: config.price });
    setConfirmVisible(true);
  };

  // 구매 확인
  const handleConfirmPurchase = () => {
    if (!pendingPurchase) return;

    if (pendingPurchase.type === 'fence' && pendingPurchase.id) {
      // 울타리 구매
      const success = purchaseFence(pendingPurchase.id, pendingPurchase.price);
      if (success) {
        equipFence(pendingPurchase.id);
        setAlertMessage(`${pendingPurchase.name}를 구매하고 장착했어요!`);
        setAlertVisible(true);
      }
    } else if (pendingPurchase.type === 'plot' && pendingPurchase.id) {
      // 밭 구매
      const success = purchasePlot(pendingPurchase.id, pendingPurchase.price);
      if (success) {
        equipPlot(pendingPurchase.id);
        setAlertMessage(`${pendingPurchase.name}을 구매하고 장착했어요!`);
        setAlertVisible(true);
      }
    }

    setConfirmVisible(false);
    setPendingPurchase(null);
  };

  // 구매 취소
  const handleCancelPurchase = () => {
    setConfirmVisible(false);
    setPendingPurchase(null);
  };

  // 밭 구매/장착 핸들러
  const handlePlotClick = (plotId: string) => {
    const config = PLOT_CONFIGS[plotId];
    if (!config) return;

    // 기본 밭은 바로 장착
    if (config.isDefault) {
      equipPlot(plotId);
      setAlertMessage(`${config.name}을 장착했어요!`);
      setAlertVisible(true);
      return;
    }

    // 이미 구매한 밭이면 바로 장착
    if (plots.some((p) => p.id === plotId)) {
      equipPlot(plotId);
      setAlertMessage(`${config.name}을 장착했어요!`);
      setAlertVisible(true);
      return;
    }

    // 새싹 부족 체크
    if (gold < config.price) {
      setAlertMessage('새싹이 부족해요');
      setAlertVisible(true);
      return;
    }

    // 구매 확인 모달 표시
    setPendingPurchase({ type: 'plot', id: plotId, name: config.name, price: config.price });
    setConfirmVisible(true);
  };

  // 밭 데이터 (plotConfigs 기반)
  const plotItemsData = ALL_PLOT_IDS.map(id => {
    const config = PLOT_CONFIGS[id];
    const isPurchased = config.isDefault || plots.some((p) => p.id === id);
    const isEquipped = equippedPlot === id;
    return {
      id,
      image: config.shopImage || config.image, // 상점 아이콘 우선 사용
      name: config.name,
      price: config.price,
      isPurchased,
      isEquipped,
    };
  });

  // 울타리 데이터 (fenceConfigs 기반)
  const fenceItemsData = ALL_FENCE_IDS.map(id => {
    const config = FENCE_CONFIGS[id];
    const isPurchased = config.isDefault || fences.some((f) => f.id === id);
    const isEquipped = equippedFence === id;
    return {
      id,
      image: config.shopImage || config.image, // 상점 아이콘 우선 사용
      name: config.name,
      price: config.price,
      isPurchased,
      isEquipped,
    };
  });

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
        {/* 상점 컨텐츠 */}
        <View style={styles.container}>
          {/* 상점 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/shop-bg.png')}
            style={styles.shopBackground}
            resizeMode="stretch"
          >
            {/* 모달 제목 */}
            <Text style={styles.modalTitle}>상점</Text>

            {/* 탭 버튼 */}
            <View style={styles.tabContainer}>
              {/* 탭 1 - 밭 */}
              <TouchableOpacity
                style={[styles.tab, { width: tabWidth, height: tabHeight }]}
                onPress={() => setSelectedTab('tab1')}
                activeOpacity={0.8}
              >
                <Image
                  source={selectedTab === 'tab1'
                    ? require('../assets/ui/common/shop-tab-on.png')
                    : require('../assets/ui/common/shop-tab-off.png')
                  }
                  style={styles.tabImage}
                  resizeMode="contain"
                  fadeDuration={0}
                />
                <Text style={styles.tabLabel}>밭</Text>
              </TouchableOpacity>

              {/* 탭 2 - 울타리 */}
              <TouchableOpacity
                style={[styles.tab, { width: tabWidth, height: tabHeight }]}
                onPress={() => setSelectedTab('tab2')}
                activeOpacity={0.8}
              >
                <Image
                  source={selectedTab === 'tab2'
                    ? require('../assets/ui/common/shop-tab-on.png')
                    : require('../assets/ui/common/shop-tab-off.png')
                  }
                  style={styles.tabImage}
                  resizeMode="contain"
                  fadeDuration={0}
                />
                <Text style={styles.tabLabel}>울타리</Text>
              </TouchableOpacity>
            </View>

            {/* 상품 목록 */}
            <View style={styles.scrollContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View style={styles.grid}>
                  {selectedTab === 'tab1' ? (
                    // 밭 탭
                    plotItemsData.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.itemBoxWrapper, { width: itemBoxWidth }]}
                        activeOpacity={0.7}
                        onPress={() => handlePlotClick(item.id)}
                      >
                        <Image
                          source={require('../assets/garden/props/shop-item-box.png')}
                          style={{ width: itemBoxWidth, height: itemBoxHeight }}
                          resizeMode="contain"
                        />
                        <Image
                          source={item.image}
                          style={[
                            styles.itemImage,
                            { height: itemImageHeight, top: itemImageTop }
                          ]}
                          resizeMode="contain"
                        />
                        {/* 가격 표시 */}
                        <View style={[styles.priceContainer, { top: priceTop }]}>
                          <Image
                            source={require('../assets/ui/common/leaf-coin-shop.png')}
                            style={styles.priceIcon}
                            resizeMode="contain"
                          />
                          <Text style={styles.priceText}>
                            {item.isPurchased ? (item.isEquipped ? '장착중' : '보유중') : (item.price === 0 ? '기본' : item.price.toLocaleString())}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    // 울타리 탭
                    fenceItemsData.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.itemBoxWrapper, { width: itemBoxWidth }]}
                        activeOpacity={0.7}
                        onPress={() => handleFenceClick(item.id)}
                      >
                        <Image
                          source={require('../assets/garden/props/shop-item-box.png')}
                          style={{ width: itemBoxWidth, height: itemBoxHeight }}
                          resizeMode="contain"
                        />
                        <Image
                          source={item.image}
                          style={[
                            styles.itemImage,
                            { height: itemImageHeight * 0.4, top: itemImageTop + itemImageHeight * 0.3 }
                          ]}
                          resizeMode="contain"
                        />
                        {/* 가격 표시 */}
                        <View style={[styles.priceContainer, { top: priceTop }]}>
                          <Image
                            source={require('../assets/ui/common/leaf-coin-shop.png')}
                            style={styles.priceIcon}
                            resizeMode="contain"
                          />
                          <Text style={styles.priceText}>
                            {item.isPurchased ? (item.isEquipped ? '장착중' : '보유중') : (item.price === 0 ? '기본' : item.price.toLocaleString())}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(183, 140, 87, 0)', 'rgba(183, 140, 87, 0.95)']}
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
      </View>

      {/* 구매 확인 모달 */}
      <ConfirmModal
        visible={confirmVisible}
        title="구매 확인"
        message={pendingPurchase ? `${pendingPurchase.name}을(를)\n새싹 ${pendingPurchase.price.toLocaleString()}개로 구매하시겠습니까?` : ''}
        confirmText="구매"
        cancelText="취소"
        onConfirm={handleConfirmPurchase}
        onCancel={handleCancelPurchase}
      />

      {/* 상점 알럿 */}
      <GameAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...modalStyles,
  closeButton: {
    ...modalStyles.closeButton,
    position: 'absolute',
    top: bgHeight * 0.03,
    right: bgWidth * 0.05,
  },
  closeButtonText: modalStyles.closeButtonText,
  shopBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '9%',
    fontSize: modalTitleFontSize,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  tabContainer: {
    position: 'absolute',
    top: '15.7%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tab: {
    marginLeft: tabGap,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tabLabel: {
    fontSize: tabFontSize,
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  scrollContainer: {
    flex: 1,
    width: '84%',
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
  itemBoxWrapper: {
    position: 'relative',
  },
  itemImage: {
    position: 'absolute',
    width: '68%',
    left: '14%',
    // height, top은 인라인으로 적용
  },
  priceContainer: {
    position: 'absolute',
    // top은 인라인으로 적용
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: priceGap,
    marginLeft: priceMarginLeft,
  },
  priceIcon: {
    width: priceIconSize,
    height: priceIconSize,
  },
  priceText: {
    fontSize: priceFontSize,
    fontFamily: 'Gaegu-Bold',
    color: '#A1887F',
  },
});
