import { useState } from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/contexts';
import { useBalanceHidden } from '@/stores/settingsStore';
import { GhostButton, PrimaryButton } from '@/components/premium';
import { cn } from '@/lib/utils';
import type { AccountWithBalance, PlanificationWithTotal } from '@/types';

interface ValidatePlanificationDialogProps {
  isOpen: boolean;
  planification: PlanificationWithTotal | null;
  accounts: AccountWithBalance[];
  onClose: () => void;
  onValidate: (planificationId: string, accountId: string) => Promise<{ success: boolean; error?: string }>;
  formatMoney: (amount: number) => string;
}

export function ValidatePlanificationDialog({
  isOpen,
  planification,
  accounts,
  onClose,
  onValidate,
  formatMoney,
}: ValidatePlanificationDialogProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const balanceHidden = useBalanceHidden();
  const hiddenAmount = '••••••';
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!planification || !selectedAccountId) return;
    setIsLoading(true);
    setError(null);
    const result = await onValidate(planification.id, selectedAccountId);
    setIsLoading(false);
    if (result.success) {
      setSelectedAccountId(null);
      onClose();
    } else if (result.error) {
      setError(result.error);
    }
  };

  const handleClose = () => {
    setSelectedAccountId(null);
    setError(null);
    onClose();
  };

  const getAccountColor = (type: string) => (type === 'bank' ? theme.colors.primary : theme.colors.secondary);

  const getAccountName = (account: AccountWithBalance) => {
    if (account.is_default === 1) {
      return account.type === 'bank' ? t('account.defaultBank') : t('account.defaultCash');
    }
    return account.name;
  };

  return (
    <AlertDialog isOpen={isOpen && !!planification} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <RNText className="font-display text-display-md text-content-primary">{t('planification.validate')}</RNText>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <View className="gap-4">
            <RNText className="text-content-secondary">
              {t('planification.deductFromAccount', { amount: formatMoney(planification?.total ?? 0) })}
            </RNText>
            <View className="gap-2">
              {accounts.map((account) => {
                const isSelected = selectedAccountId === account.id;
                const color = getAccountColor(account.type);
                const hasEnough = account.current_balance >= (planification?.total ?? 0);
                return (
                  <Pressable
                    key={account.id}
                    onPress={() => { setSelectedAccountId(account.id); setError(null); }}
                    disabled={!hasEnough}
                    style={{ opacity: hasEnough ? 1 : 0.5 }}
                  >
                    <View
                      className={cn('p-3 rounded-xl', !isSelected && 'bg-bg-raised')}
                      style={isSelected ? { backgroundColor: color + '20' } : undefined}
                    >
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name={account.icon as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={color}
                          />
                          <View>
                            <RNText className="font-medium text-content-primary">{getAccountName(account)}</RNText>
                            <RNText className="text-xs text-content-tertiary">
                              {balanceHidden ? hiddenAmount : formatMoney(account.current_balance)}
                            </RNText>
                          </View>
                        </View>
                        {isSelected && <Ionicons name="checkmark-circle" size={24} color={color} />}
                        {!hasEnough && (
                          <RNText className="text-xs text-error">{t('planification.insufficientBalance')}</RNText>
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {error && (
              <View className="p-3 rounded-xl bg-error/10">
                <RNText className="text-error text-center">{t(error)}</RNText>
              </View>
            )}
          </View>
        </AlertDialogBody>
        <AlertDialogFooter>
          <GhostButton label={t('common.cancel')} onPress={handleClose} compact />
          <PrimaryButton
            label={isLoading ? t('planification.validating') : t('planification.validate')}
            onPress={handleValidate}
            disabled={!selectedAccountId || isLoading}
            compact
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
