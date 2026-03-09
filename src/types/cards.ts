export type CardNetwork = 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
export type CardType = 'personal' | 'business';
export type CardStatus = 'active' | 'closed';
export type CardCategory = 'travel' | 'hotel' | 'airline' | 'cashback' | 'business' | 'other';
export type CardDecision = 'keep' | 'downgrade' | 'cancel' | 'undecided';

export type CreditResetType = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'anniversary-year' | 'one-time';

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  network: CardNetwork;
  openDate: string; // ISO date
  productChangeDate?: string;
  cardType: CardType;
  status: CardStatus;
  annualFee: number;
  annualFeeMonth: number; // 1-12
  lastAnnualFeeDate?: string;
  countsToward524: boolean;
  signupBonusDate?: string;
  category: CardCategory;
  decision: CardDecision;
  tags: string[];
  notes: string;
}

export type BenefitValueType = 'dollar' | 'points' | 'certificate';

export interface CardBenefit {
  id: string;
  cardId: string;
  name: string;
  creditType: CreditResetType;
  valueType: BenefitValueType;
  totalAmount: number;
  amountUsed: number;
  resetDate?: string;
  expirationDate?: string;
  lastUsedDate?: string;
  notes: string;
}

export interface AppSettings {
  reminderDays: number;
  defaultHideBusiness: boolean;
  dateFormat: string;
  customTags: string[];
}

export interface Chase524Entry {
  card: CreditCard;
  dropOffDate: Date;
}
