import React, { useState, useEffect } from 'react';
import { EaseView } from 'react-native-ease';
import { useReducedMotion } from 'react-native-reanimated';
import { cn } from '@/lib/utils';

/**
 * Staggered entrance animation — each item fades/slides in
 * with a slight delay based on its index.
 *
 * Usage:
 *   {items.map((item, i) => (
 *     <StaggerItem key={item.id} index={i} className="mb-3">
 *       <TransactionCard ... />
 *     </StaggerItem>
 *   ))}
 */
interface StaggerItemProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  /** Delay between each item in ms (default: 50) */
  staggerDelay?: number;
}

export function StaggerItem({
  index,
  children,
  className = '',
  staggerDelay = 50,
}: StaggerItemProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(reducedMotion ?? false);

  useEffect(() => {
    if (reducedMotion) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), index * staggerDelay);
    return () => clearTimeout(t);
  }, [index, staggerDelay, reducedMotion]);

  if (reducedMotion) {
    return <EaseView className={className}>{children}</EaseView>;
  }

  return (
    <EaseView
      className={cn(className)}
      animate={{
        opacity: ready ? 1 : 0,
        translateY: ready ? 0 : 10,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 180,
        mass: 1,
      }}
    >
      {children}
    </EaseView>
  );
}

/**
 * Fade-in wrapper — single element entrance animation.
 * Use for hero sections, headings, standalone elements.
 */
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** 'up' | 'down' | 'none' — slide direction (default: 'up') */
  direction?: 'up' | 'down' | 'none';
}

export function FadeIn({
  children,
  className = '',
  direction = 'up',
}: FadeInProps) {
  const reducedMotion = useReducedMotion();

  const translateY = direction === 'up' ? 12 : direction === 'down' ? -12 : 0;

  if (reducedMotion) {
    return <EaseView className={className}>{children}</EaseView>;
  }

  return (
    <EaseView
      className={cn(className)}
      initialAnimate={{
        opacity: 0,
        ...(translateY !== 0 && { translateY }),
      }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'spring',
        damping: 22,
        stiffness: 120,
        mass: 1,
      }}
    >
      {children}
    </EaseView>
  );
}
