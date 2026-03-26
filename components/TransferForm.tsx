import { View, ScrollView, Pressable, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts';
import { cn } from '@/lib/utils';
import type { AccountWithBalance } from '@/types';

interface TransferFormProps {
  accounts: AccountWithBalance[];
  fromAccountId: string | null;
  toAccountId: string | null;
  onFromChange: (id: string | null) => void;
  onToChange: (id: string | null) => void;
}

export function TransferForm({
  accounts,
  fromAccountId,
  toAccountId,
  onFromChange,
  onToChange,
}: TransferFormProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const getAccountName = (account: AccountWithBalance) => {
    if (account.is_default === 1) {
      return account.type === 'bank' ? t('account.defaultBank') : t('account.defaultCash');
    }
    return account.name;
  };

  const renderAccountButton = (
    account: AccountWithBalance,
    isSelected: boolean,
    isDisabled: boolean,
    onPress: () => void
  ) => {
    const color = account.type === 'bank' ? theme.colors.primary : theme.colors.secondary;
    return (
      <Pressable key={account.id} onPress={onPress} disabled={isDisabled} style={{ opacity: isDisabled ? 0.4 : 1 }}>
        <View
          className={cn('py-3 px-4 rounded-xl items-center', !isSelected && 'bg-bg-raised')}
          style={isSelected ? { backgroundColor: color, minWidth: 120 } : { minWidth: 120 }}
        >
          <View className="flex-row gap-2 items-center">
            <Ionicons
              name={(account.type === 'bank' ? 'card' : 'cash') as keyof typeof Ionicons.glyphMap}
              size={18}
              color={isSelected ? 'white' : color}
            />
            <RNText className="font-ui text-ui-md" style={{ color: isSelected ? 'white' : color }}>
              {getAccountName(account)}
            </RNText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <View className="gap-2">
        <RNText className="font-ui text-ui-md text-content-primary">{t('add.from')}</RNText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {accounts.map((account) =>
            renderAccountButton(
              account,
              fromAccountId === account.id,
              toAccountId === account.id,
              () => onFromChange(fromAccountId === account.id ? null : account.id)
            )
          )}
        </ScrollView>
      </View>

      <View className="gap-2">
        <RNText className="font-ui text-ui-md text-content-primary">{t('add.to')}</RNText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {accounts.map((account) =>
            renderAccountButton(
              account,
              toAccountId === account.id,
              fromAccountId === account.id,
              () => onToChange(toAccountId === account.id ? null : account.id)
            )
          )}
        </ScrollView>
      </View>
    </>
  );
}
