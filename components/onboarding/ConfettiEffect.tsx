import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 24;
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#F97316', '#34D399'];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  rotation: number;
}

function ConfettiParticle({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(particle.x);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 100;
    translateY.value = withDelay(
      particle.delay,
      withTiming(SCREEN_HEIGHT + 50, { duration: 2000 + Math.random() * 1000, easing: Easing.in(Easing.quad) })
    );
    translateX.value = withDelay(
      particle.delay,
      withTiming(particle.x + drift, { duration: 2000 + Math.random() * 1000 })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, { duration: 2000 })
    );
    opacity.value = withDelay(
      particle.delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 4,
          backgroundColor: particle.color,
        },
        style,
      ]}
    />
  );
}

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const particles = useMemo<Particle[]>(() => {
    if (!trigger) return [];
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      color: COLORS[i % COLORS.length],
      size: 8 + Math.random() * 8,
      delay: Math.random() * 400,
      rotation: 360 + Math.random() * 720,
    }));
  }, [trigger]);

  useEffect(() => {
    if (trigger && onComplete) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} particle={p} />
      ))}
    </View>
  );
}
