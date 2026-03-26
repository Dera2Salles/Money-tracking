import { ActivityIndicator, View, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts';
import { GhostButton, PrimaryButton } from '@/components/premium';
import type { Currency } from '@/constants/currencies';

interface CurrencyConversionDialogProps {
  isOpen: boolean;
  fromCurrency: Currency;
  toCurrency: Currency;
  isLoading: boolean;
  isFetchingRate: boolean;
  exchangeRate?: number;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function CurrencyConversionDialog({
  isOpen,
  fromCurrency,
  toCurrency,
  isLoading,
  isFetchingRate,
  exchangeRate,
  error,
  onClose,
  onConfirm,
}: CurrencyConversionDialogProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const canConvert = !isLoading && !isFetchingRate && !!exchangeRate;

  return (
    <AlertDialog isOpen={isOpen} onClose={isLoading ? undefined : onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <RNText className="font-display text-display-md text-content-primary">{t('currency.conversion')}</RNText>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <View className="gap-4">
            <View className="flex-row gap-2 items-center">
              <Ionicons name="wifi" size={18} color="#A0A0B2" />
              <RNText className="text-content-secondary text-body-md flex-1">{t('currency.conversionInfo')}</RNText>
            </View>

            <View className="flex-row items-center justify-center gap-4 py-3">
              <View className="items-center">
                <RNText className="font-display text-display-md" style={{ color: theme.colors.primary }}>
                  {fromCurrency.symbol}
                </RNText>
                <RNText className="text-body-sm text-content-tertiary">{fromCurrency.code}</RNText>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#A0A0B2" />
              <View className="items-center">
                <RNText className="font-display text-display-md" style={{ color: theme.colors.primary }}>
                  {toCurrency.symbol}
                </RNText>
                <RNText className="text-body-sm text-content-tertiary">{toCurrency.code}</RNText>
              </View>
            </View>

            {isFetchingRate ? (
              <View className="flex-row gap-2 items-center justify-center py-2">
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <RNText className="text-content-tertiary text-body-sm">{t('currency.fetchingRate')}</RNText>
              </View>
            ) : exchangeRate ? (
              <View className="bg-bg-raised p-3 rounded-xl gap-1">
                <RNText className="text-content-secondary text-body-sm text-center font-body-medium">
                  {t('currency.currentRate')}
                </RNText>
                <RNText className="text-content-primary text-center font-ui text-ui-md">
                  1 {fromCurrency.code} = {exchangeRate.toFixed(6)} {toCurrency.code}
                </RNText>
                <RNText className="text-content-tertiary text-body-sm text-center mt-1">
                  {t('currency.example')} 100,000 {fromCurrency.code} → {(100000 * exchangeRate).toFixed(2)} {toCurrency.code}
                </RNText>
              </View>
            ) : null}

            <RNText className="text-content-tertiary text-body-sm text-center">
              {t('currency.convertInfo', { from: fromCurrency.name, to: toCurrency.name })}
            </RNText>

            {error && (
              <View className="flex-row gap-2 items-center bg-error/10 p-3 rounded-xl">
                <Ionicons name="alert-circle" size={20} color="#EB5757" />
                <RNText className="text-error flex-1 text-body-sm">{t(error)}</RNText>
              </View>
            )}
          </View>
        </AlertDialogBody>
        <AlertDialogFooter>
          <GhostButton label={t('common.cancel')} onPress={onClose} disabled={isLoading} compact />
          <PrimaryButton
            label={isLoading ? t('currency.converting') : t('currency.convert')}
            onPress={onConfirm}
            isLoading={isLoading}
            disabled={!canConvert}
            compact
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
