import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text as RNText, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts';
import { useCurrency } from '@/stores/settingsStore';
import { formatAmountInput, getNumericValue } from '@/lib/amountInput';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { PrimaryButton } from '@/components/premium';

export default function BalanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const currency = useCurrency();
  const { t } = useTranslation();
  const [bankBalance, setBankBalance] = useState('');
  const [cashBalance, setCashBalance] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    const numericBank = getNumericValue(bankBalance);
    const numericCash = getNumericValue(cashBalance);

    if (numericBank < 0 || numericCash < 0) {
      setError(t('onboarding.negativeError'));
      return;
    }

    if (numericBank === 0 && numericCash === 0) {
      setError(t('onboarding.balanceRequired'));
      return;
    }

    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/onboarding/categories' as const,
      params: {
        bankBalance: bankBalance || '0',
        cashBalance: cashBalance || '0',
      },
    });
  };

  const handleBankChange = (text: string) => {
    setBankBalance(formatAmountInput(text));
    if (error) setError('');
  };

  const handleCashChange = (text: string) => {
    setCashBalance(formatAmountInput(text));
    if (error) setError('');
  };

  return (
    <View
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top }}
    >
      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        bottomOffset={20}
      >
        <View className="flex-1 p-6">
          <View className="flex-1 gap-6">
            <ProgressBar step={7} totalSteps={8} />
            <View className="gap-3">
              <RNText className="font-display text-display-xl text-content-primary">
                {t('onboarding.configureAccounts')}
              </RNText>
              <RNText className="font-body-regular text-body-lg text-content-secondary">
                {t('onboarding.enterBalances')}
              </RNText>
            </View>

            <View className="gap-4 mt-4">
              <View className="p-4 rounded-xl bg-bg-surface">
                <View className="flex-row gap-3 items-center mb-3">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.colors.primary + '20' }}
                  >
                    <Ionicons name="card" size={24} color={theme.colors.primary} />
                  </View>
                  <View>
                    <RNText className="font-ui text-ui-md text-content-primary">{t('account.bank')}</RNText>
                    <RNText className="text-body-sm text-content-tertiary">{t('onboarding.bankAccount')}</RNText>
                  </View>
                </View>

                <RNText className="font-ui text-ui-md text-content-primary mb-2">
                  {t('onboarding.balanceInBank')} ({currency.code})
                </RNText>
                <View className="rounded-xl bg-bg-raised px-4 py-3">
                  <TextInput
                    className="font-body-regular text-body-lg text-content-primary"
                    placeholder="0"
                    placeholderTextColor="#6E6E7D"
                    keyboardType="decimal-pad"
                    value={bankBalance}
                    onChangeText={handleBankChange}
                  />
                </View>
              </View>

              <View className="p-4 rounded-xl bg-bg-surface">
                <View className="flex-row gap-3 items-center mb-3">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.colors.secondary + '20' }}
                  >
                    <Ionicons name="cash" size={24} color={theme.colors.secondary} />
                  </View>
                  <View>
                    <RNText className="font-ui text-ui-md text-content-primary">{t('account.cash')}</RNText>
                    <RNText className="text-body-sm text-content-tertiary">{t('onboarding.cashAccount')}</RNText>
                  </View>
                </View>

                <RNText className="font-ui text-ui-md text-content-primary mb-2">
                  {t('onboarding.balanceInCash')} ({currency.code})
                </RNText>
                <View className="rounded-xl bg-bg-raised px-4 py-3">
                  <TextInput
                    className="font-body-regular text-body-lg text-content-primary"
                    placeholder="0"
                    placeholderTextColor="#6E6E7D"
                    keyboardType="decimal-pad"
                    value={cashBalance}
                    onChangeText={handleCashChange}
                  />
                </View>
              </View>
            </View>

            {error && (
              <RNText className="text-error text-body-sm">
                {error}
              </RNText>
            )}

            <RNText className="text-center text-content-tertiary text-body-sm">
              {t('onboarding.balanceChangeHint')}
            </RNText>

            <PrimaryButton
              label={t('onboarding.next')}
              onPress={handleNext}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
