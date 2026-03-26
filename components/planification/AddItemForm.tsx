import { useState } from 'react';
import { View, Pressable, Text as RNText, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CategoryPicker } from '@/components/CategoryPicker';
import { PremiumCard, PrimaryButton } from '@/components/premium';
import { Divider } from '@/components/premium';
import { useTheme } from '@/contexts';
import { useCurrency } from '@/stores/settingsStore';
import { useCategories, SYSTEM_CATEGORY_INCOME_ID } from '@/hooks';
import { formatAmountInput, parseAmount, getNumericValue } from '@/lib/amountInput';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types';

interface AddItemFormProps {
  isLoading: boolean;
  onAddItem: (amount: number, type: TransactionType, categoryId: string | null, note: string | null) => Promise<void>;
}

export function AddItemForm({ isLoading, onAddItem }: AddItemFormProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currency = useCurrency();
  const { expenseCategories, incomeCategory } = useCategories();

  const [amount, setAmount] = useState('');
  const [itemType, setItemType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const isValid = amount && getNumericValue(amount) > 0;

  const handleSubmit = async () => {
    const numericAmount = getNumericValue(amount);
    if (!numericAmount || numericAmount <= 0) return;
    const finalCategoryId = itemType === 'income' ? SYSTEM_CATEGORY_INCOME_ID : categoryId;
    await onAddItem(parseAmount(amount), itemType, finalCategoryId, note.trim() || null);
    setAmount('');
    setItemType('expense');
    setCategoryId(null);
    setNote('');
  };

  return (
    <View className="gap-4">
      <RNText className="font-ui text-ui-lg text-content-primary">{t('planification.addElement')}</RNText>

      {/* Type selector */}
      <View className="flex-row gap-3">
        <Pressable onPress={() => setItemType('expense')} className="flex-1">
          <View className={cn(
            'py-3 px-4 rounded-xl items-center',
            itemType === 'expense' ? 'bg-expense/10' : 'bg-bg-raised',
          )}>
            <View className="flex-row gap-2 items-center">
              <Ionicons name="arrow-down-circle" size={20} color={itemType === 'expense' ? '#EF4444' : '#8E8EA0'} />
              <RNText className="font-ui text-ui-md" style={{ color: itemType === 'expense' ? '#EF4444' : '#8E8EA0' }}>
                {t('add.expense')}
              </RNText>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => setItemType('income')} className="flex-1">
          <View className={cn(
            'py-3 px-4 rounded-xl items-center',
            itemType === 'income' ? 'bg-success/10' : 'bg-bg-raised',
          )}>
            <View className="flex-row gap-2 items-center">
              <Ionicons name="arrow-up-circle" size={20} color={itemType === 'income' ? '#22C55E' : '#8E8EA0'} />
              <RNText className="font-ui text-ui-md" style={{ color: itemType === 'income' ? '#22C55E' : '#8E8EA0' }}>
                {t('add.income')}
              </RNText>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Amount input */}
      <View className="items-center py-2">
        <RNText className="text-content-tertiary text-body-sm mb-2">{t('planification.amount')} ({currency.code})</RNText>
        <TextInput
          placeholder="0"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={(t) => setAmount(formatAmountInput(t))}
          className="font-display text-display-lg text-content-primary text-center w-48"
          placeholderTextColor="#6E6E7D"
          textAlign="center"
        />
      </View>

      <Divider />

      {/* Category */}
      <View className="gap-2">
        <RNText className="font-ui text-ui-md text-content-primary">{t('add.category')}</RNText>
        {itemType === 'expense' ? (
          <CategoryPicker categories={expenseCategories} selectedId={categoryId} onSelect={setCategoryId} />
        ) : (
          <PremiumCard className="p-3">
            <View className="flex-row gap-3 items-center">
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: incomeCategory?.color || '#22C55E' }}>
                <Ionicons name={(incomeCategory?.icon as keyof typeof Ionicons.glyphMap) || 'trending-up'} size={20} color="white" />
              </View>
              <RNText className="font-ui text-ui-md text-content-primary">{t('add.income')}</RNText>
            </View>
          </PremiumCard>
        )}
      </View>

      {/* Note */}
      <View className="gap-2">
        <RNText className="font-ui text-ui-md text-content-primary">{t('add.noteOptional')}</RNText>
        <View className="rounded-xl bg-bg-raised px-4 py-3">
          <TextInput
            placeholder="Ex: Restaurant..."
            value={note}
            onChangeText={setNote}
            maxLength={20}
            className="font-body-regular text-body-md text-content-primary"
            placeholderTextColor="#6E6E7D"
          />
        </View>
        <RNText className="text-content-tertiary text-body-sm text-right">{t('common.characters', { current: note.length, max: 20 })}</RNText>
      </View>

      {/* Submit */}
      <PrimaryButton
        label={t('planification.add')}
        onPress={handleSubmit}
        disabled={!isValid || isLoading}
        className={itemType === 'income' ? 'bg-success' : ''}
      />
    </View>
  );
}
