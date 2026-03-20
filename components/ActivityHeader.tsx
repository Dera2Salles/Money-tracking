import { useMemo } from 'react';
import { Pressable, ScrollView, View, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts';
import { formatCurrency } from '@/lib/currency';
import { useCurrencyCode } from '@/stores/settingsStore';
import type { TransactionWithCategory } from '@/hooks/useTransactions';

type FilterType = 'all' | 'expense' | 'income' | 'transfer';

interface ActivityHeaderProps {
  transactions: TransactionWithCategory[];
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function useTodayData(transactions: TransactionWithCategory[]) {
  return useMemo(() => {
    const todayStr = new Date().toDateString();
    let todayExpenses = 0, todayIncome = 0;

    transactions.forEach((tx) => {
      if (tx.transfer_id) return;
      if (new Date(tx.created_at).toDateString() === todayStr) {
        if (tx.type === 'expense') todayExpenses += tx.amount;
        else if (tx.type === 'income') todayIncome += tx.amount;
      }
    });

    return { todayExpenses, todayIncome };
  }, [transactions]);
}

export function ActivityHeader({ transactions, filterType, onFilterChange }: ActivityHeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const currencyCode = useCurrencyCode();
  const { todayExpenses, todayIncome } = useTodayData(transactions);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('history.filterAll') },
    { key: 'expense', label: t('history.filterExpenses') },
    { key: 'income', label: t('history.filterIncome') },
    { key: 'transfer', label: t('history.filterTransfers') },
  ];

  const todayTotal = todayExpenses + todayIncome;

  return (
    <View className="gap-2 px-4 pb-2">
      {/* Today's Activity */}
      {todayTotal > 0 && (
        <View className="p-4 rounded-xl" style={{ backgroundColor: theme.colors.primary + '10' }}>
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-3 items-center">
              <View className="p-2.5 rounded-lg" style={{ backgroundColor: theme.colors.primary + '20' }}>
                <Ionicons name="today" size={24} color={theme.colors.primary} />
              </View>
              <View>
                <RNText className="font-ui text-ui-sm text-content-tertiary">{t('history.spentToday')}</RNText>
                <RNText className="font-display text-display-md" style={{ color: '#EF4444' }}>
                  {formatCurrency(todayExpenses, currencyCode)}
                </RNText>
              </View>
            </View>
            {todayIncome > 0 && (
              <View className="items-end">
                <RNText className="font-ui text-ui-sm text-content-tertiary">{t('history.earnedToday')}</RNText>
                <RNText className="font-display text-display-md" style={{ color: '#22C55E' }}>
                  +{formatCurrency(todayIncome, currencyCode)}
                </RNText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Quick Access Cards */}
      <View className="flex-row gap-2">
        <Pressable onPress={() => router.push('/reports' as any)} className="flex-1">
          <View
            className="p-4 rounded-xl flex-row items-center gap-3"
            style={{ backgroundColor: theme.colors.primaryLight }}
          >
            <Ionicons name="bar-chart" size={26} color={theme.colors.primary} />
            <View className="flex-1">
              <RNText className="font-ui text-ui-md" style={{ color: theme.colors.primary }}>
                {t('history.reports')}
              </RNText>
              <RNText className="font-body-regular text-body-sm text-content-tertiary" numberOfLines={1}>
                {t('history.seeReports')}
              </RNText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
          </View>
        </Pressable>
        <Pressable onPress={() => router.push('/calendar' as any)} className="flex-1">
          <View
            className="p-4 rounded-xl flex-row items-center gap-3"
            style={{ backgroundColor: theme.colors.primaryLight }}
          >
            <Ionicons name="calendar" size={26} color={theme.colors.primary} />
            <View className="flex-1">
              <RNText className="font-ui text-ui-md" style={{ color: theme.colors.primary }}>
                {t('history.calendar')}
              </RNText>
              <RNText className="font-body-regular text-body-sm text-content-tertiary" numberOfLines={1}>
                {t('history.seeCalendar')}
              </RNText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
          </View>
        </Pressable>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {filters.map((f) => (
          <Pressable key={f.key} onPress={() => onFilterChange(f.key)}>
            <View
              className="px-5 py-3 rounded-full"
              style={filterType === f.key
                ? { backgroundColor: theme.colors.primary }
                : { backgroundColor: theme.colors.primary + '10' }
              }
            >
              <RNText
                className="font-ui text-ui-sm"
                style={{ color: filterType === f.key ? '#FFFFFF' : theme.colors.primary }}
              >
                {f.label}
              </RNText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
