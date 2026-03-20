import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { PressableCard } from '@/components/premium/PremiumCard';
import { Skeleton } from '@/components/premium/Skeleton';
import { useTheme } from '@/contexts';
import { xpProgress, xpForLevel, calculateLevel } from '@/constants/badges';

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) return `${hours}h ${mm}m ${ss}s`;
  return `${mm}m ${ss}s`;
}

interface GamificationBarProps {
  currentStreak: number;
  totalXP: number;
  dailyChallengeCompleted: boolean;
  isLoading?: boolean;
  onPress: () => void;
}

function SkeletonBar() {
  return (
    <View className="rounded-2xl bg-bg-surface px-3 py-2.5 gap-2">
      <View className="flex-row items-center gap-2">
        <Skeleton className="h-4 w-8 rounded" />
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-4 w-16 rounded" />
      </View>
      <Skeleton className="h-3 w-40 rounded" />
    </View>
  );
}

export function GamificationBar({ currentStreak, totalXP, dailyChallengeCompleted, isLoading, onPress }: GamificationBarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getTimeUntilMidnight()), 1_000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <SkeletonBar />;

  const level = calculateLevel(totalXP);
  const progress = xpProgress(totalXP);
  const nextLevelXP = xpForLevel(level + 1);

  return (
    <PressableCard onPress={onPress} className="px-3 py-2.5">
      <View className="gap-2">
        {/* Single row: 🔥 1j · Niv. 1 · [====] · 9/100 XP · ⭐ */}
        <View className="flex-row items-center gap-2">
          <Text className="text-sm">{currentStreak > 0 ? '🔥' : '❄️'}</Text>
          <Text className="text-ui-xs font-ui" style={{ color: currentStreak > 0 ? '#EF4444' : '#9CA3AF' }}>
            {currentStreak}j
          </Text>

          <Text className="text-ui-xs font-ui" style={{ color: theme.colors.primary }}>
            {t('gamification.level', { level })}
          </Text>

          <View className="flex-1 h-2 bg-bg-raised rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: theme.colors.primary,
              }}
            />
          </View>

          <Text className="text-ui-xs font-ui text-content-secondary">
            {t('gamification.xpOf', { current: totalXP, next: nextLevelXP })}
          </Text>

          <Ionicons
            name={dailyChallengeCompleted ? 'checkmark-circle' : 'star-outline'}
            size={16}
            color={dailyChallengeCompleted ? '#22C55E' : '#EAB308'}
          />
        </View>

        {/* Countdown */}
        {currentStreak > 0 && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={11} color="#9CA3AF" />
            <Text className="text-content-tertiary font-body-regular" style={{ fontSize: 10 }}>
              {t('gamification.nextStreak', { time: countdown })}
            </Text>
          </View>
        )}
      </View>
    </PressableCard>
  );
}
