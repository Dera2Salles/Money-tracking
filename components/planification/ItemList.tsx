import { View, Pressable, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { PremiumCard, EmptyState, StaggerItem } from '@/components/premium';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { TransactionWithCategory } from '@/hooks/useTransactions';
import type { PlanificationItemWithCategory } from '@/types';

const DEFAULT_CATEGORY_IDS = DEFAULT_CATEGORIES.map((c) => c.id);

interface ItemListProps {
  items: PlanificationItemWithCategory[];
  isPending: boolean;
  linkedTransactions: TransactionWithCategory[];
  formatMoney: (amount: number) => string;
  onDeleteItem: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
}

function getCategoryName(categoryId: string | null, categoryName: string | null, t: any) {
  if (!categoryId) return t('common.noCategory');
  if (categoryId === 'system-income') return t('add.income');
  if (DEFAULT_CATEGORY_IDS.includes(categoryId)) return t(`categories.${categoryId}`);
  return categoryName || t('common.noCategory');
}

interface DisplayableItem {
  id: string;
  type: string;
  amount: number;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
  note: string | null;
}

function ItemRow({ item, formatMoney, onDelete, t }: {
  item: DisplayableItem;
  formatMoney: (n: number) => string;
  onDelete: () => void;
  t: any;
}) {
  const isIncome = item.type === 'income';
  return (
    <PremiumCard className="p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-3 items-center flex-1">
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: item.category_color || '#94A3B8' }}>
            {item.category_icon && <Ionicons name={item.category_icon as keyof typeof Ionicons.glyphMap} size={20} color="white" />}
          </View>
          <View className="flex-1">
            <RNText className="font-ui text-ui-md text-content-primary">{getCategoryName(item.category_id, item.category_name, t)}</RNText>
            {item.note && <RNText className="text-content-tertiary text-body-sm" numberOfLines={1}>{item.note}</RNText>}
          </View>
        </View>
        <View className="flex-row gap-3 items-center">
          <RNText className="font-ui text-ui-md" style={{ color: isIncome ? '#22C55E' : '#EF4444' }}>
            {isIncome ? '+' : '-'}{formatMoney(item.amount)}
          </RNText>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="close-circle" size={22} color="#EB5757" />
          </Pressable>
        </View>
      </View>
    </PremiumCard>
  );
}

export function ItemList({ items, isPending, linkedTransactions, formatMoney, onDeleteItem, onDeleteTransaction }: ItemListProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Linked transactions (validated planification) */}
      {!isPending && linkedTransactions.length > 0 && (
        <View className="gap-3">
          <RNText className="font-ui text-ui-lg text-content-primary">
            {t('planification.linkedTransactions')} ({linkedTransactions.length})
          </RNText>
          {linkedTransactions.map((tx, i) => (
            <StaggerItem key={tx.id} index={i}>
              <ItemRow item={tx} formatMoney={formatMoney} onDelete={() => onDeleteTransaction(tx.id)} t={t} />
            </StaggerItem>
          ))}
        </View>
      )}

      {/* Pending items */}
      {isPending && items.length > 0 && (
        <View className="gap-3">
          <RNText className="font-ui text-ui-lg text-content-primary">
            {t('planification.elements', { count: items.length })}
          </RNText>
          {items.map((item, i) => (
            <StaggerItem key={item.id} index={i}>
              <ItemRow item={item} formatMoney={formatMoney} onDelete={() => onDeleteItem(item.id)} t={t} />
            </StaggerItem>
          ))}
        </View>
      )}

      {/* Empty state */}
      {items.length === 0 && isPending && (
        <EmptyState icon="list-outline" title={t('planification.addElementsHint')} />
      )}
    </>
  );
}
