import { useState } from 'react';
import { Pressable, View, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import { Text as RNText } from 'react-native';
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
import { useCurrency } from '@/stores/settingsStore';
import { formatAmountInput, parseAmount } from '@/lib/amountInput';
import type { AccountType } from '@/types';
import { GhostButton, PrimaryButton } from '@/components/premium';
import { cn } from '@/lib/utils';

const ACCOUNT_ICONS = [
  { icon: 'card', label: 'Carte' },
  { icon: 'cash', label: 'Espèce' },
  { icon: 'wallet', label: 'Portefeuille' },
  { icon: 'business', label: 'Entreprise' },
  { icon: 'phone-portrait', label: 'Mobile' },
  { icon: 'globe', label: 'En ligne' },
];

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: (params: {
    name: string;
    type: AccountType;
    initialBalance: number;
    icon: string;
  }) => Promise<{ success: boolean; limitReached: boolean } | void>;
  canCreateAccount: boolean;
  customAccountsCount: number;
  maxCustomAccounts: number;
}

export function AddAccountModal({
  isOpen,
  onClose,
  onCreateAccount,
  canCreateAccount,
  customAccountsCount,
  maxCustomAccounts,
}: AddAccountModalProps) {
  const { theme } = useTheme();
  const currency = useCurrency();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [icon, setIcon] = useState('wallet');
  const [balance, setBalance] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsCreating(true);
    await onCreateAccount({
      name: name.trim(),
      type,
      initialBalance: parseAmount(balance),
      icon,
    });
    resetForm();
    setIsCreating(false);
  };

  const resetForm = () => {
    setName('');
    setType('bank');
    setIcon('wallet');
    setBalance('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Show limit reached view
  if (!canCreateAccount) {
    return (
      <AlertDialog isOpen={isOpen} onClose={handleClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center bg-error/10"
              >
                <Ionicons name="alert-circle" size={24} color="#EF4444" />
              </View>
              <RNText className="font-display text-display-md text-content-primary">{t('account.limitReached')}</RNText>
            </View>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <RNText className="text-body-md text-content-secondary">
              {t('account.limitMessage', { max: maxCustomAccounts })}
            </RNText>
          </AlertDialogBody>
          <AlertDialogFooter>
            <PrimaryButton label={t('common.understood')} onPress={handleClose} compact />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <View className="flex-row items-center justify-between w-full gap-3">
            <RNText className="font-display text-display-md text-content-primary">{t('account.new')}</RNText>
            <RNText className="text-body-sm text-content-tertiary">
              {t('account.customCount', { count: customAccountsCount, max: maxCustomAccounts })}
            </RNText>
          </View>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bottomOffset={20}
            style={{ maxHeight: 400 }}
          >
          <View className="gap-4">
            <View className="gap-2">
              <RNText className="text-body-md font-body-bold text-content-primary">{t('account.name')}</RNText>
              <View className="rounded-xl bg-bg-raised px-4 py-3">
                <TextInput
                  placeholder={t('account.namePlaceholder')}
                  placeholderTextColor="#8E8EA0"
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  className="font-body-regular text-body-md text-content-primary"
                />
              </View>
              <RNText className="text-body-xs text-content-tertiary text-right">{t('common.characters', { current: name.length, max: 20 })}</RNText>
            </View>

            <View className="gap-2">
              <RNText className="text-body-md font-body-bold text-content-primary">{t('account.type')}</RNText>
              <View className="flex-row gap-3">
                <Pressable onPress={() => setType('bank')} className="flex-1">
                  <View
                    className={cn('p-3 rounded-xl items-center', type !== 'bank' && 'bg-bg-raised')}
                    style={type === 'bank' ? { backgroundColor: theme.colors.primaryLight } : undefined}
                  >
                    <Ionicons
                      name="card"
                      size={24}
                      color={type === 'bank' ? theme.colors.primary : '#8E8EA0'}
                    />
                    <RNText
                      className="text-body-xs mt-1"
                      style={{ color: type === 'bank' ? theme.colors.primary : '#8E8EA0' }}
                    >
                      {t('account.bank')}
                    </RNText>
                  </View>
                </Pressable>
                <Pressable onPress={() => setType('cash')} className="flex-1">
                  <View
                    className={cn('p-3 rounded-xl items-center', type !== 'cash' && 'bg-bg-raised')}
                    style={type === 'cash' ? { backgroundColor: theme.colors.secondaryLight } : undefined}
                  >
                    <Ionicons
                      name="cash"
                      size={24}
                      color={type === 'cash' ? theme.colors.secondary : '#8E8EA0'}
                    />
                    <RNText
                      className="text-body-xs mt-1"
                      style={{ color: type === 'cash' ? theme.colors.secondary : '#8E8EA0' }}
                    >
                      {t('account.cash')}
                    </RNText>
                  </View>
                </Pressable>
              </View>
            </View>

            <View className="gap-2">
              <RNText className="text-body-md font-body-bold text-content-primary">{t('account.icon')}</RNText>
              <View className="flex-row flex-wrap gap-2">
                {ACCOUNT_ICONS.map((item) => (
                  <Pressable key={item.icon} onPress={() => setIcon(item.icon)}>
                    <View
                      className={cn('w-12 h-12 rounded-xl items-center justify-center', icon !== item.icon && 'bg-bg-raised')}
                      style={icon === item.icon ? { backgroundColor: theme.colors.primaryLight } : undefined}
                    >
                      <Ionicons
                        name={item.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={icon === item.icon ? theme.colors.primary : '#8E8EA0'}
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="gap-2">
              <RNText className="text-body-md font-body-bold text-content-primary">{t('account.initialBalance', { currency: currency.code })}</RNText>
              <View className="rounded-xl bg-bg-raised px-4 py-3">
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#8E8EA0"
                  keyboardType="decimal-pad"
                  value={balance}
                  onChangeText={(text) => setBalance(formatAmountInput(text))}
                  className="font-body-regular text-body-md text-content-primary"
                />
              </View>
            </View>
          </View>
          </KeyboardAwareScrollView>
        </AlertDialogBody>
        <AlertDialogFooter>
          <GhostButton label={t('common.cancel')} onPress={handleClose} disabled={isCreating} compact />
          <PrimaryButton
            label={isCreating ? t('account.creating') : t('account.create')}
            onPress={handleCreate}
            disabled={!name.trim() || isCreating}
            compact
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
