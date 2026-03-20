import React from 'react';
import { EaseView } from 'react-native-ease';
import { cn } from '@/lib/utils';

/**
 * Skeleton loader — looping shimmer via EaseView.
 * Replaces ActivityIndicator for all loading states.
 *
 * Usage:
 *   <Skeleton className="h-6 w-48" />           // text line
 *   <Skeleton className="h-4 w-full" />          // full-width line
 *   <Skeleton className="h-12 w-12 rounded-full" /> // avatar
 */
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <EaseView
      className={cn('bg-bg-raised rounded-xl', className)}
      initialAnimate={{ opacity: 0.4 }}
      animate={{ opacity: 0.85 }}
      transition={{
        type: 'timing',
        duration: 900,
        easing: 'easeInOut',
        loop: 'reverse',
      }}
    />
  );
}

/**
 * Pre-built skeleton patterns for common layouts.
 */

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <EaseView
      className={cn('rounded-xl bg-bg-surface p-4', className)}
      initialAnimate={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300, easing: 'easeOut' }}
    >
      <Skeleton className="h-5 w-32 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </EaseView>
  );
}

export function SkeletonTransactionItem({ className = '' }: SkeletonProps) {
  return (
    <EaseView
      className={cn('flex-row items-center gap-3 px-4 py-3', className)}
      initialAnimate={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300, easing: 'easeOut' }}
    >
      <Skeleton className="h-10 w-10 rounded-full" />
      <EaseView className="flex-1 gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </EaseView>
      <Skeleton className="h-5 w-16" />
    </EaseView>
  );
}
