// 🌱 Healing Garden - Shop Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose }) => {
  // 임시로 6개의 상점 아이템 생성
  const shopItems = Array.from({ length: 6 }, (_, i) => i);
  const [selectedTab, setSelectedTab] = React.useState<'tab1' | 'tab2'>('tab1');

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
              {/* 탭 1 */}
              <TouchableOpacity
                style={[styles.tab1, { zIndex: selectedTab === 'tab1' ? 12 : 11 }]}
                onPress={() => setSelectedTab('tab1')}
                activeOpacity={0.8}
              >
                {selectedTab === 'tab1' ? (
                  <Image
                    source={require('../assets/ui/common/tab-selected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../assets/ui/common/tab-unselected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              {/* 탭 2 */}
              <TouchableOpacity
                style={[styles.tab2, { zIndex: selectedTab === 'tab2' ? 12 : 11 }]}
                onPress={() => setSelectedTab('tab2')}
                activeOpacity={0.8}
              >
                {selectedTab === 'tab2' ? (
                  <Image
                    source={require('../assets/ui/common/tab-selected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../assets/ui/common/tab-unselected.png')}
                    style={styles.tabImage}
                    resizeMode="contain"
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
                  {shopItems.map((index) => (
                    <View key={index} style={styles.itemBoxWrapper}>
                      <Image
                        source={require('../assets/garden/props/shop-item-box.png')}
                        style={styles.itemBox}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['transparent', 'rgba(183, 140, 87, 0.95)']}
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
    top: 142,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tab1: {
    width: 120,
    height: 60,
    zIndex: 12,
  },
  tab2: {
    width:120,
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
    height: 60,
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
  },
  itemBox: {
    width: '100%',
    height: 160,
  },
});
