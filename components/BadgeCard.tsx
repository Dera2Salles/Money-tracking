import { View, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import type { BadgeDefinition } from '@/constants/badges';

interface BadgeCardProps {
  badge: BadgeDefinition;
  earned: boolean;
  earnedDate: string | null;
}

export function BadgeCard({ badge, earned, earnedDate }: BadgeCardProps) {
  const { t } = useTranslation();
  const isDark = useEffectiveColorScheme() === 'dark';

  const formattedDate = earnedDate
    ? new Date(earnedDate).toLocaleDateString()
    : null;

  return (
    <View
      className="p-3 rounded-2xl items-center gap-1.5"
      style={{
        backgroundColor: earned
          ? badge.color + '12'
          : isDark ? '#1E1E25' : '#F3F4F6',
        opacity: earned ? 1 : 0.7,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: earned ? badge.color + '20' : (isDark ? '#2A2A35' : '#E5E7EB') }}
      >
        {earned ? (
          <Ionicons name={badge.icon as keyof typeof Ionicons.glyphMap} size={24} color={badge.color} />
        ) : (
          <Ionicons name="lock-closed" size={20} color={isDark ? '#52525F' : '#9CA3AF'} />
        )}
      </View>
      <RNText
        className="text-ui-xs font-ui text-center"
        style={{ color: earned ? badge.color : (isDark ? '#52525F' : '#6B7280') }}
        numberOfLines={1}
      >
        {t(badge.nameKey)}
      </RNText>
      <RNText
        className="text-center font-body-regular"
        style={{ fontSize: 10, color: isDark ? '#8E8EA0' : '#9CA3AF' }}
        numberOfLines={2}
      >
        {earned && formattedDate
          ? t('gamification.earnedOn', { date: formattedDate })
          : t(badge.descriptionKey)}
      </RNText>
    </View>
  );
}
