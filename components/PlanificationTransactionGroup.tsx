import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/currency';
import { useCurrencyCode } from '@/stores/settingsStore';
import { useTheme } from '@/contexts';
import type { TransactionWithCategory } from '@/hooks/useTransactions';

export interface PlanificationGroupData {
  planification_id: string;
  planification_title: string;
  transactions: TransactionWithCategory[];
}

interface PlanificationTransactionGroupProps {
  group: PlanificationGroupData;
  onLongPress?: () => void;
}

export function PlanificationTransactionGroup({ group, onLongPress }: PlanificationTransactionGroupProps) {
  const currencyCode = useCurrencyCode();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const totalAmount = group.transactions.reduce((sum, tx) => {
    return tx.type === 'expense' ? sum + tx.amount : sum - tx.amount;
  }, 0);

  const expenseCount = group.transactions.filter((tx) => tx.type === 'expense').length;
  const incomeCount = group.transactions.filter((tx) => tx.type === 'income').length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Pressable
      onPress={() => router.push(`/planification/${group.planification_id}`)}
      onLongPress={onLongPress}
    >
      <Box className="bg-background-0 p-4 rounded-xl border border-outline-100">
        <HStack space="md" className="items-center">
          <Box
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.colors.primary + '20' }}
          >
            <Ionicons name="layers" size={24} color={theme.colors.primary} />
          </Box>

          <VStack className="flex-1" space="xs">
            <Text className="font-semibold text-typography-900" numberOfLines={1}>
              {group.planification_title}
            </Text>
            <Text className="text-typography-500 text-sm">
              {t('planification.transactionCount', { count: group.transactions.length })}
            </Text>
            {group.transactions.length > 0 && (
              <Text className="text-typography-400 text-xs">
                {formatTime(group.transactions[0].created_at)}
              </Text>
            )}
          </VStack>

          <VStack className="items-end" space="xs">
            {expenseCount > 0 && (
              <Text className="font-bold text-error-600">
                -{formatCurrency(group.transactions.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0), currencyCode)}
              </Text>
            )}
            {incomeCount > 0 && (
              <Text className="font-bold text-success-600">
                +{formatCurrency(group.transactions.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0), currencyCode)}
              </Text>
            )}
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
}
