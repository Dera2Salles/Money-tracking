import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Text as RNText } from 'react-native';
import { GhostButton, PrimaryButton, DangerButton } from '@/components/premium';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  isDestructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  isDestructive = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <RNText className="font-display text-display-md text-content-primary">{title}</RNText>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <RNText className="text-content-secondary text-body-md">{message}</RNText>
        </AlertDialogBody>
        <AlertDialogFooter>
          <GhostButton label={t('common.cancel')} onPress={onClose} compact />
          {isDestructive ? (
            <DangerButton label={confirmText} onPress={onConfirm} compact />
          ) : (
            <PrimaryButton label={confirmText} onPress={onConfirm} compact />
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
