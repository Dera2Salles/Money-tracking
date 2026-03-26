import { Pressable, View, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts';
import { SEMANTIC_COLORS } from '@/constants/darkMode';
import { formatCurrency } from '@/lib/currency';
import { useCurrencyCode } from '@/stores/settingsStore';
import type { DailyTotal } from '@/hooks/useTransactionStats';

interface ExpenseCalendarProps {
  dailyTotals: Record<number, DailyTotal>;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  year: number;
  month: number;
}

export function ExpenseCalendar({ dailyTotals, selectedDay, onSelectDay, year, month }: ExpenseCalendarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currencyCode = useCurrencyCode();

  const dayLabels = [
    t('calendar.mon'), t('calendar.tue'), t('calendar.wed'),
    t('calendar.thu'), t('calendar.fri'), t('calendar.sat'), t('calendar.sun'),
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const maxExpense = Object.values(dailyTotals).reduce((max, dt) => Math.max(max, dt.expenses), 0);

  const getIntensity = (expenses: number): string => {
    if (expenses === 0 || maxExpense === 0) return 'transparent';
    const ratio = expenses / maxExpense;
    if (ratio < 0.25) return theme.colors.primary + '20';
    if (ratio < 0.5) return theme.colors.primary + '40';
    if (ratio < 0.75) return theme.colors.primary + '80';
    return theme.colors.primary + 'CC';
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View>
      <View className="flex-row mb-1">
        {dayLabels.map((label, i) => (
          <View key={i} className="flex-1 items-center">
            <RNText className="font-ui text-ui-xs text-content-tertiary">{label}</RNText>
          </View>
        ))}
      </View>

      {rows.map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row mb-1">
          {row.map((day, colIdx) => {
            if (day === null) {
              return <View key={colIdx} style={{ flex: 1, height: 58 }} />;
            }

            const dt = dailyTotals[day];
            const isToday = isCurrentMonth && today.getDate() === day;
            const isSelected = selectedDay === day;
            const bg = getIntensity(dt?.expenses || 0);

            return (
              <Pressable
                key={colIdx}
                onPress={() => onSelectDay(day)}
                style={{
                  flex: 1,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor: isSelected ? theme.colors.primary : bg,
                  borderWidth: isToday ? 2 : 0,
                  borderColor: theme.colors.primary,
                  margin: 1,
                }}
              >
                <RNText
                  className="font-body-regular text-body-sm"
                  style={{ color: isSelected ? '#FFF' : isToday ? theme.colors.primary : '#9CA3AF' }}
                >
                  {day}
                </RNText>
                {dt && dt.expenses > 0 && (
                  <RNText
                    className="text-[8px]"
                    style={{ color: isSelected ? '#FFF' : SEMANTIC_COLORS.expense }}
                    numberOfLines={1}
                  >
                    -{formatCurrency(dt.expenses, currencyCode)}
                  </RNText>
                )}
                {dt && dt.income > 0 && (
                  <RNText
                    className="text-[8px]"
                    style={{ color: isSelected ? '#FFF' : SEMANTIC_COLORS.income }}
                    numberOfLines={1}
                  >
                    +{formatCurrency(dt.income, currencyCode)}
                  </RNText>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
