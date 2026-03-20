import { Pressable, View, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts';
import type { PlanificationWithTotal } from '@/types';

interface PlanificationCardProps {
  planification: PlanificationWithTotal;
  onPress: () => void;
  onLongPress?: () => void;
  onValidate?: () => void;
  onDelete?: () => void;
  formatMoney: (amount: number) => string;
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
}

function isExpired(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

export function PlanificationCard({
  planification,
  onPress,
  onLongPress,
  onValidate,
  onDelete,
  formatMoney,
}: PlanificationCardProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isPending = planification.status === 'pending';
  const expired = isPending && isExpired(planification.deadline);

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <View
        className="bg-bg-surface p-4 rounded-xl mb-3"
        style={expired ? { borderWidth: 1, borderColor: '#EF4444' } : undefined}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center flex-wrap gap-2 mb-2">
              <RNText
                className="font-semibold text-lg text-content-primary"
              >
                {planification.title}
              </RNText>
              <View
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: isPending ? theme.colors.primaryLight : theme.colors.secondaryLight,
                }}
              >
                <RNText
                  className="font-medium text-xs"
                  style={{ color: isPending ? theme.colors.primary : theme.colors.secondary }}
                >
                  {isPending ? t('planification.pending') : t('planification.completed')}
                </RNText>
              </View>
              {expired && (
                <View className="px-2 py-0.5 rounded-full bg-error/10">
                  <RNText className="font-medium text-xs" style={{ color: '#EF4444' }}>
                    {t('planification.expired')}
                  </RNText>
                </View>
              )}
            </View>
            <View className="flex-row items-center gap-3">
              <RNText className="text-sm" style={{ color: '#8E8EA0' }}>
                {t('planification.itemCount', { count: planification.item_count })}
              </RNText>
              {planification.deadline && (
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={expired ? '#EF4444' : theme.colors.textSecondary}
                  />
                  <RNText className="text-sm" style={{ color: expired ? '#EF4444' : theme.colors.textSecondary }}>
                    {formatDate(planification.deadline, i18n.language)}
                  </RNText>
                </View>
              )}
            </View>
          </View>
          <View className="items-end">
            {(planification.total_expenses > 0 || planification.total_income > 0) ? (
              <View className="items-end">
                {planification.total_expenses > 0 && (
                  <RNText className="font-semibold text-sm" style={{ color: '#EF4444' }}>
                    - {formatMoney(planification.total_expenses)}
                  </RNText>
                )}
                {planification.total_income > 0 && (
                  <RNText className="font-semibold text-sm" style={{ color: '#22C55E' }}>
                    + {formatMoney(planification.total_income)}
                  </RNText>
                )}
              </View>
            ) : (
              <RNText className="font-medium" style={{ color: '#8E8EA0' }}>
                0
              </RNText>
            )}
            {isPending && (
              <View className="flex-row items-center gap-2 mt-2">
                {onDelete && (
                  <Pressable onPress={onDelete} className="p-1">
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                )}
                {planification.item_count > 0 && onValidate && (
                  <Pressable
                    onPress={onValidate}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <RNText className="font-medium text-xs" style={{ color: '#FFFFFF' }}>
                      {t('planification.validate')}
                    </RNText>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
