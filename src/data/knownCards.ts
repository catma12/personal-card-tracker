import { CardNetwork, CardCategory, BenefitValueType, CreditResetType } from '@/types/cards';

export interface WelcomeOffer {
  amount: string;
  spendRequirement?: string;
}

export interface KnownCardInfo {
  name: string;
  issuer: string;
  network: CardNetwork;
  annualFee: number;
  category: CardCategory;
  benefits: KnownBenefitInfo[];
  eligibilityRules?: EligibilityRule[];
  currentOffer?: WelcomeOffer;
  highestHistoricalOffer?: WelcomeOffer;
  applyUrl?: string;
}

export const OFFER_DATA_LAST_UPDATED = '2026-03-09';

export interface KnownBenefitInfo {
  name: string;
  creditType: CreditResetType;
  valueType: BenefitValueType;
  totalAmount: number;
  notes: string;
}

export type EligibilityRuleType = 'same-card-bonus' | 'product-family' | 'velocity' | 'once-per-lifetime' | 'card-count';

export interface EligibilityRule {
  type: EligibilityRuleType;
  conflictCards?: string[];
  cooldownMonths?: number;
  description: string;
}

export const knownCards: KnownCardInfo[] = [];

export function findKnownCard(name: string): KnownCardInfo | undefined {
  const lower = name.toLowerCase();
  return knownCards.find(c => c.name.toLowerCase() === lower);
}
