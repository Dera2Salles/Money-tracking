import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/contexts';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import { getDarkModeColors } from '@/constants/darkMode';
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
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  const colors = getDarkModeColors(isDark);
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
          className="flex-row items-center p-4 rounded-2xl gap-3"
          style={{
            backgroundColor: isSelected ? theme.colors.primaryLight : colors.chipBg,
          }}
        >
          <Text className="text-2xl">{emoji}</Text>
          <Text
            className="text-typography-900 flex-1 text-base"
          >
            {label}
          </Text>
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
