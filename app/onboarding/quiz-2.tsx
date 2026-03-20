import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text as RNText } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EaseView } from 'react-native-ease';
import { SpeechBubble } from '@/components/onboarding/SpeechBubble';
import { usePostHog } from 'posthog-react-native';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { QuizOptionCard } from '@/components/onboarding/QuizOptionCard';
import { useOnboardingQuiz, type DurationAnswer } from '@/contexts/OnboardingQuizContext';

const OPTIONS: { key: DurationAnswer; emoji: string }[] = [
  { key: 'few_months', emoji: '📅' },
  { key: 'more_than_year', emoji: '📆' },
  { key: 'always', emoji: '♾️' },
];

export default function QuizQ2Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { duration, setDuration } = useOnboardingQuiz();
  const [selected, setSelected] = useState<DurationAnswer | null>(duration);
  const posthog = usePostHog();

  const handleSelect = (key: DurationAnswer) => {
    setSelected(key);
    setDuration(key);
    posthog.capture('onboarding_quiz_answered', { question: 2, answer: key });
    setTimeout(() => router.push('/onboarding/quiz-3'), 300);
  };

  return (
    <View
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 px-6 py-6">
        <ProgressBar step={2} totalSteps={8} />

        <View className="gap-4 mb-8">
          <RNText className="font-body-regular text-body-sm text-content-tertiary">
            {t('quiz.questionLabel')} 2/3
          </RNText>
          <RNText className="font-display text-display-lg text-content-primary">
            {t('quiz.q2Title')}
          </RNText>
        </View>

        <EaseView
          className="items-center mb-4"
          initialAnimate={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, easing: 'easeOut' }}
        >
          <SpeechBubble text={t('quiz.q2Subtitle')} />
          <Image
            source={require('@/assets/images/bubule-time.png')}
            style={{ width: 260, height: 260, alignSelf: 'center' }}
            contentFit="contain"
          />
        </EaseView>

        <View className="gap-4 flex-1">
          {OPTIONS.map((option, index) => (
            <QuizOptionCard
              key={option.key}
              label={t(`quiz.q2_${option.key}`)}
              emoji={option.emoji}
              isSelected={selected === option.key}
              onPress={() => handleSelect(option.key)}
              index={index}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
