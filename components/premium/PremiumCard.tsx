import React from 'react';
import { View, Pressable, Platform, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

/**
 * Premium Card — depth through tonal surface only, no border, no shadow.
 *
 * The card is visible because bg-bg-surface is slightly lighter than bg-bg-base.
 * That tonal difference IS the depth. No shadow needed.
 * Corners: rounded-xl (12px) — subtle, not bubbly.
 */
interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function PremiumCard({ children, className = '', style }: PremiumCardProps) {
  return (
    <View
      className={cn('rounded-xl bg-bg-surface', className)}
      style={style}
    >
      {children}
    </View>
  );
}

/**
 * Pressable Card — spring scale on press + haptic feedback.
 * No shadow, no border. Depth from tone only.
 */
interface PressableCardProps {
  children: React.ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
}

export function PressableCard({
  children,
  onPress,
  onLongPress,
  className = '',
  disabled = false,
}: PressableCardProps) {
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15 });
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)();
    });

  const longPress = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(onLongPress)();
      }
    });

  const gesture = onLongPress
    ? Gesture.Race(tap, longPress)
    : tap;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={cn(
          'rounded-xl bg-bg-surface',
          disabled && 'opacity-50',
          className,
        )}
        style={animStyle}
        accessibilityRole="button"
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
