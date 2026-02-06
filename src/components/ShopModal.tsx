// 🌱 Healing Garden - Shop Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Dimensions, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose }) => {
  const [selectedTab, setSelectedTab] = React.useState<'tab1' | 'tab2'>('tab1');

  // farm-plot 이미지 및 가격 매핑
  const farmPlotData = [
    { image: require('../assets/shop/farm-plot-decor-01.png'), price: 0 },
    { image: require('../assets/shop/farm-plot-decor-02.png'), price: 5000 },
    { image: require('../assets/shop/farm-plot-decor-03.png'), price: 10000 },
    { image: require('../assets/shop/farm-plot-decor-04.png'), price: 20000 },
    { image: require('../assets/shop/farm-plot-decor-05.png'), price: 30000 },
  ];

  // fence-decor 이미지 및 가격 매핑
  const fenceDecorData = [
    { image: require('../assets/shop/fence-decor-01.png'), price: 0 },
    { image: require('../assets/shop/fence-decor-02.png'), price: 5000 },
    { image: require('../assets/shop/fence-decor-03.png'), price: 10000 },
    { image: require('../assets/shop/fence-decor-04.png'), price: 20000 },
    { image: require('../assets/shop/fence-decor-05.png'), price: 30000 },
  ];

  // 선택된 탭에 따라 표시할 데이터 결정
  const shopItemsData = selectedTab === 'tab1' ? farmPlotData : fenceDecorData;

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
            resizeMode="contain"
          >
            {/* 탭 버튼 */}
            <View style={styles.tabContainer}>
              {/* 탭 1 - 밭 */}
              <TouchableOpacity
                style={[styles.tab1, { zIndex: selectedTab === 'tab1' ? 12 : 11 }]}
                onPress={() => setSelectedTab('tab1')}
                activeOpacity={1}
              >
                {selectedTab === 'tab1' ? (
                  <Image
                    source={require('../assets/ui/common/shop-tab3.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                ) : (
                  <Image
                    source={require('../assets/ui/common/shop-tab1.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                )}
              </TouchableOpacity>

              {/* 탭 2 - 울타리 */}
              <TouchableOpacity
                style={[styles.tab2, { zIndex: selectedTab === 'tab2' ? 12 : 11 }]}
                onPress={() => setSelectedTab('tab2')}
                activeOpacity={1}
              >
                {selectedTab === 'tab2' ? (
                  <Image
                    source={require('../assets/ui/common/shop-tab2.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                ) : (
                  <Image
                    source={require('../assets/ui/common/shop-tab4.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                )}
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
                  {shopItemsData.map((item, index) => (
                    <View key={index} style={styles.itemBoxWrapper}>
                      <Image
                        source={require('../assets/garden/props/shop-item-box.png')}
                        style={styles.itemBox}
                        resizeMode="contain"
                      />
                      <Image
                        source={item.image}
                        style={[
                          styles.itemImage,
                          selectedTab === 'tab1' && (index === 3 || index === 4) && { width: '85%', left: '6%', top: '-5%' }
                        ]}
                        resizeMode="contain"
                      />
                      {/* 가격 표시 */}
                      <View style={styles.priceContainer}>
                        <Image
                          source={require('../assets/ui/common/leaf-coin-shop.png')}
                          style={styles.priceIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.priceText}>
                          {item.price === 0 ? '기본' : item.price.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(183, 140, 87, 0)', 'rgba(183, 140, 87, 0.95)']}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopBackground: {
    width: width - 30,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    position: 'absolute',
    top: '23.3%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tab1: {
    width: 110,
    height: 60,
    zIndex: 12,
  },
  tab2: {
    width:110,
    height: 60,
    marginLeft: -17,
    zIndex: 11,
  },
  tabImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    zIndex: 100,
    padding: 8,
  },
  closeIcon: {
    width: 50,
    height: 50,
  },
  scrollContainer: {
    flex: 1,
    width: '84%',
    marginTop: 210,
    marginBottom: 120,
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
    height: 40,
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
    width: '50%',
    position: 'relative',
    },
  itemBox: {
    width: '100%',
    height: 160,
  },
  itemImage: {
    position: 'absolute',
    width: '68%',
    height: 100,
    top: 5,
    left: '14%',
  },
  priceContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginLeft: -10,
  },
  priceIcon: {
    width: 16,
    height: 16,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Gaegu-Bold',
    color: '#A1887F',
  },
});
