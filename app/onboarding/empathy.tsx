import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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

export default function EmpathyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { frustration, duration } = useOnboardingQuiz();
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  const colors = getDarkModeColors(isDark);
  const [analyzing, setAnalyzing] = useState(true);

  // Analyzing animation
  const pulseScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    // Pulse animation during analysis
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      3,
      true
    );

    // Show content after 1.8s analysis
    const timer = setTimeout(() => {
      setAnalyzing(false);
      contentOpacity.value = withTiming(1, { duration: 500 });
      contentTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const getHeadlineKey = () => {
    if (!frustration) return 'empathy.headlineDefault';
    return `empathy.headline_${frustration}`;
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
        <ProgressBar step={4} totalSteps={9} />

        {analyzing ? (
          <VStack className="flex-1 justify-center items-center" space="lg">
            <Animated.View style={pulseStyle}>
              <Text style={styles.analyzeEmoji}>🔍</Text>
            </Animated.View>
            <Heading size="lg" className="text-center text-typography-900">
              {t('empathy.analyzing')}
            </Heading>
            <Text className="text-center text-typography-500">
              {t('empathy.analyzingSubtitle')}
            </Text>
          </VStack>
        ) : (
          <Animated.View style={[{ flex: 1 }, contentStyle]}>
            <VStack className="flex-1 justify-center" space="xl">
              <VStack space="md" className="items-center">
                <Text style={styles.resultEmoji}>💡</Text>
                <Heading size="xl" className="text-center text-typography-900">
                  {t(getHeadlineKey())}
                </Heading>
              </VStack>

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

              <Text className="text-center text-typography-600 text-base leading-6">
                {t('empathy.message')}
              </Text>
            </VStack>

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
        )}
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  analyzeEmoji: {
    fontSize: 64,
    lineHeight: 80,
    textAlign: 'center',
  },
  resultEmoji: {
    fontSize: 48,
    lineHeight: 64,
    textAlign: 'center',
  },
});
