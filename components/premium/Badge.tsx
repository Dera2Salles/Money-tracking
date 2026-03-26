import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

/**
 * Badge — small status indicator with semantic variants.
 * Uses the content hierarchy and semantic colors — no decorative backgrounds.
 */
type BadgeVariant = 'default' | 'brand' | 'success' | 'error' | 'warning' | 'expense' | 'income';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <View
      className={cn(
        'rounded-full items-center justify-center',
        // Variant backgrounds
        {
          'bg-bg-raised':     variant === 'default',
          'bg-brand/10':      variant === 'brand',
          'bg-success-soft':  variant === 'success',
          'bg-error-soft':    variant === 'error',
          'bg-warning-soft':  variant === 'warning',
          'bg-expense-soft':  variant === 'expense',
          'bg-income-soft':   variant === 'income',
        },
        // Size
        {
          'px-2 py-0.5': size === 'sm',
          'px-3 py-1':   size === 'md',
          'px-4 py-1.5': size === 'lg',
        },
        className,
      )}
    >
      <Text
        className={cn(
          'font-ui',
          // Text size per badge size
          { 'text-ui-xs': size === 'sm', 'text-ui-sm': size === 'md', 'text-ui-md': size === 'lg' },
          // Text color per variant
          {
            'text-content-secondary': variant === 'default',
            'text-brand':             variant === 'brand',
            'text-success':           variant === 'success',
            'text-error':             variant === 'error',
            'text-warning':           variant === 'warning',
            'text-expense':           variant === 'expense',
            'text-income':            variant === 'income',
          },
        )}
      >
        {children}
      </Text>
    </View>
  );
}
