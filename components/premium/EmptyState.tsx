import React from 'react';
import { View, Text } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn } from './StaggerItem';
import { cn } from '@/lib/utils';

/**
 * Empty State — replaces plain centered text with a designed state.
 * Icon + title + optional description + optional action.
 * Pass `image` to show a mascot instead of the icon.
 */
interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
  image?: ImageSource;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  image,
  className = '',
}: EmptyStateProps) {
  return (
    <FadeIn className={cn('items-center justify-center px-8 py-12', className)}>
      {image ? (
        <Image source={image} style={{ width: 110, height: 110, alignSelf: 'center', marginBottom: 12 }} contentFit="contain" />
      ) : (
        <View className="bg-bg-raised rounded-full p-4 mb-4">
          <Ionicons name={icon} size={28} color="#9C9CA8" />
        </View>
      )}
      <Text className="font-ui text-ui-lg text-content-primary text-center mb-1">
        {title}
      </Text>
      {description && (
        <Text className="font-body-regular text-body-md text-content-secondary text-center max-w-[280px]">
          {description}
        </Text>
      )}
      {action && <View className="mt-4">{action}</View>}
    </FadeIn>
  );
}
