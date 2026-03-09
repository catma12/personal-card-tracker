import { CreditCard, CardBenefit, AppSettings } from '@/types/cards';

const today = new Date();
const year = today.getFullYear();

function d(y: number, m: number, day: number) {
  return new Date(y, m - 1, day).toISOString().split('T')[0];
}

export const sampleCards: CreditCard[] = [];
export const sampleBenefits: CardBenefit[] = [];

export const defaultSettings: AppSettings = {
  reminderDays: 30,
  defaultHideBusiness: false,
  dateFormat: 'MM/dd/yyyy',
  customTags: ['travel', 'hotel', 'airline', 'cashback', 'business', 'dining', 'groceries', 'lounge', 'premium', 'points', 'united', 'marriott'],
};
