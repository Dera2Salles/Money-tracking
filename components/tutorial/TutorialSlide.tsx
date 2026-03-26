import { View, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { SlideItemProps } from './types';

export function TutorialSlide({ slide, index, translateX, screenWidth }: SlideItemProps) {
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const scale = interpolate(
      -translateX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      -translateX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );

    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={{ width: screenWidth, flex: 1, justifyContent: 'center' }}>
      <Animated.View style={[{ flex: 1, justifyContent: 'center' }, animatedStyle]}>
        <View className="gap-6 items-center px-6">
          <View
            className="w-28 h-28 rounded-full items-center justify-center"
            style={{ backgroundColor: slide.iconBg }}
          >
            <Ionicons
              name={slide.icon as keyof typeof Ionicons.glyphMap}
              size={64}
              color={slide.iconColor}
            />
          </View>

          <View className="gap-2 items-center">
            <RNText className="font-display text-display-lg text-content-primary text-center">
              {slide.title}
            </RNText>
            <RNText className="font-body-regular text-body-md text-content-secondary text-center px-2">
              {slide.subtitle}
            </RNText>
          </View>

          <View className="gap-3 w-full bg-bg-surface p-5 rounded-2xl">
            {slide.features.map((feature, fIndex) => (
              <View key={fIndex} className="flex-row gap-3 items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={22} color={feature.color} />
                </View>
                <RNText className="font-body-regular text-body-md text-content-secondary flex-1">{feature.text}</RNText>
              </View>
            ))}
          </View>

          {slide.isLast && (
            <View className="bg-bg-surface p-4 rounded-2xl w-full items-center">
              <RNText className="text-4xl mb-2">🎉</RNText>
              <RNText className="font-ui text-ui-md text-content-primary text-center">
                {t('tutorial.finalMessage')}
              </RNText>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
