import { useCallback, useState } from 'react';
import { View, Pressable, Text as RNText, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { PremiumCard, PrimaryButton, SecondaryButton, FadeIn, Divider } from '@/components/premium';
import { AddItemForm } from '@/components/planification/AddItemForm';
import { ItemList } from '@/components/planification/ItemList';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ValidatePlanificationDialog } from '@/components/ValidatePlanificationDialog';
import { EmptyState } from '@/components/premium';
import { usePlanificationDetail, useBalance, usePlanifications, useAccounts } from '@/hooks';
import { useTheme } from '@/contexts';
import { usePostHog } from 'posthog-react-native';
import { useCurrency } from '@/stores/settingsStore';
import type { TransactionWithCategory } from '@/hooks/useTransactions';

function formatDate(dateStr: string, language: string = 'fr'): string {
  const date = new Date(dateStr);
  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', de: 'de-DE' };
  return date.toLocaleDateString(localeMap[language] || 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isExpired(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

export default function PlanificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const currency = useCurrency();
  const posthog = usePostHog();
  const { balance, refresh: refreshBalance } = useBalance();
  const { accounts, refresh: refreshAccounts, formatMoney } = useAccounts();
  const { validatePlanification, updateDeadline } = usePlanifications();
  const { planification, items, linkedTransactions, total, addItem, removeItem, deleteLinkedTransaction, refresh: refreshDetail, isLoading, isFetching } = usePlanificationDetail(id || null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);

  useFocusEffect(useCallback(() => { refreshDetail(); }, [refreshDetail]));

  const isPending = planification?.status === 'pending';
  const expired = isPending && isExpired(planification?.deadline || null);
  const totalExpenses = items.reduce((sum, item) => item.type !== 'income' ? sum + item.amount : sum, 0);
  const totalIncome = items.reduce((sum, item) => item.type === 'income' ? sum + item.amount : sum, 0);
  const netImpact = totalExpenses - totalIncome;
  const projectedBalance = balance - netImpact;
  const isNegative = projectedBalance < 0;

  const handleDeadlineChange = async (_: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && id && planification) {
      await updateDeadline(id, planification.title, selectedDate);
      await refreshDetail();
    }
  };

  const handleRemoveDeadline = async () => {
    if (id && planification) {
      await updateDeadline(id, planification.title, null);
      await refreshDetail();
    }
  };

  const handleAddItem = async (amount: number, type: string, categoryId: string | null, note: string | null) => {
    await addItem(amount, type as any, categoryId, note);
    posthog.capture('planification_item_added', { item_type: type, has_note: !!note, currency: currency.code });
  };

  const handleValidateConfirm = async (planificationId: string, accountId: string) => {
    const result = await validatePlanification(planificationId, accountId);
    if (result.success) { await refreshBalance(); await refreshAccounts(); router.back(); }
    return result;
  };

  const handleDeleteTransactionConfirm = async () => {
    if (!deleteTransactionId) return;
    posthog.capture('planification_transaction_deleted');
    const result = await deleteLinkedTransaction(deleteTransactionId);
    setDeleteTransactionId(null);
    if (result === 'deleted_planification') { router.replace('/(tabs)/simulation'); return; }
    await refreshBalance();
    await refreshAccounts();
  };

  if (!planification && !isFetching) {
    return (
      <View className="flex-1 bg-bg-base items-center justify-center" style={{ paddingTop: insets.top }}>
        <EmptyState icon="document-text-outline" title={t('planification.notFound')} />
        <SecondaryButton label={t('onboarding.back')} onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-base" style={{ paddingTop: insets.top }}>
      <KeyboardAwareScrollView className="flex-1" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} bottomOffset={20}>
        <View className="p-6 gap-6">
          {/* Header */}
          <FadeIn>
            <View className="flex-row items-center gap-2">
              <Pressable onPress={() => router.back()} className="p-2 -ml-2" hitSlop={8}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
              </Pressable>
              <RNText className="font-display text-display-md text-content-primary flex-1" numberOfLines={1}>
                {planification?.title || t('common.loading')}
              </RNText>
            </View>
          </FadeIn>

          {/* Deadline section (pending only) */}
          {isPending && (
            <FadeIn>
              <PremiumCard className="p-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-3 items-center flex-1">
                    <Ionicons name="calendar-outline" size={20} color={expired ? '#EB5757' : theme.colors.primary} />
                    <View>
                      <RNText className="text-content-tertiary text-body-sm">{t('planification.deadline')}</RNText>
                      {planification?.deadline ? (
                        <RNText className="font-ui text-ui-md" style={{ color: expired ? '#EB5757' : theme.colors.primary }}>
                          {formatDate(planification.deadline, i18n.language)}{expired && ` (${t('planification.expired')})`}
                        </RNText>
                      ) : (
                        <RNText className="text-content-tertiary text-body-md">{t('planification.notDefined')}</RNText>
                      )}
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable onPress={() => setShowDatePicker(true)} className="p-2 rounded-lg bg-bg-raised">
                      <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                    </Pressable>
                    {planification?.deadline && (
                      <Pressable onPress={handleRemoveDeadline} className="p-2 rounded-lg bg-bg-raised">
                        <Ionicons name="close" size={20} color="#8E8EA0" />
                      </Pressable>
                    )}
                  </View>
                </View>
                {showDatePicker && (
                  <DateTimePicker value={planification?.deadline ? new Date(planification.deadline) : new Date()} mode="date" display="default" minimumDate={new Date()} onChange={handleDeadlineChange} />
                )}
              </PremiumCard>
            </FadeIn>
          )}

          {/* Validated status */}
          {!isPending && (
            <PremiumCard className="p-4">
              <View className="flex-row gap-3 items-start">
                <Ionicons name="checkmark-circle" size={20} color="#48BB78" />
                <RNText className="text-content-secondary text-body-md flex-1">{t('planification.validatedMessage')}</RNText>
              </View>
            </PremiumCard>
          )}

          {/* Balance summary */}
          <FadeIn>
            <PremiumCard className="p-4" style={{ backgroundColor: theme.colors.primaryLight }}>
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <RNText className="text-content-secondary text-body-md">{t('planification.currentBalance')}</RNText>
                  <RNText className="font-ui text-ui-md text-content-primary">{formatMoney(balance)}</RNText>
                </View>
                {(totalExpenses > 0 || totalIncome > 0) && isPending && (
                  <>
                    {totalExpenses > 0 && (
                      <View className="flex-row justify-between">
                        <RNText className="text-content-secondary text-body-md">{t('planification.plannedExpenses')}</RNText>
                        <RNText className="font-ui text-ui-md" style={{ color: '#EF4444' }}>- {formatMoney(totalExpenses)}</RNText>
                      </View>
                    )}
                    {totalIncome > 0 && (
                      <View className="flex-row justify-between">
                        <RNText className="text-content-secondary text-body-md">{t('planification.plannedIncome')}</RNText>
                        <RNText className="font-ui text-ui-md" style={{ color: '#22C55E' }}>+ {formatMoney(totalIncome)}</RNText>
                      </View>
                    )}
                    <Divider />
                    <View className="flex-row justify-between items-center">
                      <RNText className="font-ui text-ui-md text-content-primary">{t('planification.balanceAfter')}</RNText>
                      <RNText className="font-display text-display-md" style={{ color: isNegative ? '#EB5757' : theme.colors.primary }}>
                        {formatMoney(projectedBalance)}
                      </RNText>
                    </View>
                    {isNegative && (
                      <View className="flex-row gap-2 items-center">
                        <Ionicons name="warning" size={16} color="#EB5757" />
                        <RNText className="text-body-sm" style={{ color: '#EF4444' }}>{t('planification.negativeWarning')}</RNText>
                      </View>
                    )}
                  </>
                )}
              </View>
            </PremiumCard>
          </FadeIn>

          {/* Add item form (pending only) */}
          {isPending && <AddItemForm isLoading={isLoading} onAddItem={handleAddItem} />}

          {/* Items list */}
          <ItemList
            items={items}
            isPending={isPending}
            linkedTransactions={linkedTransactions}
            formatMoney={formatMoney}
            onDeleteItem={(id) => setDeleteItemId(id)}
            onDeleteTransaction={(id) => setDeleteTransactionId(id)}
          />

          {/* Action buttons (pending with items) */}
          {isPending && items.length > 0 && (
            <View className="gap-3 mt-2">
              <SecondaryButton
                label={t('planification.save')}
                onPress={() => router.back()}
                icon={<Ionicons name="save-outline" size={20} color="#F0F0F5" />}
              />
              <PrimaryButton
                label={t('planification.validateAndDeduct')}
                onPress={() => setShowValidateDialog(true)}
                icon={<Ionicons name="checkmark-circle-outline" size={20} color="white" />}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <ConfirmDialog isOpen={!!deleteItemId} title={t('common.delete')} message={t('planification.deleteItemConfirm')} confirmText={t('common.delete')} isDestructive onClose={() => setDeleteItemId(null)} onConfirm={async () => { if (deleteItemId) { posthog.capture('planification_item_deleted'); await removeItem(deleteItemId); setDeleteItemId(null); } }} />
      <ConfirmDialog isOpen={!!deleteTransactionId} title={t('planification.deleteTransactionConfirm')} message={t('planification.deleteTransactionMessage')} confirmText={t('common.delete')} isDestructive onClose={() => setDeleteTransactionId(null)} onConfirm={handleDeleteTransactionConfirm} />
      <ValidatePlanificationDialog isOpen={showValidateDialog} planification={planification ? { ...planification, total, item_count: items.length } : null} accounts={accounts} onClose={() => setShowValidateDialog(false)} onValidate={handleValidateConfirm} formatMoney={formatMoney} />
    </View>
  );
}
