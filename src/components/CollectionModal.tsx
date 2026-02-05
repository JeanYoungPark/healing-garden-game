// 🌱 Healing Garden - Collection Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface CollectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ visible, onClose }) => {
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

        {/* 탭 버튼 - overlay 레벨에 배치 */}
        <View style={styles.tabContainer}>
          {/* 동물도감 탭 */}
          <TouchableOpacity
            style={[styles.tab1, { zIndex: selectedTab === 'animal' ? 2 : 1 }]}
            onPress={() => setSelectedTab('animal')}
            activeOpacity={0.8}
          >
            {selectedTab === 'animal' ? (
              <Image
                source={require('../assets/ui/common/animal-tab-selected.png')}
                style={styles.tabImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../assets/ui/common/animal-tab-unselected.png')}
                style={styles.tabImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>

          {/* 선물 탭 */}
          <TouchableOpacity
            style={[styles.tab2, { zIndex: selectedTab === 'gift' ? 2 : 1 }]}
            onPress={() => setSelectedTab('gift')}
            activeOpacity={0.8}
          >
            {selectedTab === 'gift' ? (
              <Image
                source={require('../assets/ui/common/gift-tab-selected.png')}
                style={styles.tabImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../assets/ui/common/gift-tab-unselected.png')}
                style={styles.tabImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 도감 컨텐츠 */}
        <View style={styles.container} pointerEvents="box-none">
          {/* 도감 배경 - 터치 투과 */}
          <ImageBackground
            source={require('../assets/garden/props/collection-bg.png')}
            style={styles.collectionBackground}
            resizeMode="contain"
            pointerEvents="box-none"
          >
            {/* 컬렉션 목록 */}
            <View style={styles.scrollContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View style={styles.grid}>
                  {/* TODO: 도감 아이템 추가 */}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(247, 230, 196, 0)', 'rgba(247, 230, 196, 0.95)']}
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionBackground: {
    width: width - 10,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  tabContainer: {
    position: 'absolute',
    top: 145,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  tab1: {
    width: 120,
    height: 60,
  },
  tab2: {
    width:120,
    height: 60,
    marginLeft: -1,
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
    width: '85%',
    marginTop: 200,
    marginBottom: 170,
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
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});
