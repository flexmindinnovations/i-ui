
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string,
 * intelligently merging Tailwind CSS classes to resolve conflicts.
 * This is the equivalent of shadcn's 'cn' helper.
 * @param inputs - A list of class names, arrays, or objects.
 * @returns A merged string of class names.
 */
export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function often used for conditional classes that can be boolean or string.
 * Not directly related to Tailwind class merging itself, but often part of component logic.
 * @param value - The input value (boolean or string).
 * @returns A boolean.
 */
export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === ' ' : value;
}
