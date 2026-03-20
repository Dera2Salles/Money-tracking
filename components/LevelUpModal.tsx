import { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useTheme } from '@/contexts';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import { buildDesignVars } from '@/components/ui/gluestack-ui-provider/config';
import { PrimaryButton } from '@/components/premium';

interface LevelUpModalProps {
  level: number | null;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const themeId = useSettingsStore((state) => state.themeId);
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (level === null) return;

    scale.value = 0.5;
    opacity.value = 0;

    scale.value = withSpring(1, { damping: 8, mass: 1, overshootClamping: false });
    opacity.value = withTiming(1, { duration: 200 });
  }, [level]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (level === null) return null;

  // RN Modal creates a new view hierarchy — CSS vars don't cascade from parent.
  // Re-apply design vars so NativeWind semantic tokens work inside the modal.
  const designVars = buildDesignVars(themeId, isDark);

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={[designVars, { flex: 1 }]}>
        <Pressable
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={onClose}
        >
          <Animated.View
            style={animatedStyle}
            className="rounded-xl bg-bg-overlay w-[280px]"
          >
            <View className="items-center gap-4 p-6">
              <RNText style={{ fontSize: 48 }}>🎉</RNText>
              <RNText
                className="font-display text-display-md"
                style={{ color: theme.colors.primary }}
              >
                {t('gamification.levelUp', { level })}
              </RNText>
              <RNText className="text-content-secondary text-body-md text-center">
                {t('gamification.levelUpMessage')}
              </RNText>
              <PrimaryButton label={t('gamification.continue')} onPress={onClose} />
            </View>
          </Animated.View>
        </Pressable>
      </View>
    </Modal>
  );
}
