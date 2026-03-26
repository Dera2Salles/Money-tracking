import { useCallback, useState, useEffect } from 'react';
import { ScrollView, View, Text as RNText } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BadgeCard } from '@/components/BadgeCard';
import { PremiumCard, FadeIn } from '@/components/premium';
import { useGamification } from '@/hooks';
import { useTheme } from '@/contexts';
import { BADGES, calculateLevel, xpProgress, xpForLevel } from '@/constants/badges';

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

const challengeKeyMap: Record<string, string> = {
  log_expense: 'gamification.challengeLogExpense',
  log_3_transactions: 'gamification.challengeLog3',
  check_planification: 'gamification.challengeCheckPlan',
  log_income: 'gamification.challengeLogIncome',
  create_planification: 'gamification.challengeCreatePlan',
};

export function AchievementsTab() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const gamification = useGamification();
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);

  const level = calculateLevel(gamification.totalXP);
  const progress = xpProgress(gamification.totalXP);
  const nextLevelXP = xpForLevel(level + 1);
  const earnedCount = gamification.badges.length;
  const challengeText = challengeKeyMap[gamification.dailyChallengeType] || '';

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getTimeUntilMidnight()), 1_000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(useCallback(() => { gamification.checkBadges(); }, []));

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <View className="gap-4">
        {/* Stats row */}
        <FadeIn>
          <View className="flex-row gap-2">
            <StatCard
              icon="flame"
              iconColor="#EF4444"
              label={t('gamification.streak')}
              value={t('gamification.streakDays', { count: gamification.currentStreak })}
              bg="#EF444412"
            />
            <StatCard
              icon="trophy"
              iconColor={theme.colors.primary}
              label={t('gamification.currentLevel')}
              value={String(level)}
              bg={theme.colors.primary + '12'}
            />
            <StatCard
              icon="star"
              iconColor="#EAB308"
              label={t('gamification.totalXP')}
              value={String(gamification.totalXP)}
              bg="#EAB30812"
            />
            <StatCard
              icon="ribbon"
              iconColor="#8B5CF6"
              label={t('gamification.badges')}
              value={t('gamification.badgesEarned', { count: earnedCount, total: BADGES.length })}
              bg="#8B5CF612"
            />
          </View>
        </FadeIn>

        {/* XP Progress */}
        <FadeIn>
          <PremiumCard className="p-4">
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <RNText className="text-ui-sm font-ui text-content-primary">
                  {t('gamification.level', { level })}
                </RNText>
                <RNText className="text-ui-xs font-ui text-content-secondary">
                  {t('gamification.xpOf', { current: gamification.totalXP, next: nextLevelXP })}
                </RNText>
              </View>
              <View className="h-3 bg-bg-raised rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(progress * 100, 100)}%`,
                    backgroundColor: theme.colors.primary,
                  }}
                />
              </View>
            </View>
          </PremiumCard>
        </FadeIn>

        {/* Daily Challenge */}
        {gamification.dailyChallengeType ? (
          <FadeIn>
            <PremiumCard
              className="p-4"
              style={{
                backgroundColor: gamification.dailyChallengeCompleted
                  ? '#22C55E12' : '#EAB30812',
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: gamification.dailyChallengeCompleted
                        ? '#22C55E20' : '#EAB30820',
                    }}
                  >
                    <Ionicons
                      name={gamification.dailyChallengeCompleted ? 'checkmark-circle' : 'star'}
                      size={22}
                      color={gamification.dailyChallengeCompleted ? '#22C55E' : '#EAB308'}
                    />
                  </View>
                  <View className="flex-1">
                    <RNText className="text-ui-sm font-ui text-content-primary">
                      {t('gamification.dailyChallenge')}
                    </RNText>
                    <RNText className="text-body-sm font-body-regular text-content-secondary">
                      {gamification.dailyChallengeCompleted
                        ? t('gamification.challengeCompleted')
                        : t(challengeText)}
                    </RNText>
                  </View>
                </View>
                <RNText className="text-ui-sm font-ui" style={{ color: '#EAB308' }}>
                  +50 XP
                </RNText>
              </View>
            </PremiumCard>
          </FadeIn>
        ) : null}

        {/* Streak info */}
        <FadeIn>
          <View className="flex-row gap-2">
            <PremiumCard className="flex-1 p-3">
              <View className="gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="flame" size={14} color="#EF4444" />
                  <RNText className="text-ui-xs font-ui text-content-secondary">
                    {t('gamification.longestStreak')}
                  </RNText>
                </View>
                <RNText className="text-ui-lg font-ui" style={{ color: '#EF4444' }}>
                  {t('gamification.streakDays', { count: gamification.longestStreak })}
                </RNText>
                {gamification.currentStreak > 0 && (
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons name="time-outline" size={10} color="#9CA3AF" />
                    <RNText className="text-content-tertiary font-body-regular" style={{ fontSize: 9 }}>
                      {t('gamification.nextStreak', { time: countdown })}
                    </RNText>
                  </View>
                )}
              </View>
            </PremiumCard>
            <PremiumCard className="flex-1 p-3">
              <View className="gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="shield-checkmark" size={14} color="#3B82F6" />
                  <RNText className="text-ui-xs font-ui text-content-secondary">
                    {t('gamification.streakFreeze')}
                  </RNText>
                </View>
                <RNText className="text-ui-lg font-ui" style={{ color: '#3B82F6' }}>
                  {t('gamification.streakFreezeDesc', { count: gamification.streakFreezeAvailable })}
                </RNText>
              </View>
            </PremiumCard>
          </View>
        </FadeIn>

        {/* Badges */}
        <View className="gap-3">
          <FadeIn>
            <RNText className="text-ui-lg font-ui text-content-primary">
              {t('gamification.badges')}
            </RNText>
          </FadeIn>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {BADGES.map((badge) => (
              <View key={badge.id} style={{ width: '48%' }}>
                <BadgeCard
                  badge={badge}
                  earned={gamification.badges.includes(badge.id)}
                  earnedDate={null}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, iconColor, label, value, bg }: {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <View
      className="flex-1 rounded-2xl p-2 items-center gap-1"
      style={{ backgroundColor: bg }}
    >
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={iconColor} />
      <RNText className="text-ui-sm font-ui" style={{ color: iconColor }}>{value}</RNText>
      <RNText className="text-content-tertiary font-body-regular text-center" style={{ fontSize: 9 }} numberOfLines={1}>
        {label}
      </RNText>
    </View>
  );
}
