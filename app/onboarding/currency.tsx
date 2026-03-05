import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useTheme } from '@/contexts';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/constants/currencies';
import { useSettings } from '@/hooks';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import { getDarkModeColors } from '@/constants/darkMode';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { PressableScale } from '@/components/onboarding/PressableScale';

export default function CurrencyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { setCurrency } = useSettings();
  const { t } = useTranslation();
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  const colors = getDarkModeColors(isDark);
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);
    await setCurrency(selectedCurrency);
    setIsLoading(false);
    router.push('/onboarding/wow');
  };

  return (
    <View
      className="flex-1 bg-background-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <Box className="flex-1 p-6">
        <ProgressBar step={6} totalSteps={9} />

        <VStack space="md" className="mb-8">
          <Text className="text-typography-500">{t('onboarding.currencyStep')}</Text>
          <Heading size="xl" className="text-typography-900">
            {t('onboarding.currencyTitle')}
          </Heading>
          <Text className="text-typography-600">
            {t('onboarding.currencySubtitle')}
          </Text>
        </VStack>

        <VStack space="md" className="flex-1">
          {CURRENCIES.map((currency) => {
            const isSelected = selectedCurrency === currency.code;
            return (
              <PressableScale
                key={currency.code}
                onPress={() => setSelectedCurrency(currency.code)}
              >
                <HStack
                  className="p-4 rounded-xl border-2"
                  style={{
                    backgroundColor: isSelected ? theme.colors.primaryLight : colors.cardBg,
                    borderColor: isSelected ? theme.colors.primary : colors.cardBorder,
                  }}
                  space="md"
                >
                  <Box
                    className="w-14 h-14 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? theme.colors.primary : colors.chipBg,
                    }}
                  >
                    <Text
                      className="text-2xl font-bold"
                      style={{ color: isSelected ? '#FFFFFF' : colors.textMuted }}
                    >
                      {currency.symbol}
                    </Text>
                  </Box>
                  <VStack className="flex-1 justify-center">
                    <Text className="font-bold text-lg text-typography-900">
                      {currency.code}
                    </Text>
                    <Text className="text-sm text-typography-500">
                      {t(`currencies.${currency.code}`)}
                    </Text>
                  </VStack>
                  {isSelected && (
                    <Box
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <Ionicons name="checkmark" size={14} color="white" />
                    </Box>
                  )}
                </HStack>
              </PressableScale>
            );
          })}
        </VStack>

        <Text className="text-center text-typography-400 text-sm mb-4">
          {t('onboarding.currencyChangeHint')}
        </Text>

        <Button
          size="xl"
          className="w-full"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={handleNext}
          isDisabled={isLoading}
        >
          <ButtonText className="text-white">
            {isLoading ? t('common.loading') : t('onboarding.currencyCta')}
          </ButtonText>
        </Button>
      </Box>
    </View>
  );
}
