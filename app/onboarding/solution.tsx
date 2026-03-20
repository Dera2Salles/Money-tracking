import { useEffect } from 'react';
import { View, Text as RNText } from 'react-native';
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
import { Image } from 'expo-image';
import { EaseView } from 'react-native-ease';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { SpeechBubble } from '@/components/onboarding/SpeechBubble';
import { useOnboardingQuiz } from '@/contexts/OnboardingQuizContext';
import { useTheme } from '@/contexts';
import { PrimaryButton } from '@/components/premium';

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
      <View className="p-4 rounded-xl bg-bg-surface flex-row gap-3" style={{ backgroundColor: cardBg }}>
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View className="flex-1 gap-1">
          <RNText className="font-ui text-content-primary">{t(titleKey)}</RNText>
          <RNText className="text-body-sm text-content-secondary">{t(descKey)}</RNText>
        </View>
      </View>
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

  const benefits = BENEFIT_MAP[frustration || 'dont_know_where'];

  return (
    <View
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 p-6">
        <ProgressBar step={5} totalSteps={8} />

        <View className="gap-3 mb-8">
          <RNText className="text-display-xl font-display text-content-primary">
            {t('solution.title')}
          </RNText>
        </View>

        <EaseView
          className="items-center mb-4"
          initialAnimate={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, easing: 'easeOut' }}
        >
          <SpeechBubble text={t('solution.subtitle')} />
          <Image
            source={require('@/assets/images/bubule-help.png')}
            style={{ width: 260, height: 260, alignSelf: 'center' }}
            contentFit="contain"
          />
        </EaseView>

        <View className="gap-3 flex-1">
          {benefits.map((benefit, index) => (
            <BenefitTile
              key={benefit.titleKey}
              icon={benefit.icon}
              titleKey={benefit.titleKey}
              descKey={benefit.descKey}
              index={index}
              color={theme.colors.primary}
              cardBg="transparent"
            />
          ))}
        </View>

        <PrimaryButton
          label={t('solution.cta')}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/wow');
          }}
        />
      </View>
    </View>
  );
}
