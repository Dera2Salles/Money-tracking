import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text as RNText, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EaseView } from "react-native-ease";
import { SpeechBubble } from "@/components/onboarding/SpeechBubble";
import { usePostHog } from "posthog-react-native";
import { useTranslation } from "react-i18next";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { QuizOptionCard } from "@/components/onboarding/QuizOptionCard";
import {
  useOnboardingQuiz,
  type GoalAnswer,
} from "@/contexts/OnboardingQuizContext";

const OPTIONS: { key: GoalAnswer; emoji: string }[] = [
  { key: "less_stress", emoji: "😌" },
  { key: "reach_goals", emoji: "🎯" },
  { key: "feel_free", emoji: "🕊️" },
  { key: "enjoy_life", emoji: "🌟" },
];

export default function QuizQ3Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { goal, setGoal } = useOnboardingQuiz();
  const [selected, setSelected] = useState<GoalAnswer | null>(goal);
  const posthog = usePostHog();

  const handleSelect = (key: GoalAnswer) => {
    setSelected(key);
    setGoal(key);
    posthog.capture("onboarding_quiz_answered", { question: 3, answer: key });
    setTimeout(() => router.replace("/onboarding/empathy"), 300);
  };

  return (
    <ScrollView
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 px-6 py-6 relative">
        <ProgressBar step={3} totalSteps={8} />

        <View className="gap-4 mb-2">
          <RNText className="font-body-regular text-body-sm text-content-tertiary">
            {t("quiz.questionLabel")} 3/3
          </RNText>
          <RNText className="font-display text-display-lg text-content-primary">
            {t("quiz.q3Title")}
          </RNText>
        </View>

        <EaseView
          className="items-center mb-0"
          initialAnimate={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, easing: "easeOut" }}
          style={{ position: "relative" }}
        >
          <Image
            source={require("@/assets/images/bubule-smile.png")}
            style={{ width: 400, height: 400, alignSelf: "center" }}
            contentFit="contain"
          />
          <SpeechBubble text={t("quiz.q3Subtitle")} />
        </EaseView>

        <View className="gap-3 flex-1 bottom-14">
          {OPTIONS.map((option, index) => (
            <QuizOptionCard
              key={option.key}
              label={t(`quiz.q3_${option.key}`)}
              emoji={option.emoji}
              isSelected={selected === option.key}
              onPress={() => handleSelect(option.key)}
              index={index}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
