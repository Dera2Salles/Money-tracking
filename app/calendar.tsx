import { useState, useMemo, useCallback } from 'react';
import { ScrollView, Pressable, View, Text as RNText } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';
import { ExpenseCalendar } from '@/components/ExpenseCalendar';
import { TransactionCard } from '@/components/TransactionCard';
import { useTransactions } from '@/hooks';
import { getDailyTotals } from '@/hooks/useTransactionStats';
import { useTheme } from '@/contexts';
import { SEMANTIC_COLORS } from '@/constants/darkMode';
import { formatCurrency } from '@/lib/currency';
import { useCurrencyCode } from '@/stores/settingsStore';
import { cn } from '@/lib/utils';
import type { TransactionWithCategory } from '@/hooks/useTransactions';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const currencyCode = useCurrencyCode();
  const { transactions, refresh } = useTransactions();
  const posthog = usePostHog();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const dailyTotals = useMemo(() => getDailyTotals(transactions, year, month), [transactions, year, month]);

  const monthExpenses = useMemo(() => {
    return Object.values(dailyTotals).reduce((sum, dt) => sum + dt.expenses, 0);
  }, [dailyTotals]);

  const monthIncome = useMemo(() => {
    return Object.values(dailyTotals).reduce((sum, dt) => sum + dt.income, 0);
  }, [dailyTotals]);

  const dayTransactions = useMemo(() => {
    if (!selectedDay) return [];
    return transactions.filter((tx) => {
      const d = new Date(tx.created_at);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
    });
  }, [transactions, selectedDay, year, month]);

  const navigateMonth = (direction: -1 | 1) => {
    posthog.capture('calendar_navigated', { direction: direction === 1 ? 'next' : 'previous' });
    const d = new Date(year, month + direction, 1);
    const newYear = d.getFullYear();
    const newMonth = d.getMonth();
    setYear(newYear);
    setMonth(newMonth);
    // Auto-select today if navigating to current month, otherwise 1st day
    const isCurrentMonth = today.getFullYear() === newYear && today.getMonth() === newMonth;
    setSelectedDay(isCurrentMonth ? today.getDate() : 1);
  };

  const locale = i18n.language === 'mg' ? 'fr-MG' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const monthLabel = new Date(year, month).toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const renderTransaction = ({ item }: { item: TransactionWithCategory }) => (
    <TransactionCard transaction={item} />
  );

  return (
    <ScrollView
      style={{ flex: 1, paddingTop: insets.top }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingHorizontal: 16 }}
    >
      <View className="flex-row items-center mb-4 mt-2">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </Pressable>
        <RNText className="font-display text-display-md text-content-primary ml-3">{t('calendar.title')}</RNText>
      </View>

      <View className="gap-4">
        {/* Month Navigation */}
        <View className="flex-row items-center justify-between px-2">
          <Pressable onPress={() => navigateMonth(-1)} hitSlop={12}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
          </Pressable>
          <View className="items-center">
            <RNText className="font-ui text-ui-lg text-content-primary capitalize">{monthLabel}</RNText>
            <View className="flex-row gap-3">
              <RNText className="text-ui-sm font-ui" style={{ color: SEMANTIC_COLORS.expense }}>
                -{formatCurrency(monthExpenses, currencyCode)}
              </RNText>
              <RNText className="text-ui-sm font-ui" style={{ color: SEMANTIC_COLORS.income }}>
                +{formatCurrency(monthIncome, currencyCode)}
              </RNText>
            </View>
          </View>
          <Pressable onPress={() => navigateMonth(1)} hitSlop={12}>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </Pressable>
        </View>

        {/* Calendar Grid */}
        <View className="p-3 rounded-xl bg-bg-surface">
          <ExpenseCalendar
            dailyTotals={dailyTotals}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            year={year}
            month={month}
          />
        </View>

        {/* Selected Day Detail */}
        {selectedDay && (
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <RNText className="font-ui text-ui-md text-content-primary">
                {new Date(year, month, selectedDay).toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </RNText>
              <View className="flex-row gap-2">
                {dailyTotals[selectedDay] && dailyTotals[selectedDay].expenses > 0 && (
                  <RNText className="text-ui-sm font-ui" style={{ color: SEMANTIC_COLORS.expense }}>
                    -{formatCurrency(dailyTotals[selectedDay].expenses, currencyCode)}
                  </RNText>
                )}
                {dailyTotals[selectedDay] && dailyTotals[selectedDay].income > 0 && (
                  <RNText className="text-ui-sm font-ui" style={{ color: SEMANTIC_COLORS.income }}>
                    +{formatCurrency(dailyTotals[selectedDay].income, currencyCode)}
                  </RNText>
                )}
              </View>
            </View>

            {dayTransactions.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <RNText className="text-2xl mb-1">📭</RNText>
                <RNText className="text-body-sm text-content-tertiary">{t('calendar.noExpenses')}</RNText>
              </View>
            ) : (
              dayTransactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
