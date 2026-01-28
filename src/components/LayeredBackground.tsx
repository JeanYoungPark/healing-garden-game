// 🌱 Healing Garden - Layered Background Component

import React from 'react';
import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export const LayeredBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* 하늘 그라데이션 배경 */}
      <LinearGradient
        colors={['#D4E5F5', '#A8D8EA']}
        style={styles.sky}
      />

      {/* 잔디 배경 이미지 (하단 90%) */}
      <ImageBackground
        source={require('../assets/garden-background.png')}
        style={styles.groundContainer}
        resizeMode="cover"
        imageStyle={styles.backgroundImage}
      />

      {/* 컨텐츠 */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  groundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
