import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

// ─── Shared types ───────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

// compact = true → min-h-[40px] rounded-xl px-4 text-ui-md  (modal footers)
// compact = false → min-h-[54px] rounded-2xl px-6 text-ui-lg (full-width CTAs)

// ─── Primary Button ─────────────────────────────────────────────────────────

export function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  compact = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .enabled(!disabled && !isLoading)
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 18, stiffness: 350 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 220 });
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)();
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        className={cn(
          'bg-brand flex-row items-center justify-center gap-2',
          compact ? 'min-h-[40px] rounded-xl px-4' : 'min-h-[54px] rounded-2xl px-6',
          (disabled || isLoading) && 'opacity-50',
          className,
        )}
        style={animStyle}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            {icon}
            <Text className={`font-ui ${compact ? 'text-ui-md' : 'text-ui-lg'}`} style={{ color: '#FFFFFF' }}>{label}</Text>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Secondary Button ───────────────────────────────────────────────────────

export function SecondaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  compact = false,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const tap = Gesture.Tap()
    .enabled(!disabled && !isLoading)
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
      opacity.value = withSpring(0.7);
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 14 });
      opacity.value = withSpring(1);
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)();
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        className={cn(
          'bg-bg-raised flex-row items-center justify-center gap-2',
          compact ? 'min-h-[40px] rounded-xl px-4' : 'min-h-[54px] rounded-2xl px-6',
          (disabled || isLoading) && 'opacity-50',
          className,
        )}
        style={animStyle}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            {icon}
            <Text className={`font-ui text-content-primary ${compact ? 'text-ui-md' : 'text-ui-lg'}`}>{label}</Text>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Ghost Button ───────────────────────────────────────────────────────────

export function GhostButton({
  label,
  onPress,
  disabled = false,
  className = '',
  icon,
  compact = false,
}: Omit<ButtonProps, 'isLoading'>) {
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 14 });
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)();
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        className={cn(
          'flex-row items-center justify-center gap-2',
          compact ? 'min-h-[36px] rounded-lg px-3' : 'min-h-[44px] rounded-2xl px-4',
          disabled && 'opacity-50',
          className,
        )}
        style={animStyle}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {icon}
        <Text className={`font-ui text-brand ${compact ? 'text-ui-sm' : 'text-ui-md'}`}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Danger Button ──────────────────────────────────────────────────────────

export function DangerButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  compact = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .enabled(!disabled && !isLoading)
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 18, stiffness: 350 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 220 });
    })
    .onEnd(() => {
      runOnJS(Haptics.notificationAsync)(
        Haptics.NotificationFeedbackType.Warning
      );
      runOnJS(onPress)();
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        className={cn(
          'bg-error-soft flex-row items-center justify-center gap-2',
          compact ? 'min-h-[40px] rounded-xl px-4' : 'min-h-[54px] rounded-2xl px-6',
          (disabled || isLoading) && 'opacity-50',
          className,
        )}
        style={animStyle}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            {icon}
            <Text className={`font-ui text-error ${compact ? 'text-ui-md' : 'text-ui-lg'}`}>{label}</Text>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
