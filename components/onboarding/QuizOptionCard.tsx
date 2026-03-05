import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <PressableScale onPress={onPress} haptic="medium" scaleValue={0.96}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: isSelected ? theme.colors.primaryLight : colors.cardBg,
              borderColor: isSelected ? theme.colors.primary : colors.cardBorder,
            },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
          <Text
            className="text-typography-900 flex-1"
            style={styles.label}
          >
            {label}
          </Text>
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
  },
});
