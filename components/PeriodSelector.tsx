import { Pressable, View, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts';
import type { PeriodType } from '@/hooks/useTransactionStats';
import { navigateDate, formatPeriodLabel } from '@/hooks/useTransactionStats';

interface PeriodSelectorProps {
  period: PeriodType;
  date: Date;
  onPeriodChange: (period: PeriodType) => void;
  onDateChange: (date: Date) => void;
}

const PERIODS: PeriodType[] = ['day', 'week', 'month', 'year'];

export function PeriodSelector({ period, date, onPeriodChange, onDateChange }: PeriodSelectorProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const locale = i18n.language === 'mg' ? 'fr-MG' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const label = formatPeriodLabel(date, period, locale);

  return (
    <>
      <View className="flex-row rounded-xl overflow-hidden bg-bg-raised">
        {PERIODS.map((p) => (
          <Pressable key={p} onPress={() => onPeriodChange(p)} className="flex-1">
            <View
              className="py-2 items-center justify-center"
              style={period === p ? { backgroundColor: theme.colors.primary } : undefined}
            >
              <RNText
                className="font-ui text-ui-sm"
                style={{ color: period === p ? '#FFFFFF' : theme.colors.primary }}
              >
                {t(`periods.${p}`)}
              </RNText>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="flex-row items-center justify-between px-2">
        <Pressable onPress={() => onDateChange(navigateDate(date, period, -1))} hitSlop={12}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
        </Pressable>
        <RNText className="font-ui text-ui-md text-content-primary capitalize">{label}</RNText>
        <Pressable onPress={() => onDateChange(navigateDate(date, period, 1))} hitSlop={12}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
        </Pressable>
      </View>
    </>
  );
}
