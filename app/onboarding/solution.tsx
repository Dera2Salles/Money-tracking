import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { useOnboardingQuiz } from '@/contexts/OnboardingQuizContext';
import { useTheme } from '@/contexts';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import { getDarkModeColors } from '@/constants/darkMode';

interface BenefitTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  descKey: string;
  index: number;
  color: string;
  cardBg: string;
}

function BenefitTile({ icon, titleKey, descKey, index, color, cardBg }: BenefitTileProps) {
  const { t } = useTranslation();
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 200,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    opacity.value = withDelay(index * 200, withTiming(1, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <HStack
        className="p-4 rounded-2xl"
        style={{ backgroundColor: cardBg }}
        space="md"
      >
        <Box
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </Box>
        <VStack className="flex-1" space="xs">
          <Text className="font-bold text-typography-900">{t(titleKey)}</Text>
          <Text className="text-sm text-typography-600">{t(descKey)}</Text>
        </VStack>
      </HStack>
    </Animated.View>
  );
}

const BENEFIT_MAP: Record<string, { icon: keyof typeof Ionicons.glyphMap; titleKey: string; descKey: string }[]> = {
  dont_know_where: [
    { icon: 'pie-chart', titleKey: 'solution.benefit1_dont_know_where', descKey: 'solution.benefit1Desc_dont_know_where' },
    { icon: 'notifications', titleKey: 'solution.benefit2_dont_know_where', descKey: 'solution.benefit2Desc_dont_know_where' },
    { icon: 'trending-up', titleKey: 'solution.benefit3_dont_know_where', descKey: 'solution.benefit3Desc_dont_know_where' },
  ],
  hard_to_save: [
    { icon: 'wallet', titleKey: 'solution.benefit1_hard_to_save', descKey: 'solution.benefit1Desc_hard_to_save' },
    { icon: 'flag', titleKey: 'solution.benefit2_hard_to_save', descKey: 'solution.benefit2Desc_hard_to_save' },
    { icon: 'analytics', titleKey: 'solution.benefit3_hard_to_save', descKey: 'solution.benefit3Desc_hard_to_save' },
  ],
  stress: [
    { icon: 'shield-checkmark', titleKey: 'solution.benefit1_stress', descKey: 'solution.benefit1Desc_stress' },
    { icon: 'eye', titleKey: 'solution.benefit2_stress', descKey: 'solution.benefit2Desc_stress' },
    { icon: 'heart', titleKey: 'solution.benefit3_stress', descKey: 'solution.benefit3Desc_stress' },
  ],
  plan_better: [
    { icon: 'calendar', titleKey: 'solution.benefit1_plan_better', descKey: 'solution.benefit1Desc_plan_better' },
    { icon: 'list', titleKey: 'solution.benefit2_plan_better', descKey: 'solution.benefit2Desc_plan_better' },
    { icon: 'checkmark-circle', titleKey: 'solution.benefit3_plan_better', descKey: 'solution.benefit3Desc_plan_better' },
  ],
};

export default function SolutionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { frustration } = useOnboardingQuiz();
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  const colors = getDarkModeColors(isDark);

  const benefits = BENEFIT_MAP[frustration || 'dont_know_where'];

  return (
    <View
      className="flex-1 bg-background-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <Box className="flex-1 p-6">
        <ProgressBar step={5} totalSteps={9} />

        <VStack space="md" className="mb-8">
          <Heading size="xl" className="text-typography-900">
            {t('solution.title')}
          </Heading>
          <Text className="text-typography-600">
            {t('solution.subtitle')}
          </Text>
        </VStack>

        <VStack space="md" className="flex-1">
          {benefits.map((benefit, index) => (
            <BenefitTile
              key={benefit.titleKey}
              icon={benefit.icon}
              titleKey={benefit.titleKey}
              descKey={benefit.descKey}
              index={index}
              color={theme.colors.primary}
              cardBg={colors.cardBg}
            />
          ))}
        </VStack>

        <Button
          size="xl"
          className="w-full"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/currency');
          }}
        >
          <ButtonText className="text-white">{t('solution.cta')}</ButtonText>
        </Button>
      </Box>
    </View>
  );
}
