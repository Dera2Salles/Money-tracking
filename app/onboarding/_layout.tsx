import { Stack } from 'expo-router';
import { OnboardingQuizProvider } from '@/contexts/OnboardingQuizContext';

export default function OnboardingLayout() {
  return (
    <OnboardingQuizProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      />
    </OnboardingQuizProvider>
  );
}
