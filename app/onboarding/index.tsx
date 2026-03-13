import { useEffect, useState, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useTheme } from '@/contexts';
import { usePostHog } from 'posthog-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FLOATING_EMOJIS = ['💰', '📊', '🎯', '✨', '🏦', '💎'];
const APP_NAME = 'Mitsitsy';

function FloatingParticle({ emoji, index }: { emoji: string; index: number }) {
  const startX = useMemo(() => Math.random() * (SCREEN_WIDTH - 40), []);
  const startY = useMemo(() => Math.random() * (SCREEN_HEIGHT * 0.6) + SCREEN_HEIGHT * 0.1, []);
  const floatY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const drift = 15 + Math.random() * 10;
    const duration = 2500 + Math.random() * 1500;

    opacity.value = withDelay(
      index * 200 + 200,
      withTiming(0.15 + Math.random() * 0.1, { duration: 800 })
    );

    floatY.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(-drift, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(drift, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: startX,
    top: startY,
    opacity: opacity.value,
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View style={style}>
      <Text className="text-2xl">{emoji}</Text>
    </Animated.View>
  );
}

function AnimatedLetter({ letter, index, color }: { letter: string; index: number; color: string }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    const delay = 100 + index * 80;

    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 8, stiffness: 120 })
    );
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 8, stiffness: 120 })
    );
  }, []);

  const letterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.Text
      style={[
        letterStyle,
        {
          fontSize: 48,
          fontWeight: '800',
          color,
          letterSpacing: -1,
        },
      ]}
    >
      {letter}
    </Animated.Text>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const posthog = usePostHog();

  // Stagger text lines
  const line1Opacity = useSharedValue(0);
  const line1Y = useSharedValue(24);
  const line2Opacity = useSharedValue(0);
  const line2Y = useSharedValue(24);
  // CTA button
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(24);

  useEffect(() => {
    const anim = (delay: number) => ({
      opacity: withDelay(delay, withTiming(1, { duration: 500 })),
      y: withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })),
    });

    // Title text appears after name animation finishes (~800ms)
    const l1 = anim(900);
    line1Opacity.value = l1.opacity;
    line1Y.value = l1.y;

    const l2 = anim(1100);
    line2Opacity.value = l2.opacity;
    line2Y.value = l2.y;

    // CTA appears last
    ctaOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }));
    ctaY.value = withDelay(1400, withSpring(0, { damping: 12, stiffness: 100 }));

    const timer = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const line1Style = useAnimatedStyle(() => ({
    opacity: line1Opacity.value,
    transform: [{ translateY: line1Y.value }],
  }));
  const line2Style = useAnimatedStyle(() => ({
    opacity: line2Opacity.value,
    transform: [{ translateY: line2Y.value }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  return (
    <View
      className="flex-1 bg-background-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      {/* Floating ambient particles */}
      <View className="absolute inset-0" pointerEvents="none">
        {FLOATING_EMOJIS.map((emoji, i) => (
          <FloatingParticle key={i} emoji={emoji} index={i} />
        ))}
      </View>

      <Box className="flex-1 p-6 justify-center">
        <VStack className="items-center" space="xl">
          {/* App name — letter-by-letter bounce animation */}
          <View className="flex-row">
            {APP_NAME.split('').map((letter, i) => (
              <AnimatedLetter
                key={i}
                letter={letter}
                index={i}
                color={theme.colors.primary}
              />
            ))}
          </View>

          {/* Staggered text */}
          <VStack className="items-center" space="sm">
            <Animated.View style={line1Style}>
              <Text className="text-typography-900 text-center text-xl font-semibold leading-7">
                {t('welcome.title')}
              </Text>
            </Animated.View>

            <Animated.View style={line2Style}>
              <Text className="text-typography-500 text-center text-base mt-2">
                {t('welcome.subtitle')}
              </Text>
            </Animated.View>
          </VStack>
        </VStack>
      </Box>

      {/* CTA */}
      <Animated.View style={[{ paddingHorizontal: 24 }, ctaStyle]}>
        <Button
          size="xl"
          className="w-full"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            posthog.capture('onboarding_started');
            router.push('/onboarding/quiz-1');
          }}
          isDisabled={!ready}
        >
          <ButtonText className="text-white">{t('welcome.cta')}</ButtonText>
        </Button>
      </Animated.View>
    </View>
  );
}
