import React from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

/**
 * Divider — thin horizontal line using border-divider token.
 * The ONLY place borders are allowed in the design system (besides input focus).
 */
interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return (
    <View className={cn('h-px bg-border-divider', className)} />
  );
}
