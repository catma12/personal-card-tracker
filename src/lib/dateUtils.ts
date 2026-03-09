import { CreditCard, CardBenefit, Chase524Entry } from '@/types/cards';
import { addMonths, differenceInDays, format, isAfter, isBefore, startOfMonth, endOfMonth, addDays } from 'date-fns';

export function getChase524Cards(cards: CreditCard[]): Chase524Entry[] {
  const cutoff = addMonths(new Date(), -24);
  return cards
    .filter(c => c.cardType === 'personal' && c.countsToward524 && c.status === 'active')
    .filter(c => isAfter(new Date(c.openDate), cutoff))
    .map(c => ({
      card: c,
      dropOffDate: addMonths(new Date(c.openDate), 24),
    }))
    .sort((a, b) => a.dropOffDate.getTime() - b.dropOffDate.getTime());
}

export function getChase524Count(cards: CreditCard[]): number {
  return getChase524Cards(cards).length;
}

export function getNextAnnualFee(cards: CreditCard[]): CreditCard | null {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const activeCards = cards.filter(c => c.status === 'active' && c.annualFee > 0);

  const upcoming = activeCards
    .map(c => {
      let feeMonth = c.annualFeeMonth;
      let feeDate: Date;
      if (feeMonth >= currentMonth) {
        feeDate = new Date(today.getFullYear(), feeMonth - 1, 1);
      } else {
        feeDate = new Date(today.getFullYear() + 1, feeMonth - 1, 1);
      }
      return { card: c, feeDate };
    })
    .sort((a, b) => a.feeDate.getTime() - b.feeDate.getTime());

  return upcoming[0]?.card || null;
}

export function getMonthlyCreditsAvailable(benefits: CardBenefit[]): number {
  return benefits
    .filter(b => b.creditType === 'monthly' && b.valueType === 'dollar')
    .reduce((sum, b) => sum + b.totalAmount, 0);
}

export function getMonthlyCreditsUnused(benefits: CardBenefit[]): number {
  return benefits
    .filter(b => b.creditType === 'monthly' && b.valueType === 'dollar')
    .reduce((sum, b) => sum + Math.max(0, b.totalAmount - b.amountUsed), 0);
}

export function getUnusedCreditsThisYear(benefits: CardBenefit[]): number {
  return benefits
    .filter(b => b.valueType === 'dollar')
    .reduce((sum, b) => sum + Math.max(0, b.totalAmount - b.amountUsed), 0);
}

export function getBenefitStatus(b: CardBenefit): 'fully-used' | 'partially-used' | 'unused' | 'expiring-soon' {
  const remaining = b.totalAmount - b.amountUsed;
  if (remaining <= 0) return 'fully-used';

  if (b.expirationDate) {
    const daysUntil = differenceInDays(new Date(b.expirationDate), new Date());
    if (daysUntil <= 7 && remaining > 0) return 'expiring-soon';
  }

  if (b.amountUsed > 0) return 'partially-used';
  return 'unused';
}

export function getExpiringBenefits(benefits: CardBenefit[], days: number): CardBenefit[] {
  const cutoff = addDays(new Date(), days);
  return benefits.filter(b => {
    if (!b.expirationDate) return false;
    const exp = new Date(b.expirationDate);
    return isBefore(exp, cutoff) && isAfter(exp, new Date()) && b.amountUsed < b.totalAmount;
  });
}

export function getUpcomingAnnualFees(cards: CreditCard[], days: number): CreditCard[] {
  const today = new Date();
  const cutoff = addDays(today, days);
  return cards.filter(c => {
    if (c.status !== 'active' || c.annualFee === 0) return false;
    const feeDate = new Date(today.getFullYear(), c.annualFeeMonth - 1, 1);
    const feeDateNext = new Date(today.getFullYear() + 1, c.annualFeeMonth - 1, 1);
    return (isAfter(feeDate, today) && isBefore(feeDate, cutoff)) ||
           (isAfter(feeDateNext, today) && isBefore(feeDateNext, cutoff));
  });
}

export function formatDate(date: string | Date, fmt: string = 'MMM d, yyyy'): string {
  return format(new Date(date), fmt);
}

export function getMonthName(month: number): string {
  return format(new Date(2024, month - 1, 1), 'MMMM');
}
