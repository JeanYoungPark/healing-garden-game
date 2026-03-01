// 🌱 Healing Garden - Quest Modal

import React from 'react';
import { StyleSheet, View, Modal, ImageBackground, TouchableOpacity, Text, Image } from 'react-native';
import { calcBackgroundSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';
import { useGardenStore } from '../stores/gardenStore';
import { QUEST_CONFIGS, QUEST_REWARD_GOLD } from '../utils/questConfigs';
import { GameAlert } from './GameAlert';

// 배경 크기 계산 (quest-bg: 1071 x 1483)
const { bgWidth, bgHeight } = calcBackgroundSize(1071, 1483);

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

// 크기 상수
const questIconSize = bgWidth * 0.085;
const questFontSize = bgWidth * 0.044;
const progressBarHeight = bgHeight * 0.028;

interface QuestModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({ visible, onClose }) => {
  const dailyQuest = useGardenStore((state) => state.dailyQuest);
  const claimQuestReward = useGardenStore((state) => state.claimQuestReward);
  const visitors = useGardenStore((state) => state.visitors);

  const [alertVisible, setAlertVisible] = React.useState(false);

  const completedCount = QUEST_CONFIGS.filter(
    (q) => (dailyQuest.progress[q.id] || 0) >= q.target
  ).length;

  const allCompleted = completedCount === QUEST_CONFIGS.length;
  const canClaim = allCompleted && !dailyQuest.rewardClaimed;

  const handleClaimReward = () => {
    const success = claimQuestReward();
    if (success) {
      setAlertVisible(true);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container} pointerEvents="box-none">
          <ImageBackground
            source={require('../assets/garden/props/quest-bg.png')}
            style={styles.questBackground}
            resizeMode="stretch"
          >
            {/* 모달 제목 */}
            <Text style={[styles.modalTitle, { fontSize: modalTitleFontSize }]}>일일 퀘스트</Text>

            {/* 콘텐츠 영역 */}
            <View style={styles.content}>
              {/* 퀘스트 목록 */}
              {QUEST_CONFIGS.map((quest) => {
                const current = dailyQuest.progress[quest.id] || 0;
                const isCompleted = current >= quest.target;
                const progress = Math.min(current / quest.target, 1);
                const isAnimalQuest = quest.id === 'claimAnimal';
                const hasVisitors = visitors.length > 0;

                return (
                  <React.Fragment key={quest.id}>
                    <View style={styles.questRow}>
                      <Image
                        source={quest.icon}
                        style={{ width: questIconSize, height: questIconSize }}
                        resizeMode="contain"
                      />
                      <Text
                        style={[
                          styles.questName,
                          { fontSize: questFontSize },
                        ]}
                        numberOfLines={1}
                      >
                        {quest.name}
                      </Text>
                      <View style={[styles.progressBarBg, { height: progressBarHeight }]}>
                        {progress > 0 && (
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${progress * 100}%` },
                            ]}
                          />
                        )}
                      </View>
                      <View style={styles.questStatus}>
                        {isCompleted ? (
                          <Text style={[styles.checkMark, { fontSize: questFontSize * 1.1 }]}>✓</Text>
                        ) : isAnimalQuest && !hasVisitors && current === 0 ? (
                          <Text style={[styles.waitingText, { fontSize: questFontSize * 0.85 }]}>대기</Text>
                        ) : (
                          <Text style={[styles.progressText, { fontSize: questFontSize * 0.9 }]}>
                            {current}/{quest.target}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.separator} />
                  </React.Fragment>
                );
              })}

              {/* 보상 받기 */}
              {allCompleted && !dailyQuest.rewardClaimed ? (
                <TouchableOpacity
                  style={styles.rewardButton}
                  onPress={handleClaimReward}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../assets/quest/quest-gift.png')}
                    style={{ width: questIconSize, height: questIconSize }}
                    resizeMode="contain"
                  />
                  <Text style={[styles.rewardButtonText, { fontSize: questFontSize }]}>
                    보상 받기
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.questRow}>
                  <Image
                    source={require('../assets/quest/quest-gift.png')}
                    style={[
                      { width: questIconSize, height: questIconSize },
                      dailyQuest.rewardClaimed && { opacity: 0.5 },
                    ]}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.questName,
                      { fontSize: questFontSize },
                    ]}
                    numberOfLines={1}
                  >
                    {dailyQuest.rewardClaimed ? '수령 완료' : '보상 받기'}
                  </Text>
                  <View style={[styles.progressBarBg, { height: progressBarHeight }]}>
                    {completedCount > 0 && (
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${(completedCount / QUEST_CONFIGS.length) * 100}%` },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.questStatus}>
                    <Text style={[styles.progressText, { fontSize: questFontSize * 0.9 }]}>
                      {completedCount}/{QUEST_CONFIGS.length}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* 닫기 버튼 */}
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

      <GameAlert
        visible={alertVisible}
        message={`새싹 ${QUEST_REWARD_GOLD}개를 받았어요!`}
        duration={2000}
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
    top: bgHeight * 0.1,
    right: bgWidth * 0.07,
  },
  closeButtonText: modalStyles.closeButtonText,
  questBackground: {
    width: bgWidth,
    height: bgHeight,
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '5.7%',
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },

  // 콘텐츠 영역: 타이틀 아래 ~ 하단 여백 사이
  content: {
    position: 'absolute',
    top: bgHeight * 0.16,
    bottom: bgHeight * 0.08,
    left: bgWidth * 0.1,
    right: bgWidth * 0.1,
    justifyContent: 'center',
    gap: bgHeight * 0.028,
  },

  // 퀘스트 행
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: bgWidth * 0.03,
  },
  questName: {
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    width: bgWidth * 0.22,
  },
  progressBarBg: {
    flex: 1,
    height: progressBarHeight,
    backgroundColor: '#E0D5C1',
    borderRadius: progressBarHeight / 2,
    padding: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C9D779',
    borderRadius: progressBarHeight / 2,
    borderWidth: 1,
    borderColor: '#646A1E',
  },
  questStatus: {
    width: bgWidth * 0.1,
    alignItems: 'center',
  },
  checkMark: {
    fontFamily: 'Gaegu-Bold',
    color: '#C9D779',
  },
  waitingText: {
    fontFamily: 'Gaegu-Regular',
    color: '#BCAAA4',
  },
  progressText: {
    fontFamily: 'Gaegu-Regular',
    color: '#A1887F',
  },

  // 보상 받기 버튼 (전체 완료 시)
  rewardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5CD88',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#7A6854',
    paddingVertical: bgHeight * 0.015,
    paddingHorizontal: bgWidth * 0.06,
    gap: bgWidth * 0.03,
  },
  rewardButtonText: {
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
  },

  // 구분선 (각 항목 사이)
  separator: {
    height: 1,
    backgroundColor: '#DAD1C4',
  },

});
