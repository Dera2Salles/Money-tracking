import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, ScrollView, Text as RNText } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@/hooks';
import { useTheme } from '@/contexts';
import { usePostHog } from 'posthog-react-native';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { PressableScale } from '@/components/onboarding/PressableScale';
import { PrimaryButton } from '@/components/premium';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { bankBalance, cashBalance } = useLocalSearchParams<{ bankBalance: string; cashBalance: string }>();
  const { saveOnboardingData, isLoading, categories } = useOnboarding();
  const posthog = usePostHog();

  const defaultCategoryIds = new Set(DEFAULT_CATEGORIES.map((c) => c.id));

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );

  const toggleCategory = (id: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCategories(newSelected);
  };

  const handleFinish = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await saveOnboardingData({
      bankBalance: bankBalance || '0',
      cashBalance: cashBalance || '0',
      selectedCategories,
    });

    if (success) {
      posthog.capture('onboarding_completed', {
        categories_selected: selectedCategories.size,
      });
      router.replace('/add');
    }
  };

  return (
    <View
      className="flex-1 bg-bg-base"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 p-6">
        <ProgressBar step={8} totalSteps={8} />

        <View className="gap-3 mb-4">
          <RNText className="font-display text-display-xl text-content-primary">
            {t('onboarding.chooseCategories')}
          </RNText>
          <RNText className="font-body-regular text-body-lg text-content-secondary">
            {t('onboarding.categoriesDescription')}
          </RNText>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategories.has(category.id);
              return (
                <PressableScale
                  key={category.id}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View
                    className="flex-row p-4 rounded-xl gap-3 items-center"
                    style={{
                      backgroundColor: isSelected ? theme.colors.primary + '15' : '#F2F2F6',
                    }}
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <Ionicons
                        name={category.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={category.color}
                      />
                    </View>
                    <View className="flex-1 justify-center">
                      <RNText className="font-ui text-ui-md text-content-primary">
                        {defaultCategoryIds.has(category.id) ? t(`categories.${category.id}`) : category.name}
                      </RNText>
                    </View>
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? theme.colors.primary : '#E5E5EA',
                      }}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </ScrollView>

        <PrimaryButton
          label={isLoading ? t('common.loading') : t('onboarding.finish')}
          onPress={handleFinish}
          disabled={isLoading || selectedCategories.size === 0}
        />
      </View>
    </View>
  );
}
