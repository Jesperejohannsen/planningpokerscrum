import type { CardValue } from '../types';

/**
 * Available voting card values
 */
export const CARD_VALUES: readonly CardValue[] = [
  '0',
  '1', 
  '2',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '?',
  '☕'
] as const;

export default CARD_VALUES;