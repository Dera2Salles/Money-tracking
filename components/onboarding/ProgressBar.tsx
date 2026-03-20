import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(step / totalSteps, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [step, totalSteps]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="h-1.5 rounded-full bg-bg-raised overflow-hidden mb-6">
      <Animated.View
        className="h-full rounded-full"
        style={[
          { backgroundColor: theme.colors.primary },
          animatedStyle,
        ]}
      />
    </View>
  );
}
