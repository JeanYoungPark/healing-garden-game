// 🌱 Healing Garden - Common Screen Layout

import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayeredBackground } from './LayeredBackground';
import { ResourceBar } from './ResourceBar';
import { BackButton } from './BackButton';
import { useGardenStore } from '../stores/gardenStore';

interface ScreenLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  hideHeader?: boolean;
  onQuestPress?: () => void;
  onCollectionPress?: () => void;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  showBackButton = false,
  onBack,
  hideHeader = false,
  onQuestPress,
  onCollectionPress,
}) => {
  const insets = useSafeAreaInsets();
  const { level, gold, tickets } = useGardenStore();

  return (
    <LayeredBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {!hideHeader && (
          <>
            {/* Header - 리소스 바 */}
            <View style={styles.header}>
              <ResourceBar level={level} gold={gold} tickets={tickets} />
            </View>

            {/* Quest Button - 헤더 아래 오른쪽 첫번째 */}
            <TouchableOpacity
              style={[styles.questButton, { top: 53 + insets.top }]}
              activeOpacity={0.7}
              onPress={onQuestPress}
            >
              <Image
                source={require('../assets/garden/icons/quest-icon.png')}
                style={styles.topIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Collection Button - 헤더 아래 오른쪽 두번째 */}
            <TouchableOpacity
              style={[styles.collectionButton, { top: 53 + insets.top }]}
              activeOpacity={0.7}
              onPress={onCollectionPress}
            >
              <Image
                source={require('../assets/garden/icons/collection-icon.png')}
                style={styles.topIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Settings Button - 헤더 아래 오른쪽 세번째 */}
            <TouchableOpacity
              style={[styles.settingsButton, { top: 53 + insets.top }]}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/garden/icons/settings-icon.png')}
                style={styles.topIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </>
        )}

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Back Button (메인 페이지 제외) */}
        {showBackButton && onBack && (
          <BackButton onPress={onBack} />
        )}
      </View>
    </LayeredBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  questButton: {
    position: 'absolute',
    right: 99,
    padding: 8,
    zIndex: 10,
  },
  collectionButton: {
    position: 'absolute',
    right: 53,
    padding: 8,
    zIndex: 10,
  },
  settingsButton: {
    position: 'absolute',
    right: 7,
    padding: 8,
    zIndex: 10,
  },
  topIcon: {
    width: 35,
    height: 35,
  },
  content: {
    flex: 1,
  },
});
