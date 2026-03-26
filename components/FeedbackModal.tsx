import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { Text as RNText } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { GhostButton, PrimaryButton } from '@/components/premium';
import { useTheme } from '@/contexts';
import { SUPABASE_URL, SUPABASE_ANON_KEY, APP_VERSION, PROJECT_NAME } from '@/constants/app';
import { checkInternetConnection } from '@/lib/network';

const MAX_MESSAGE_LENGTH = 500;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setMessage('');
    setEmail('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setError(t('errors.noInternet'));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || null,
          app_version: APP_VERSION,
          device_platform: Platform.OS,
          project: PROJECT_NAME,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch {
      setError(t('feedback.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <View className="flex-row gap-3 items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.colors.primaryLight }}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.primary} />
            </View>
            <RNText className="font-display text-display-md text-content-primary">{t('feedback.modalTitle')}</RNText>
          </View>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bottomOffset={20}
            style={{ maxHeight: 350 }}
          >
            <View className="gap-4">
              <View className="gap-2">
                <RNText className="font-semibold text-content-primary">{t('feedback.messageLabel')}</RNText>
                <View className="rounded-xl bg-bg-raised px-4 py-3">
                  <TextInput
                    placeholder={t('feedback.messagePlaceholder')}
                    placeholderTextColor="#8E8EA0"
                    value={message}
                    onChangeText={setMessage}
                    maxLength={MAX_MESSAGE_LENGTH}
                    multiline
                    numberOfLines={4}
                    className="font-body-regular text-body-md text-content-primary"
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                  />
                </View>
                <RNText className="text-xs text-right text-content-tertiary">
                  {t('common.characters', { current: message.length, max: MAX_MESSAGE_LENGTH })}
                </RNText>
              </View>

              <View className="gap-2">
                <RNText className="font-semibold text-content-primary">{t('feedback.emailLabel')}</RNText>
                <View className="rounded-xl bg-bg-raised px-4 py-3">
                  <TextInput
                    placeholder={t('feedback.emailPlaceholder')}
                    placeholderTextColor="#8E8EA0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="font-body-regular text-body-md text-content-primary"
                  />
                </View>
              </View>

              <View className="flex-row gap-2 items-center">
                <Ionicons name="wifi" size={14} color="#8E8EA0" />
                <RNText className="text-xs text-content-tertiary">{t('feedback.requiresInternet')}</RNText>
              </View>

              {success && (
                <View className="p-3 rounded-xl bg-success/10">
                  <View className="flex-row gap-2 items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                    <RNText className="font-semibold text-success">{t('feedback.successMessage')}</RNText>
                  </View>
                </View>
              )}

              {error && (
                <View className="p-3 rounded-xl bg-error/10">
                  <View className="flex-row gap-2 items-center">
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <RNText className="font-semibold text-error">{error}</RNText>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </AlertDialogBody>
        <AlertDialogFooter>
          <GhostButton label={t('common.cancel')} onPress={handleClose} disabled={isSubmitting} compact />
          <PrimaryButton
            label={isSubmitting ? t('feedback.sending') : t('feedback.send')}
            onPress={handleSubmit}
            disabled={!message.trim() || isSubmitting}
            compact
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
