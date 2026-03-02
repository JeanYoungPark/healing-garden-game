// 🌱 Healing Garden - Common Screen Layout

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayeredBackground } from './LayeredBackground';
import { ResourceBar } from './ResourceBar';
import { BackButton } from './BackButton';
import { useGardenStore } from '../stores/gardenStore';
import { QUEST_CONFIGS } from '../utils/questConfigs';

interface ScreenLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  hideHeader?: boolean;
  onQuestPress?: () => void;
  onCollectionPress?: () => void;
  onSettingsPress?: () => void;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  showBackButton = false,
  onBack,
  hideHeader = false,
  onQuestPress,
  onCollectionPress,
  onSettingsPress,
}) => {
  const insets = useSafeAreaInsets();
  const { gold, water, collection, seenCollection, dailyQuest } = useGardenStore();
  const hasNewCollection = collection.length > seenCollection.length;
  const canClaimQuestReward = !dailyQuest.rewardClaimed &&
    QUEST_CONFIGS.every((q) => (dailyQuest.progress[q.id] || 0) >= q.target);

  return (
    <LayeredBackground>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {!hideHeader && (
          <View style={styles.header}>
            <ResourceBar
              gold={gold}
              water={water}
              onQuestPress={onQuestPress}
              onCollectionPress={onCollectionPress}
              onSettingsPress={onSettingsPress}
              hasNewCollection={hasNewCollection}
              canClaimQuestReward={canClaimQuestReward}
            />
          </View>
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  content: {
    flex: 1,
    marginTop: -30,
  },
});
