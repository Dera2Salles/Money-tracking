import { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Href, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PlanificationCard } from '@/components/PlanificationCard';
import { ValidatePlanificationDialog } from '@/components/ValidatePlanificationDialog';
import { usePlanifications, useBalance, useAccounts, useTips, useGamification } from '@/hooks';
import { useTheme } from '@/contexts';
import { usePostHog } from 'posthog-react-native';
import { PremiumCard, PrimaryButton, SecondaryButton, PremiumInput, EmptyState, Divider } from '@/components/premium';
import { cn } from '@/lib/utils';
import type { PlanificationWithTotal } from '@/types';

function formatDate(dateStr: string, locale: string = 'fr-FR'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

export default function PlanificationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { balance, refresh: refreshBalance } = useBalance();
  const { accounts, refresh: refreshAccounts, formatMoney } = useAccounts();
  const {
    planifications,
    createPlanification,
    deletePlanification,
    validatePlanification,
    checkExpiredPlanifications,
    refresh,
    isLoading,
  } = usePlanifications();
  const { currentTip, showTip } = useTips('planification');
  const gamification = useGamification();
  const posthog = usePostHog();

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshBalance();
      refreshAccounts();
      checkExpiredPlanifications();
    }, [refresh, refreshBalance, refreshAccounts, checkExpiredPlanifications])
  );

  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PlanificationWithTotal | null>(null);
  const [validateTarget, setValidateTarget] = useState<PlanificationWithTotal | null>(null);

  const pendingPlanifications = planifications.filter((p) => p.status === 'pending');
  const completedPlanifications = planifications.filter((p) => p.status === 'completed');
  const totalPendingExpenses = pendingPlanifications.reduce((sum, p) => sum + (p.total_expenses || 0), 0);
  const totalPendingIncome = pendingPlanifications.reduce((sum, p) => sum + (p.total_income || 0), 0);
  const netImpact = totalPendingExpenses - totalPendingIncome;

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const result = await createPlanification(newTitle.trim(), deadline);
    if (result.success && result.id) {
      posthog.capture('planification_created', {
        has_deadline: !!deadline,
      });
      await gamification.checkDailyChallenge('create_planification');
      setNewTitle('');
      setDeadline(null);
      setShowNewForm(false);
      router.push(`/planification/${result.id}` as Href);
    }
  };

  const handleDateChange = (_: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDeadline(selectedDate);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    posthog.capture('planification_deleted');
    await deletePlanification(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleValidateConfirm = async (planificationId: string, accountId: string) => {
    const result = await validatePlanification(planificationId, accountId);
    if (result.success) {
      posthog.capture('planification_validated');
      await gamification.checkDailyChallenge('check_planification');
      await refreshBalance();
      await refreshAccounts();
    }
    return result;
  };

  return (
    <View className="flex-1 bg-bg-base" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="p-6 gap-6">
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="font-display text-display-md text-content-primary">{t('planification.title')}</Text>
              {!showNewForm && (
                <Pressable onPress={() => setShowNewForm(true)}>
                  <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
                </Pressable>
              )}
            </View>
            {showTip && currentTip && (
              <View className="mt-3 p-3 rounded-xl flex-row items-center gap-2 bg-bg-surface">
                <Ionicons name="bulb" size={16} color={theme.colors.primary} />
                <Text className="flex-1 text-xs text-brand">{t(currentTip)}</Text>
              </View>
            )}
          </View>

          <PremiumCard className="p-4">
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-content-secondary font-body-regular text-body-md">{t('planification.currentBalance')}</Text>
                <Text className="text-content-primary font-ui text-ui-lg">{formatMoney(balance)}</Text>
              </View>
              {(totalPendingExpenses > 0 || totalPendingIncome > 0) && (
                <>
                  {totalPendingExpenses > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-content-secondary font-body-regular text-body-md">{t('planification.plannedExpenses')}</Text>
                      <Text className="font-semibold" style={{ color: '#EF4444' }}>- {formatMoney(totalPendingExpenses)}</Text>
                    </View>
                  )}
                  {totalPendingIncome > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-content-secondary font-body-regular text-body-md">{t('planification.plannedIncome')}</Text>
                      <Text className="font-semibold" style={{ color: '#22C55E' }}>+ {formatMoney(totalPendingIncome)}</Text>
                    </View>
                  )}
                  <Divider />
                  <View className="flex-row justify-between items-center">
                    <Text className="text-content-primary font-ui text-ui-md">{t('planification.balanceAfter')}</Text>
                    <Text
                      className="text-2xl font-bold"
                      style={{ color: balance - netImpact < 0 ? '#EF4444' : theme.colors.primary }}
                    >
                      {formatMoney(balance - netImpact)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </PremiumCard>

          {showNewForm && (
            <PremiumCard className="p-4">
              <View className="gap-3">
                <Text className="text-content-primary font-ui text-ui-lg">{t('planification.new')}</Text>
                <PremiumInput placeholder={t('planification.placeholder')} value={newTitle} onChangeText={setNewTitle} autoFocus />
                <View className="gap-2">
                  <Text className="text-content-secondary text-body-sm">{t('planification.deadlineOptional')}</Text>
                  <Pressable onPress={() => setShowDatePicker(true)} className="p-3 rounded-xl bg-bg-raised">
                    <View className="flex-row gap-2 items-center">
                      <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                      <Text className="text-content-primary flex-1">
                        {deadline ? formatDate(deadline.toISOString(), i18n.language) : t('planification.chooseDate')}
                      </Text>
                      {deadline && (
                        <Pressable onPress={() => setDeadline(null)}>
                          <Ionicons name="close-circle" size={20} color="#8E8EA0" />
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={deadline || new Date()}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={handleDateChange}
                    />
                  )}
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <SecondaryButton label={t('common.cancel')} onPress={() => { setShowNewForm(false); setNewTitle(''); setDeadline(null); }} />
                  </View>
                  <View className="flex-1">
                    <PrimaryButton label={t('planification.create')} onPress={handleCreate} disabled={!newTitle.trim() || isLoading} />
                  </View>
                </View>
              </View>
            </PremiumCard>
          )}

          {pendingPlanifications.length > 0 && (
            <View className="gap-3">
              <Text className="font-ui text-ui-lg text-brand">{t('planification.pending')} ({pendingPlanifications.length})</Text>
              {pendingPlanifications.map((p) => (
                <PlanificationCard
                  key={p.id}
                  planification={p}
                  onPress={() => router.push(`/planification/${p.id}` as Href)}
                  onLongPress={() => setDeleteTarget(p)}
                  onValidate={() => setValidateTarget(p)}
                  onDelete={() => setDeleteTarget(p)}
                  formatMoney={formatMoney}
                />
              ))}
            </View>
          )}

          {completedPlanifications.length > 0 && (
            <View className="gap-3">
              <Text className="font-ui text-ui-lg text-content-secondary">{t('planification.completed')} ({completedPlanifications.length})</Text>
              {completedPlanifications.map((p) => (
                <PlanificationCard key={p.id} planification={p} onPress={() => router.push(`/planification/${p.id}` as Href)} formatMoney={formatMoney} />
              ))}
            </View>
          )}

          {planifications.length === 0 && !showNewForm && (
            <EmptyState
              icon="clipboard-outline"
              title={t('planification.emptyMessage')}
              image={require('@/assets/images/bubule-detente.png')}
              action={<PrimaryButton label={t('planification.createButton')} onPress={() => setShowNewForm(true)} />}
            />
          )}
        </View>
      </ScrollView>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={t('common.delete')}
        message={t('common.deleteItem', { name: deleteTarget?.title })}
        confirmText={t('common.delete')}
        isDestructive
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ValidatePlanificationDialog
        isOpen={!!validateTarget}
        planification={validateTarget}
        accounts={accounts}
        onClose={() => setValidateTarget(null)}
        onValidate={handleValidateConfirm}
        formatMoney={formatMoney}
      />
    </View>
  );
}
