// 🍓 Healing Garden - Free Garden Area (자유 배치)

import React, { forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ImageBackground, Image, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Plant } from '../types';

const { width, height } = Dimensions.get('window');

interface GardenAreaProps {
  plants: Plant[];
  onPlantPress?: (plantId: string) => void;
  onMailboxPress?: () => void;
}

// 과일 성장 단계 이모지
const PLANT_EMOJIS = {
  strawberry: ['🌱', '🌿', '🌸', '🍓'],
  watermelon: ['🌱', '🌿', '🌼', '🍉'],
  peach: ['🌱', '🌿', '🌸', '🍑'],
  grape: ['🌱', '🌿', '🌼', '🍇'],
  apple: ['🌱', '🌿', '🌸', '🍎'],
};

export const GardenArea = forwardRef<View, GardenAreaProps>(({
  plants,
  onPlantPress,
  onMailboxPress,
}, ref) => {
  // 3x3 그리드 생성
  const gridSlots = Array.from({ length: 9 }, (_, index) => index);
  const plotSize = Math.min(width, height) * 0.35; // 화면 크기에 따라 조정

  return (
    <View style={styles.container}>
      {/* 드롭 가능한 정원 영역 */}
      <View
        ref={ref}
        style={styles.gardenArea}
      >
        {/* 카피바라 애니메이션 - 밭 위쪽 */}
        <LottieView
          source={require('../assets/animations/capybara.json')}
          autoPlay
          loop
          style={styles.capybaraAnimation}
        />

        {/* 우체통 아이콘 - 카피바라 오른쪽 */}
        <TouchableOpacity
          style={styles.postBoxIcon}
          activeOpacity={0.7}
          onPress={onMailboxPress}
        >
          <Image
            source={require('../assets/garden/icons/post-box.png')}
            style={styles.postBoxImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 밭과 울타리 그룹 */}
        <View style={styles.farmGroup}>
          {/* 3x3 밭 그리드 */}
          <View style={styles.gridContainer}>
            {gridSlots.map((index) => (
              <ImageBackground
                key={index}
                source={require('../assets/garden/props/farm-plot.png')}
                style={[
                  styles.plotSlot,
                  {
                    width: plotSize,
                    height: plotSize,
                  }
                ]}
                resizeMode="contain"
              />
            ))}
          </View>

          {/* 울타리 - 밭 바로 아래 */}
          <Image
            source={require('../assets/garden/props/fence.png')}
            style={styles.fence}
            resizeMode="contain"
          />
        </View>

        {/* 식물들 렌더링 */}
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={[
              styles.plantContainer,
              {
                left: plant.position.x - 40, // 중앙 정렬 (80/2)
                top: plant.position.y - 40,
              },
            ]}
            onPress={() => onPlantPress?.(plant.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.plantEmoji}>
              {PLANT_EMOJIS[plant.type][plant.stage]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gardenArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capybaraAnimation: {
    position: 'absolute',
    top: '15%',
    left: 15,
    width: 120,
    height: 120,
    zIndex: 5,
  },
  postBoxIcon: {
    position: 'absolute',
    top: '15%',
    right: 15,
    width: 120,
    height: 120,
    zIndex: 5,
  },
  postBoxImage: {
    width: '100%',
    height: '100%',
  },
  farmGroup: {
    marginTop: 100,
    alignItems: 'center',
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    gap: 0,
  },
  plotSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: -10,
    marginTop: -40,
  },
  fence: {
    width: '90%',
    height: 80,
    marginTop: 40,
  },
  plantContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  plantEmoji: {
    fontSize: 48,
  },
});
