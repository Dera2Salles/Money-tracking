import React, { useEffect } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts';
import { cn } from '@/lib/utils';

/**
 * Premium Input — focus border animation + error shake.
 * Uses bg-bg-raised surface, border only on focus/error.
 */
interface PremiumInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function PremiumInput({
  label,
  error,
  className = '',
  inputClassName = '',
  leftSlot,
  rightSlot,
  onFocus,
  onBlur,
  ...textInputProps
}: PremiumInputProps) {
  const { theme } = useTheme();
  const focused = useSharedValue(0);
  const shake = useSharedValue(0);

  // Use the theme's actual brand hex for interpolation
  const restColor = 'transparent';
  const focusColor = theme.colors.primary;

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focused.value,
      [0, 1],
      [restColor, focusColor]
    ),
    borderWidth: 1.5,
  }));

  // Error shake animation
  useEffect(() => {
    if (error) {
      shake.value = withSequence(
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(-4, { duration: 60 }),
        withTiming(4, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [error, shake]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Animated.View
      className={cn('rounded-xl bg-bg-raised overflow-hidden', className)}
      style={[borderStyle, shakeStyle]}
    >
      {label && (
        <View className="px-4 pt-3">
          <Text className="font-ui text-ui-xs text-content-tertiary uppercase tracking-widest">
            {label}
          </Text>
        </View>
      )}
      <View className="flex-row items-center px-4">
        {leftSlot && <View className="mr-2">{leftSlot}</View>}
        <TextInput
          className={cn(
            'flex-1 font-body-regular text-body-lg text-content-primary py-3',
            !label && 'py-4',
            inputClassName,
          )}
          placeholderTextColor="#9C9CA8"
          onFocus={(e) => {
            focused.value = withTiming(1, { duration: 200 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focused.value = withTiming(0, { duration: 200 });
            onBlur?.(e);
          }}
          {...textInputProps}
        />
        {rightSlot && <View className="ml-2">{rightSlot}</View>}
      </View>
      {error && (
        <Text className="font-body-regular text-body-sm text-error px-4 pb-2">
          {error}
        </Text>
      )}
    </Animated.View>
  );
}
