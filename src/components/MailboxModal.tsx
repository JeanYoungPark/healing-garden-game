// 🌱 Healing Garden - Mailbox Modal

import React, { useState } from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';
import { modalStyles } from '../styles/modalStyles';
import { useGardenStore } from '../stores/gardenStore';
import { MailItem } from '../types';
import { PLANT_CONFIGS } from '../utils/plantConfigs';
import { GameAlert } from './GameAlert';

// 배경 크기 계산 (mailbox-bg: 1136 x 1437)
const { bgWidth, bgHeight } = calcBackgroundSize(1136, 1437);

// 우편 아이템 크기 계산 (mail-item: 869 x 254)
const { width: mailItemWidth, height: mailItemHeight } = calcElementSize(bgWidth, 0.75, 869, 254);

// 새 메일 뱃지 크기 계산 (mail-new-badge: 47 x 48)
// const { width: badgeWidth, height: badgeHeight } = calcElementSize(mailItemWidth, 0.08, 47, 48);

// 아이템 간격 (배경 높이 기준)
const mailItemMargin = bgHeight * 0.01;

// 스크롤 영역 마진 (배경 높이 기준)
const scrollMarginTop = bgHeight * 0.22;
const scrollMarginBottom = bgHeight * 0.07;

// 하단 그라데이션 높이 (배경 높이 기준)
const fadeHeight = bgHeight * 0.04;

interface MailboxModalProps {
  visible: boolean;
  onClose: () => void;
  onClaimReward?: (message: string) => void;
}

// 텍스트 크기 계산 (아이템 높이 기준)
const titleFontSize = mailItemHeight * 0.22;
const dateFontSize = mailItemHeight * 0.16;

// 모달 제목 크기 계산 (배경 너비 기준)
const modalTitleFontSize = bgWidth * 0.07;

// 편지 상세 배경 크기 계산 (mail-detail-bg: 994 x 1344)
const { bgWidth: detailBgWidth, bgHeight: detailBgHeight } = calcBackgroundSize(994, 1344);

// 편지 상세 텍스트 크기 계산
const detailTitleFontSize = detailBgHeight * 0.045;
const detailFromFontSize = detailBgHeight * 0.035;
const detailContentFontSize = detailBgHeight * 0.04;

export const MailboxModal: React.FC<MailboxModalProps> = ({ visible, onClose, onClaimReward }) => {
  const { mails, readMail, claimMailReward } = useGardenStore();
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleMailPress = (mail: MailItem) => {
    if (!mail.isRead) readMail(mail.id);
    setSelectedMail(mail);
  };

  const handleClaimReward = (mail: MailItem) => {
    if (mail.reward?.type === 'seed') {
      const config = PLANT_CONFIGS[mail.reward.seedType];
      const message = `${config.name} 씨앗 x${mail.reward.count}을 받았어!`;
      setAlertMessage(message);
      setAlertVisible(true);
      onClaimReward?.(message);
    }
    claimMailReward(mail.id);
    setSelectedMail(null);
  };

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
        {/* 우편함 컨텐츠 */}
        <View style={styles.container} pointerEvents="box-none">
          {/* 우편함 배경 */}
          <ImageBackground
            source={require('../assets/garden/props/mailbox-bg.png')}
            style={styles.mailboxBackground}
            resizeMode="stretch"
          >
            {/* 모달 제목 */}
            <Text style={[styles.modalTitle, { fontSize: modalTitleFontSize }]}>우편함</Text>

            {/* 우편 목록 */}
            <View style={styles.scrollContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View style={styles.contentArea}>
                  {mails.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.mailItemWrapper, { marginBottom: mailItemMargin }]}
                      activeOpacity={0.8}
                      onPress={() => handleMailPress(item)}
                    >
                      <Image
                        source={require('../assets/garden/props/mail-item.png')}
                        style={{ width: mailItemWidth, height: mailItemHeight }}
                        resizeMode="contain"
                      />
                      {/* 우편 내용 */}
                      <View style={styles.mailContent}>
                        <Text style={[styles.mailTitle, { fontSize: titleFontSize }]} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                        <Text style={[styles.mailFrom, { fontSize: dateFontSize }]}>from. {item.from}</Text>
                      </View>
                      {/* 새 메일 뱃지 */}
                      {!item.isRead && (
                        <View style={styles.newBadge} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* 하단 Fade 그라데이션 */}
              <LinearGradient
                colors={['rgba(196, 146, 91, 0)', 'rgba(196, 146, 91, 0.95)']}
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

      {/* 편지 상세 모달 */}
      {selectedMail && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedMail(null)}
        >
          <View style={styles.detailOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setSelectedMail(null)}
            />
            <View style={styles.detailContainer} pointerEvents="box-none">
              <ImageBackground
                source={require('../assets/garden/props/mail-detail-bg.png')}
                style={styles.detailBackground}
                resizeMode="stretch"
              >
                {/* 편지 내용 */}
                <View style={styles.detailContent}>
                  <Text style={[styles.detailTitle, { fontSize: detailTitleFontSize }]}>{selectedMail.title}</Text>
                  <Text style={[styles.detailBody, { fontSize: detailContentFontSize }]}>{selectedMail.content}</Text>
                  <Text style={[styles.detailFrom, { fontSize: detailFromFontSize }]}>from. {selectedMail.from}</Text>

                  {/* 보상 수령 */}
                  {selectedMail.reward && !selectedMail.isClaimed && (
                    <View style={styles.rewardArea}>
                      {selectedMail.reward.type === 'seed' && (
                        <View style={styles.seedBagWrapper}>
                          <Image
                            source={require('../assets/seeds/seed-bag.png')}
                            style={styles.seedBagImage}
                            resizeMode="contain"
                          />
                          <View style={styles.seedBagLabelWrapper}>
                            <Text style={styles.seedBagLabel} adjustsFontSizeToFit numberOfLines={1}>{PLANT_CONFIGS[selectedMail.reward.seedType].name}</Text>
                          </View>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.rewardButton}
                        activeOpacity={0.7}
                        onPress={() => handleClaimReward(selectedMail)}
                      >
                        <Text style={styles.rewardButtonText}>
                          {selectedMail.reward.type === 'seed'
                            ? `${PLANT_CONFIGS[selectedMail.reward.seedType].name} 씨앗 x${selectedMail.reward.count} 받기`
                            : '보상 받기'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {selectedMail.reward && selectedMail.isClaimed && (
                    <Text style={styles.rewardClaimed}>수령 완료!</Text>
                  )}
                </View>

                {/* 닫기 버튼 - 편지 상세 모달 */}
                <TouchableOpacity
                  style={styles.detailCloseButton}
                  onPress={() => setSelectedMail(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </Modal>
      )}

      {/* 씨앗 수령 알럿 */}
      <GameAlert
        visible={alertVisible}
        message={alertMessage}
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
    top: bgHeight * 0.07,
    right: bgWidth * 0.05,
  },
  closeButtonText: modalStyles.closeButtonText,
  detailCloseButton: {
    ...modalStyles.closeButton,
    position: 'absolute',
    top: detailBgHeight * 0.08,
    right: detailBgWidth * 0.06,
  },
  mailboxBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '3%',
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  scrollContainer: {
    flex: 1,
    width: '80%',
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
    left: '1%',
    right: '1%',
    height: fadeHeight,
  },
  scrollContent: {
    paddingVertical: 0,
  },
  contentArea: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  mailItemWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  mailContent: {
    position: 'absolute',
    left: '12%',
    top: '26%',
    right: '20%',
  },
  mailTitle: {
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    marginBottom: 8,
  },
  mailFrom: {
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
  },
  newBadge: {
    position: 'absolute',
    top: '15%',
    right: '8%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E08080',
    borderWidth: 1.5,
    borderColor: '#7a6854',
  },
  // 편지 상세 스타일
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBackground: {
    width: detailBgWidth,
    height: detailBgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    width: '75%',
    height: '60%',
    paddingTop: '5%',
  },
  detailTitle: {
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    marginBottom: 24,
  },
  detailFrom: {
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
    marginTop: 28,
    marginBottom: 10,
  },
  detailBody: {
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
    lineHeight: 22,
  },
  rewardArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  rewardButton: {
    marginTop: 8,
    backgroundColor: '#f7e6c4',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#7a6854',
  },
  seedBagWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedBagImage: {
    width: 60,
    height: 60,
  },
  seedBagLabelWrapper: {
    position: 'absolute',
    left: -8,
    right: 0,
    top: 2,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedBagLabel: {
    fontFamily: 'Gaegu-Bold',
    fontSize: 16,
    color: '#7a6854',
    textAlign: 'center',
  },
  rewardButtonText: {
    fontFamily: 'Gaegu-Bold',
    color: '#7a6854',
    fontSize: detailContentFontSize,
    textAlign: 'center',
  },
  rewardClaimed: {
    marginTop: 20,
    fontFamily: 'Gaegu-Bold',
    color: '#A1887F',
    fontSize: detailContentFontSize,
    textAlign: 'center',
  },
});
