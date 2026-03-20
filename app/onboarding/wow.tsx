import { useState, useCallback, useEffect } from 'react';
import { View, Pressable, Text as RNText, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { SpeechBubble } from '@/components/onboarding/SpeechBubble';
import { ConfettiEffect } from '@/components/onboarding/ConfettiEffect';
import { useTheme } from '@/contexts';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/constants/currencies';
import { formatCurrency } from '@/lib/currency';
import { PressableScale } from '@/components/onboarding/PressableScale';
import { usePostHog } from 'posthog-react-native';
import { useSettings } from '@/hooks';
import { PrimaryButton } from '@/components/premium';
import { cn } from '@/lib/utils';

const AMOUNTS: Record<string, { expenses: number[]; balance: number }> = {
  MGA: { expenses: [300000, 500000, 800000, 1500000], balance: 10000000 },
  EUR: { expenses: [350, 1200, 1500, 2500], balance: 50000 },
  USD: { expenses: [350, 1200, 1500, 2500], balance: 50000 },
};

const EXPENSE_TEMPLATES = [
  { id: 'coffee', labelKey: 'wow.expenseCoffee', icon: 'cafe' as const, categoryKey: 'wow.catFood', color: '#FF6B6B' },
  { id: 'taxi', labelKey: 'wow.expenseTaxi', icon: 'car' as const, categoryKey: 'wow.catTransport', color: '#4ECDC4' },
  { id: 'lunch', labelKey: 'wow.expenseLunch', icon: 'restaurant' as const, categoryKey: 'wow.catFood', color: '#FF6B6B' },
  { id: 'phone', labelKey: 'wow.expensePhone', icon: 'phone-portrait' as const, categoryKey: 'wow.catBills', color: '#A78BFA' },
];

function AnimatedBar({ targetWidth, color, delay }: { targetWidth: number; color: string; delay: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(targetWidth, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, [targetWidth]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    height: '100%',
    borderRadius: 3,
    backgroundColor: color,
  }));

  return <Animated.View style={barStyle} />;
}

export default function WowScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { setCurrency } = useSettings();
  const posthog = usePostHog();

  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [tappedExpenses, setTappedExpenses] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const balanceAnim = useSharedValue(1);
  const reportOpacity = useSharedValue(0);
  const reportTranslateY = useSharedValue(600);

  const currencyAmounts = AMOUNTS[selectedCurrency] || AMOUNTS.USD;
  const expenses = EXPENSE_TEMPLATES.map((tpl, i) => ({ ...tpl, amount: currencyAmounts.expenses[i] }));

  const currentBalance = currencyAmounts.balance - expenses
    .filter(e => tappedExpenses.has(e.id))
    .reduce((sum, e) => sum + e.amount, 0);

  const allTapped = tappedExpenses.size === expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown = expenses.reduce<Record<string, { amount: number; color: string; categoryKey: string }>>((acc, e) => {
    const cat = e.categoryKey;
    if (!acc[cat]) acc[cat] = { amount: 0, color: e.color, categoryKey: cat };
    acc[cat].amount += e.amount;
    return acc;
  }, {});

  const handleSelectCurrency = async (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCurrency(code);
    await setCurrency(code);
  };

  const handleTapExpense = useCallback((expense: typeof expenses[0]) => {
    if (tappedExpenses.has(expense.id)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newTapped = new Set(tappedExpenses);
    newTapped.add(expense.id);
    setTappedExpenses(newTapped);

    balanceAnim.value = withSpring(1, { damping: 4, stiffness: 200 });

    if (newTapped.size === expenses.length) {
      posthog.capture('wow_moment_completed', {
        currency: selectedCurrency,
        expenses_tapped: newTapped.size,
      });
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowConfetti(true);
        overlayOpacity.value = withTiming(1, { duration: 300 });
        reportOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
        reportTranslateY.value = withDelay(200, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
      }, 300);
    }
  }, [tappedExpenses, expenses.length, selectedCurrency]);

  const balanceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: balanceAnim.value }],
  }));

  const fmt = (amountInCents: number) => formatCurrency(amountInCents, selectedCurrency);

  const overlayOpacity = useSharedValue(0);

  const reportStyle = useAnimatedStyle(() => ({
    opacity: reportOpacity.value,
    transform: [{ translateY: reportTranslateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 p-6">
        <ProgressBar step={6} totalSteps={8} />

        <View className="gap-3 mb-4">
          <RNText className="font-display text-display-xl text-content-primary">
            {t('wow.title')}
          </RNText>
          <RNText className="font-body-regular text-body-lg text-content-secondary">
            {t('wow.subtitle')}
          </RNText>
        </View>

        <View className="flex-row gap-2 mb-4">
          {CURRENCIES.map((cur) => {
            const isActive = selectedCurrency === cur.code;
            return (
              <Pressable
                key={cur.code}
                onPress={() => handleSelectCurrency(cur.code)}
                className="flex-1 py-3 rounded-xl items-center justify-center"
                style={{
                  backgroundColor: isActive ? theme.colors.primary : '#F2F2F6',
                }}
              >
                <RNText
                  className="font-ui text-ui-md"
                  style={{ color: isActive ? '#FFFFFF' : '#6E6E7D' }}
                >
                  {cur.symbol} {cur.code}
                </RNText>
              </Pressable>
            );
          })}
        </View>

        <View
          className="p-5 rounded-2xl mb-4"
          style={{ backgroundColor: theme.colors.primary + '15' }}
        >
          <RNText className="text-body-sm text-content-tertiary mb-1">{t('wow.balance')}</RNText>
          <Animated.View style={balanceStyle}>
            <RNText
              className="text-4xl font-display"
              style={{ color: theme.colors.primary }}
            >
              {fmt(currentBalance)}
            </RNText>
          </Animated.View>
        </View>

        <View className="flex-1 gap-2">
          <RNText className="text-body-sm font-ui text-content-tertiary mb-1">
            {t('wow.tapToAdd')}
          </RNText>
          {expenses.map((expense) => {
            const isTapped = tappedExpenses.has(expense.id);
            return (
              <PressableScale
                key={expense.id}
                onPress={() => handleTapExpense(expense)}
                disabled={isTapped}
                haptic="none"
                scaleValue={0.96}
              >
                <View
                  className={cn('flex-row p-4 rounded-xl gap-3 items-center', {
                    'bg-bg-surface': !isTapped,
                  })}
                  style={{
                    backgroundColor: isTapped ? '#F2F2F6' : undefined,
                    opacity: isTapped ? 0.6 : 1,
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: expense.color + '20' }}
                  >
                    <Ionicons name={expense.icon} size={20} color={expense.color} />
                  </View>
                  <View className="flex-1">
                    <RNText className="font-ui text-ui-md text-content-primary">
                      {t(expense.labelKey)}
                    </RNText>
                    <RNText className="text-body-sm text-content-tertiary">
                      {t(expense.categoryKey)}
                    </RNText>
                  </View>
                  <RNText
                    className="font-ui text-ui-md"
                    style={{ color: isTapped ? '#6E6E7D' : '#FF3B30' }}
                  >
                    -{fmt(expense.amount)}
                  </RNText>
                  {isTapped && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                  )}
                </View>
              </PressableScale>
            );
          })}
        </View>

      </View>

      {/* Overlay + Report modal */}
      {allTapped && (
        <>
          <Animated.View
            style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }, overlayStyle]}
            pointerEvents="none"
          />
          <Animated.View
            style={[{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }, reportStyle]}
          >
            <View
              className="bg-bg-base rounded-t-3xl p-6"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              {/* Bubule félicitation */}
              <View className="flex-row items-start mb-4">
                <Image
                  source={require('@/assets/images/bubule-enjoy.png')}
                  style={{ width: 100, height: 100 }}
                  contentFit="contain"
                />
                <View className="flex-1 ml-2">
                  <SpeechBubble text={t('wow.bubuleCongrats')} direction="left" />
                </View>
              </View>

              {/* Report */}
              <View className="p-5 rounded-2xl mb-4 bg-bg-raised">
                <View className="flex-row items-center gap-2 mb-4">
                  <Ionicons name="bar-chart" size={20} color={theme.colors.primary} />
                  <RNText className="font-display text-display-md text-content-primary">{t('wow.reportTitle')}</RNText>
                </View>

                <View className="gap-3">
                  {Object.values(categoryBreakdown).map((cat, idx) => {
                    const pct = (cat.amount / totalSpent) * 100;
                    return (
                      <View key={cat.categoryKey} className="gap-1.5">
                        <View className="flex-row justify-between">
                          <RNText className="text-body-md text-content-secondary">{t(cat.categoryKey)}</RNText>
                          <RNText className="text-body-md font-ui text-content-primary">{fmt(cat.amount)}</RNText>
                        </View>
                        <View style={{ height: 8, borderRadius: 4, backgroundColor: '#E5E5EA' }}>
                          <AnimatedBar targetWidth={pct} color={cat.color} delay={idx * 200} />
                        </View>
                      </View>
                    );
                  })}
                </View>

                <View className="flex-row justify-between mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: '#E5E5EA' }}>
                  <RNText className="font-display text-display-md text-content-primary">{t('wow.reportTotal')}</RNText>
                  <RNText className="font-ui text-ui-lg" style={{ color: '#FF3B30' }}>-{fmt(totalSpent)}</RNText>
                </View>
              </View>

              <RNText className="text-center text-content-secondary text-body-md mb-4">
                {t('wow.successMessage')}
              </RNText>

              <PrimaryButton
                label={t('wow.cta')}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/onboarding/balance');
                }}
              />
            </View>
          </Animated.View>
        </>
      )}

      {showConfetti && <ConfettiEffect trigger={showConfetti} />}
    </View>
  );
}
