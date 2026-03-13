import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useOnboarding } from '@/hooks';
import { useTheme } from '@/contexts';
import { usePostHog } from 'posthog-react-native';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { useEffectiveColorScheme } from '@/components/ui/gluestack-ui-provider';
import { getDarkModeColors } from '@/constants/darkMode';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { PressableScale } from '@/components/onboarding/PressableScale';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const effectiveScheme = useEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  const colors = getDarkModeColors(isDark);
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
      className="flex-1 bg-background-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <Box className="flex-1 p-6">
        <ProgressBar step={8} totalSteps={8} />

        <VStack space="md" className="mb-4">
          <Heading size="xl" className="text-typography-900">
            {t('onboarding.chooseCategories')}
          </Heading>
          <Text className="text-typography-600">
            {t('onboarding.categoriesDescription')}
          </Text>
        </VStack>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <VStack space="sm">
            {categories.map((category) => {
              const isSelected = selectedCategories.has(category.id);
              return (
                <PressableScale
                  key={category.id}
                  onPress={() => toggleCategory(category.id)}
                >
                  <HStack
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: isSelected ? theme.colors.primaryLight : colors.chipBg,
                    }}
                    space="md"
                  >
                    <Box
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <Ionicons
                        name={category.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={category.color}
                      />
                    </Box>
                    <VStack className="flex-1 justify-center">
                      <Text className="font-semibold text-typography-900">
                        {defaultCategoryIds.has(category.id) ? t(`categories.${category.id}`) : category.name}
                      </Text>
                    </VStack>
                    <Box
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? theme.colors.primary : (isDark ? '#3A3A3C' : '#E5E5EA'),
                      }}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </Box>
                  </HStack>
                </PressableScale>
              );
            })}
          </VStack>
        </ScrollView>

        <Button
          size="xl"
          className="w-full mt-4"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={handleFinish}
          isDisabled={isLoading || selectedCategories.size === 0}
        >
          <ButtonText className="text-white">{isLoading ? t('common.loading') : t('onboarding.finish')}</ButtonText>
        </Button>
      </Box>
    </View>
  );
}
