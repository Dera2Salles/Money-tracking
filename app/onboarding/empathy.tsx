import { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
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
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { useOnboardingQuiz } from '@/contexts/OnboardingQuizContext';
import { useTheme } from '@/contexts';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import { getDarkModeColors } from '@/constants/darkMode';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_MAX = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.5;

export default function EmpathyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { frustration, duration, goal } = useOnboardingQuiz();
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  const colors = getDarkModeColors(isDark);
  const [analyzing, setAnalyzing] = useState(true);

  const pulseScale = useSharedValue(1);
  const circleScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const line1Y = useSharedValue(20);
  const line2Y = useSharedValue(20);
  const line3Y = useSharedValue(20);
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
      const cta = fadeIn(1000);
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
      className="flex-1 bg-background-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <Box className="flex-1 p-6">
        <ProgressBar step={4} totalSteps={8} />

        {analyzing ? (
          <VStack className="flex-1 justify-center items-center" space="lg">
            <Animated.View style={pulseStyle}>
              <Text className="text-6xl text-center leading-[80px]">🔍</Text>
            </Animated.View>
            <Heading size="lg" className="text-center text-typography-900">
              {t('empathy.analyzing')}
            </Heading>
            <Text className="text-center text-typography-500">
              {t('empathy.analyzingSubtitle')}
            </Text>
          </VStack>
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
              <VStack className="flex-1 justify-center" space="xl">
                <Animated.View style={line1Style}>
                  <VStack space="md" className="items-center">
                    <Text className="text-5xl text-center leading-[64px]">💡</Text>
                    <Heading size="xl" className="text-center text-typography-900">
                      {t(getHeadlineKey())}
                    </Heading>
                  </VStack>
                </Animated.View>

                <Animated.View style={line2Style}>
                  <Box
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: theme.colors.primary + '15' }}
                  >
                    <Text
                      className="text-center text-base leading-6"
                      style={{ color: theme.colors.primary }}
                    >
                      {t(getStatKey())}
                    </Text>
                  </Box>
                </Animated.View>

                <Animated.View style={line3Style}>
                  <Text className="text-center text-typography-600 text-base leading-6">
                    {getPersonalizedMessage()}
                  </Text>
                </Animated.View>
              </VStack>

              <Animated.View style={ctaStyle}>
                <Button
                  size="xl"
                  className="w-full"
                  style={{ backgroundColor: theme.colors.primary }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/onboarding/solution');
                  }}
                >
                  <ButtonText className="text-white">{t('empathy.cta')}</ButtonText>
                </Button>
              </Animated.View>
            </Animated.View>
          </View>
        )}
      </Box>
    </View>
  );
}
