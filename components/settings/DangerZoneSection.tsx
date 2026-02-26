import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { SettingSection } from './SettingSection';

interface DangerZoneSectionProps {
  onReset: () => void;
}

export function DangerZoneSection({ onReset }: DangerZoneSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingSection title={t('settings.dangerZone')}>
      <Pressable onPress={onReset}>
        <HStack className="px-4 py-3.5 justify-between items-center">
          <HStack className="items-center" space="sm">
            <Ionicons name="refresh-circle" size={20} color="#DC2626" />
            <Text style={{ color: '#DC2626' }} className="font-medium">
              {t('settings.resetApp')}
            </Text>
          </HStack>
          <Ionicons name="chevron-forward" size={18} color="#DC2626" />
        </HStack>
      </Pressable>
    </SettingSection>
  );
}
