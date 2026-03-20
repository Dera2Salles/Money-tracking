import { useEffect, useState, useMemo } from 'react';
import { View, Dimensions, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
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
import { useTheme } from '@/contexts';
import { SpeechBubble } from '@/components/onboarding/SpeechBubble';
import { usePostHog } from 'posthog-react-native';
import { PrimaryButton } from '@/components/premium';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FLOATING_EMOJIS = ['💰', '📊', '🎯', '✨', '🏦', '💎'];

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
      <RNText className="text-2xl">{emoji}</RNText>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const posthog = usePostHog();

  // Logo
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
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

    // Logo fade + scale in
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 120 }));

    // Title text appears after logo animation
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

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
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
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      {/* Floating ambient particles */}
      <View className="absolute inset-0" pointerEvents="none">
        {FLOATING_EMOJIS.map((emoji, i) => (
          <FloatingParticle key={i} emoji={emoji} index={i} />
        ))}
      </View>

      <View className="flex-1 p-6 justify-center">
        <View className="items-center gap-6">
          {/* App logo + speech bubble */}
          <Animated.View style={logoStyle} className="items-center">
            <SpeechBubble text={t('welcome.speechBubble')} />
            <Image
              source={require('@/assets/images/bubble-hello.png')}
              style={{ width: 350, height: 350, alignSelf: 'center' }}
              contentFit="contain"
            />
          </Animated.View>

          {/* Staggered text */}
          <View className="items-center gap-2">
            <Animated.View style={line1Style}>
              <RNText className="text-content-primary text-center text-display-md font-display leading-7">
                {t('welcome.title')}
              </RNText>
            </Animated.View>

            <Animated.View style={line2Style}>
              <RNText className="text-content-secondary text-center text-body-lg mt-2">
                {t('welcome.subtitle')}
              </RNText>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* CTA */}
      <Animated.View style={[{ paddingHorizontal: 24 }, ctaStyle]}>
        <PrimaryButton
          label={t('welcome.cta')}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            posthog.capture('onboarding_started');
            router.push('/onboarding/quiz-1');
          }}
          disabled={!ready}
        />
      </Animated.View>
    </View>
  );
}
