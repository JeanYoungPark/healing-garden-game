// 🌱 Healing Garden - Collection Modal

import React from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Dimensions, Text } from 'react-native';
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
            style={[styles.tab2, { zIndex: selectedTab === 'gift' ? 2 : 1 }]}
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

        {/* 도감 컨텐츠 */}
        <View style={styles.container} pointerEvents="box-none">
          {/* 도감 배경 - 터치 투과 */}
          <ImageBackground
            source={require('../assets/garden/props/collection-bg.png')}
            style={styles.collectionBackground}
            resizeMode="contain"
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
                  {selectedTab === 'animal' && (
                    <>
                      {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={styles.giftItemWrapper}>
                          <Image
                            source={require('../assets/ui/common/gift-item-box.png')}
                            style={styles.giftItemBox}
                            resizeMode="contain"
                          />
                          <Image
                            source={
                              item === 1 ? require('../assets/ui/common/animal-item-01.png') :
                              item === 2 ? require('../assets/ui/common/animal-item-02.png') :
                              item === 3 ? require('../assets/ui/common/animal-item-03.png') :
                              require('../assets/ui/common/animal-item-04.png')
                            }
                            style={styles.giftItem}
                            resizeMode="contain"
                          />
                          <Text style={styles.giftItemText}>???</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {selectedTab === 'gift' && (
                    <>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <View key={item} style={styles.giftItemWrapper}>
                          <Image
                            source={require('../assets/ui/common/gift-item-box.png')}
                            style={styles.giftItemBox}
                            resizeMode="contain"
                          />
                          <Image
                            source={
                              item === 1 ? require('../assets/ui/common/gift-item-01.png') :
                              item === 2 ? require('../assets/ui/common/gift-item-02.png') :
                              item === 3 ? require('../assets/ui/common/gift-item-03.png') :
                              item === 4 ? require('../assets/ui/common/gift-item-04.png') :
                              require('../assets/ui/common/gift-item-05.png')
                            }
                            style={styles.giftItem}
                            resizeMode="contain"
                          />
                          <Text style={styles.giftItemText}>???</Text>
                        </View>
                      ))}
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
  collectionBackground: {
    width: width - 30,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  tabContainer: {
    position: 'absolute',
    top: 195,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  tab1: {
    width: 140,
    height: 60,
  },
  tab2: {
    width:140,
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
  giftItemWrapper: {
    width: '50%',
    position: 'relative',
  },
  giftItemBox: {
    width: '100%',
    height: 140,
    marginBottom: 10,
  },
  giftItem: {
    position: 'absolute',
    width: '50%',
    height: 75,
    top: 20,
    left: '25%',
  },
  giftItemText: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Gaegu-Bold',
    color: '#8B6F47',
  },
});
