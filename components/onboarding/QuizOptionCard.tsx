import { useEffect } from 'react';
import { View, Text as RNText } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts';
import { PressableScale } from './PressableScale';

interface QuizOptionCardProps {
  label: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

export function QuizOptionCard({ label, emoji, isSelected, onPress, index }: QuizOptionCardProps) {
  const { theme } = useTheme();
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 100,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
    opacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 400 })
    );
  }, []);

  useEffect(() => {
    checkScale.value = isSelected
      ? withSpring(1, { damping: 12, stiffness: 200 })
      : withTiming(0, { duration: 150 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <PressableScale onPress={onPress} haptic="medium" scaleValue={0.96}>
        <View
          className="flex-row items-center p-4 rounded-2xl gap-3 bg-bg-raised"
          style={isSelected ? { backgroundColor: theme.colors.primary + '15' } : undefined}
        >
          <RNText className="text-2xl">{emoji}</RNText>
          <RNText className="flex-1 font-body-regular text-body-md text-content-primary">
            {label}
          </RNText>
          <Animated.View style={checkStyle}>
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={theme.colors.primary}
            />
          </Animated.View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}
