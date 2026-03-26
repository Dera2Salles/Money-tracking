import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conflict resolution.
 * Use this for conditional className composition on all components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
