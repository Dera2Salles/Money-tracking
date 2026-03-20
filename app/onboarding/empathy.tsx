import { useEffect, useState } from 'react';
import { View, Dimensions, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { SpeechBubble } from '@/components/onboarding/SpeechBubble';
import { useOnboardingQuiz } from '@/contexts/OnboardingQuizContext';
import { useTheme } from '@/contexts';
import { PrimaryButton } from '@/components/premium';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_MAX = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.5;

export default function EmpathyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { frustration, duration, goal } = useOnboardingQuiz();
  const [analyzing, setAnalyzing] = useState(true);

  const pulseScale = useSharedValue(1);
  const circleScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const line1Y = useSharedValue(20);
  const line2Y = useSharedValue(20);
  const line3Y = useSharedValue(20);
  const line4Y = useSharedValue(20);
  const ctaY = useSharedValue(20);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      3,
      true
    );

    const timer = setTimeout(() => {
      setAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Expanding circle reveal
      circleScale.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });

      // Staggered content entrance
      const fadeIn = (delay: number) => ({
        opacity: withDelay(delay, withTiming(1, { duration: 400 })),
        y: withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })),
      });

      contentOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
      const l1 = fadeIn(400);
      line1Y.value = l1.y;
      const l2 = fadeIn(600);
      line2Y.value = l2.y;
      const l3 = fadeIn(800);
      line3Y.value = l3.y;
      const l4 = fadeIn(1000);
      line4Y.value = l4.y;
      const cta = fadeIn(1200);
      ctaY.value = cta.y;
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    width: CIRCLE_MAX,
    height: CIRCLE_MAX,
    borderRadius: CIRCLE_MAX / 2,
    transform: [{ scale: circleScale.value }],
    opacity: circleScale.value > 0 ? 1 : 0,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const line1Style = useAnimatedStyle(() => ({
    opacity: line1Y.value === 20 ? 0 : 1,
    transform: [{ translateY: line1Y.value }],
  }));
  const line2Style = useAnimatedStyle(() => ({
    opacity: line2Y.value === 20 ? 0 : 1,
    transform: [{ translateY: line2Y.value }],
  }));
  const line3Style = useAnimatedStyle(() => ({
    opacity: line3Y.value === 20 ? 0 : 1,
    transform: [{ translateY: line3Y.value }],
  }));
  const line4Style = useAnimatedStyle(() => ({
    opacity: line4Y.value === 20 ? 0 : 1,
    transform: [{ translateY: line4Y.value }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaY.value === 20 ? 0 : 1,
    transform: [{ translateY: ctaY.value }],
  }));

  const getHeadlineKey = () => {
    if (!frustration) return 'empathy.headlineDefault';
    return `empathy.headline_${frustration}`;
  };

  const getPersonalizedMessage = () => {
    const durationText = duration ? t(`empathy.duration_${duration}`) : '';
    const goalText = goal ? t(`empathy.goal_${goal}`) : '';

    if (durationText && goalText) {
      return t('empathy.personalizedMessage', { duration: durationText, goal: goalText });
    }
    return t('empathy.message');
  };

  const getStatKey = () => {
    if (!frustration) return 'empathy.statDefault';
    return `empathy.stat_${frustration}`;
  };

  return (
    <View
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 p-6">
        <ProgressBar step={4} totalSteps={8} />

        {analyzing ? (
          <View className="flex-1 justify-center items-center gap-4">
            <Animated.View style={pulseStyle} className="items-center">
              <SpeechBubble text={t('empathy.searchSpeech')} />
              <Image
                source={require('@/assets/images/bubule-search.png')}
                style={{ width: 260, height: 260, alignSelf: 'center' }}
                contentFit="contain"
              />
            </Animated.View>
            <RNText className="text-center text-display-lg font-display text-content-primary">
              {t('empathy.analyzing')}
            </RNText>
            <RNText className="text-center text-content-secondary text-body-md">
              {t('empathy.analyzingSubtitle')}
            </RNText>
          </View>
        ) : (
          <View className="flex-1">
            {/* Expanding circle background */}
            <View className="absolute inset-0 items-center justify-center overflow-hidden">
              <Animated.View
                style={[
                  circleStyle,
                  { backgroundColor: theme.colors.primary + '08' },
                ]}
              />
            </View>

            {/* Content */}
            <Animated.View style={[{ flex: 1 }, contentStyle]}>
              <View className="flex-1 justify-center gap-6">
                <Animated.View style={line1Style}>
                  <RNText className="text-center text-display-xl font-display text-content-primary">
                    {t(getHeadlineKey())}
                  </RNText>
                </Animated.View>

                <Animated.View style={line2Style}>
                  <View
                    className="p-5 rounded-xl bg-bg-surface"
                    style={{ backgroundColor: theme.colors.primary + '15' }}
                  >
                    <RNText
                      className="text-center text-body-lg leading-6 font-ui"
                      style={{ color: theme.colors.primary }}
                    >
                      {t(getStatKey())}
                    </RNText>
                  </View>
                </Animated.View>

                <Animated.View style={line3Style} className="items-center">
                  <SpeechBubble text={t('empathy.resultSpeech')} />
                  <Image
                    source={require('@/assets/images/bubule-motivation.png')}
                    style={{ width: 260, height: 260, alignSelf: 'center' }}
                    contentFit="contain"
                  />
                </Animated.View>

                <Animated.View style={line4Style}>
                  <RNText className="text-center text-content-secondary text-body-md leading-6">
                    {getPersonalizedMessage()}
                  </RNText>
                </Animated.View>
              </View>

              <Animated.View style={ctaStyle}>
                <PrimaryButton
                  label={t('empathy.cta')}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/onboarding/solution');
                  }}
                />
              </Animated.View>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}
