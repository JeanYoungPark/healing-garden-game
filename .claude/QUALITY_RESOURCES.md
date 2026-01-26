# 🎨 Healing Garden - 퀄리티 향상 리소스 가이드

프로젝트의 완성도를 높이기 위한 필수 리소스 및 구현 가이드

---

## 📦 이미 설치된 패키지
```json
✅ react-native-reanimated (애니메이션)
✅ expo-linear-gradient (그라데이션 배경)
✅ expo-av (사운드)
✅ zustand (상태 관리)
✅ @react-native-async-storage/async-storage (로컬 저장)
```

---

## 🎬 1. 자연스러운 애니메이션 (최우선)

### A. 필수 애니메이션 패키지 설정

**react-native-reanimated 설정**
```javascript
// babel.config.js 수정 필요
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // 추가!
  };
};
```

### B. 애니메이션 가이드라인

#### 타이밍 기준 (힐링 게임 최적화)
```typescript
// src/utils/animations.ts
export const ANIMATION_DURATIONS = {
  // 부드러운 기본 전환
  quick: 300,      // 0.3s - 터치 피드백
  normal: 500,     // 0.5s - 일반 전환
  slow: 800,       // 0.8s - 강조 효과

  // 자연 현상 시뮬레이션
  breathe: 2000,   // 2s - 식물 "숨쉬기"
  sway: 3000,      // 3s - 바람에 흔들림
  grow: 1200,      // 1.2s - 성장 연출
};
```

### C. Lottie 애니메이션 (추천)

```bash
# Lottie 설치
npm install lottie-react-native
npx expo install lottie-react-native
```

**무료 애니메이션 리소스**:
- **LottieFiles**: https://lottiefiles.com
  - 검색어: "plant growing", "water drop", "sparkle", "coins"
  - JSON 다운로드 후 `src/assets/animations/` 에 저장

**사용 예시**:
```typescript
import LottieView from 'lottie-react-native';

<LottieView
  source={require('./assets/animations/water-drop.json')}
  autoPlay
  loop={false}
  style={{ width: 100, height: 100 }}
/>
```

---

## 🎨 2. 비주얼 리소스

### A. 식물 이미지

**필요한 리소스**:
```
src/assets/images/plants/
├── rose/
│   ├── stage_0.png  (씨앗)
│   ├── stage_1.png  (새싹)
│   ├── stage_2.png  (성장)
│   └── stage_3.png  (개화)
├── sunflower/
└── tulip/

권장 사이즈: 256x256px
형식: PNG (투명 배경)
스타일: 파스텔 톤, 부드러운 윤곽선
```

**무료 리소스**:
1. **Freepik** (https://www.freepik.com) - "cute plant illustration"
2. **Flaticon** (https://www.flaticon.com) - 심플한 아이콘
3. **Canva** (https://www.canva.com) - 템플릿 활용

### B. UI 아이콘

```bash
# Expo Vector Icons (이미 포함)
npx expo install @expo/vector-icons
```

**사용 예시**:
```typescript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="water" size={24} color="#81C784" />
```

---

## 🎵 3. 사운드 디자인

### A. 필요한 효과음

```
src/assets/sounds/
├── sfx/
│   ├── plant.mp3       (씨앗 심기)
│   ├── water.mp3       (물주기)
│   ├── harvest.mp3     (수확)
│   └── coin.mp3        (골드)
└── bgm/
    └── calm.mp3        (배경음악)
```

### B. 무료 사운드 리소스

**효과음**:
1. **Freesound** (https://freesound.org) - CC0 라이선스
2. **Zapsplat** (https://www.zapsplat.com) - 게임 효과음
3. **Pixabay** (https://pixabay.com/sound-effects)

**배경음악**:
1. **Incompetech** (https://incompetech.com) - "Calm", "Ambient"
2. **YouTube Audio Library** - 무료 사용 가능

### C. expo-av 사용 예시

```typescript
import { Audio } from 'expo-av';

// 효과음 재생
const { sound } = await Audio.Sound.createAsync(
  require('./assets/sounds/water.mp3')
);
await sound.playAsync();

// 배경음악 (루프)
const { sound: bgm } = await Audio.Sound.createAsync(
  require('./assets/sounds/calm.mp3'),
  { shouldPlay: true, isLooping: true, volume: 0.2 }
);
```

---

## 🎨 4. 색상 팔레트

```typescript
// src/utils/colors.ts
export const COLORS = {
  // 배경
  background: '#F5F9F5',
  grass: '#C8E6C9',
  soil: '#D7CCC8',

  // UI
  primary: '#81C784',
  primaryLight: '#A5D6A7',

  // 텍스트
  text: '#5D4037',

  // 강조
  gold: '#FFC107',
  accent: '#FFE082',
};
```

---

## 🎮 5. UX 향상

### A. 햅틱 피드백

```bash
npx expo install expo-haptics
```

```typescript
import * as Haptics from 'expo-haptics';

// 가벼운 진동
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

### B. 알림

```bash
npx expo install expo-notifications
```

```typescript
import * as Notifications from 'expo-notifications';

// 3시간 후 알림
await Notifications.scheduleNotificationAsync({
  content: {
    title: "🌱 물 줄 시간이에요",
    body: "정원을 방문해주세요!",
  },
  trigger: { seconds: 60 * 60 * 3 },
});
```

---

## ✅ Phase별 우선순위

### Phase 1 (프로토타입)
```
필수:
  ✅ 기본 색상 팔레트
  ✅ 이모지로 임시 식물

선택:
  - 간단한 페이드 애니메이션
```

### Phase 2 (핵심 기능)
```
필수:
  - 식물 이미지 3종
  - 효과음 5개
  - 성장 애니메이션
```

### Phase 3 (완성도)
```
필수:
  - Lottie 애니메이션
  - 배경음악
  - 커스텀 폰트
  - 햅틱 피드백
```

---

## 🎯 바로 시작하기

### 1. babel.config.js 설정
```bash
# reanimated 플러그인 활성화
```

### 2. 임시 리소스로 MVP
```typescript
const PLANT_EMOJIS = {
  rose: ['🌱', '🌿', '🥀', '🌹'],
  sunflower: ['🌱', '🌿', '🌾', '🌻'],
  tulip: ['🌱', '🌿', '🌷', '🌷'],
};
```

### 3. LottieFiles에서 애니메이션 다운로드
- 검색: "water drop", "sparkle", "plant growing"
- JSON 파일 다운로드
- `src/assets/animations/` 에 저장

---

**작성일**: 2026-01-26
