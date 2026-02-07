// 🌱 Healing Garden - Mailbox Modal

import React, { useState } from 'react';
import { StyleSheet, View, Image, Modal, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { calcBackgroundSize, calcElementSize } from '../utils/responsive';

// 배경 크기 계산 (mailbox-bg: 1136 x 1437)
const { bgWidth, bgHeight } = calcBackgroundSize(1136, 1437);

// 우편 아이템 크기 계산 (mail-item: 869 x 254)
const { width: mailItemWidth, height: mailItemHeight } = calcElementSize(bgWidth, 0.75, 869, 254);

// 새 메일 뱃지 크기 계산 (mail-new-badge: 47 x 48)
const { width: badgeWidth, height: badgeHeight } = calcElementSize(mailItemWidth, 0.08, 47, 48);

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
}

// 텍스트 크기 계산 (아이템 높이 기준)
const titleFontSize = mailItemHeight * 0.22;
const dateFontSize = mailItemHeight * 0.16;

// 모달 제목 크기 계산 (배경 높이 기준)
const modalTitleFontSize = bgHeight * 0.06;

// 편지 상세 배경 크기 계산 (mail-detail-bg: 994 x 1344)
const { bgWidth: detailBgWidth, bgHeight: detailBgHeight } = calcBackgroundSize(994, 1344);

// 편지 상세 텍스트 크기 계산
const detailTitleFontSize = detailBgHeight * 0.03;
const detailFromFontSize = detailBgHeight * 0.025;
const detailContentFontSize = detailBgHeight * 0.028;

// 메일 아이템 타입
interface MailItem {
  id: number;
  title: string;
  from: string;
  isNew: boolean;
  content?: string;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({ visible, onClose }) => {
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);

  // 임시 우편 데이터
  const mailItems: MailItem[] = [
    { id: 0, title: '환영 선물이 도착했어요!', from: '정원지기', isNew: true, content: '정원에 오신 것을 환영해요!\n작은 선물을 준비했어요.\n앞으로 함께 예쁜 정원을 가꿔봐요!' },
    { id: 1, title: '오늘의 출석 보상', from: '행운의 요정', isNew: true, content: '오늘도 정원에 와줘서 고마워요!\n매일 방문하면 특별한 선물이 있을지도...?' },
    { id: 2, title: '주간 미션 완료 보상', from: '부지런한 벌', isNew: false, content: '이번 주도 열심히 미션을 완료했네요!\n당신의 노력에 박수를 보내요!' },
    { id: 3, title: '따뜻한 선물을 보내요', from: '카피바라', isNew: false, content: '오늘 하루도 수고했어요.\n잠시 쉬어가도 괜찮아요.\n카피바라가 응원할게요!' },
    { id: 4, title: '이벤트 참여 감사 선물', from: '무지개 나비', isNew: false, content: '이벤트에 참여해줘서 고마워요!\n무지개처럼 행복한 하루 보내세요!' },
  ];

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
                  {mailItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.mailItemWrapper, { marginBottom: mailItemMargin }]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedMail(item)}
                    >
                      <Image
                        source={require('../assets/garden/props/mail-item.png')}
                        style={[styles.mailItem, { width: mailItemWidth, height: mailItemHeight }]}
                        resizeMode="contain"
                      />
                      {/* 우편 내용 */}
                      <View style={styles.mailContent}>
                        <Text style={[styles.mailTitle, { fontSize: titleFontSize }]} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                        <Text style={[styles.mailFrom, { fontSize: dateFontSize }]}>from. {item.from}</Text>
                      </View>
                      {/* 새 메일 뱃지 */}
                      {item.isNew && (
                        <Image
                          source={require('../assets/garden/props/mail-new-badge.png')}
                          style={[styles.newBadge, { width: badgeWidth, height: badgeHeight }]}
                          resizeMode="contain"
                        />
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
                  <Text style={[styles.detailFrom, { fontSize: detailFromFontSize }]}>from. {selectedMail.from}</Text>
                  <Text style={[styles.detailBody, { fontSize: detailContentFontSize }]}>{selectedMail.content}</Text>
                </View>
              </ImageBackground>
            </View>

            {/* 닫기 버튼 */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedMail(null)}
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
      )}
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
  mailboxBackground: {
    width: bgWidth,
    height: bgHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute',
    top: '2.6%',
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
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
  mailItem: {},
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
    marginBottom: 8,
  },
  detailFrom: {
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
    marginBottom: 20,
  },
  detailBody: {
    fontFamily: 'Gaegu-Regular',
    color: '#7a6854',
    lineHeight: 28,
  },
});
