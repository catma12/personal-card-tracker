import { CreditCard, CardBenefit, AppSettings } from '@/types/cards';

const today = new Date();
const year = today.getFullYear();

function d(y: number, m: number, day: number) {
  return new Date(y, m - 1, day).toISOString().split('T')[0];
}

export const sampleCards: CreditCard[] = [
  {
    id: 'csp',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'Visa',
    cardType: 'personal',
    status: 'active',
    openDate: d(year - 2, 3, 15),
    annualFee: 95,
    annualFeeMonth: 3,
    lastAnnualFeeDate: d(year, 3, 1),
    countsToward524: true,
    signupBonusDate: d(year - 2, 6, 20),
    category: 'travel',
    decision: 'keep',
    tags: ['travel', 'points'],
    notes: 'Primary travel card. Transfer partners: Hyatt, United, Southwest.',
  },
  {
    id: 'csr',
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    network: 'Visa',
    cardType: 'personal',
    status: 'active',
    openDate: d(year - 1, 8, 10),
    annualFee: 795,
    annualFeeMonth: 8,
    countsToward524: true,
    category: 'travel',
    decision: 'keep',
    tags: ['travel', 'lounge'],
    notes: '$300 travel credit, Priority Pass lounge access. AF increased to $795 in June 2025.',
  },
  {
    id: 'amex-plat',
    name: 'Amex Platinum',
    issuer: 'American Express',
    network: 'Amex',
    cardType: 'personal',
    status: 'active',
    openDate: d(year - 1, 1, 5),
    annualFee: 895,
    annualFeeMonth: 1,
    lastAnnualFeeDate: d(year, 1, 5),
    countsToward524: true,
    signupBonusDate: d(year - 1, 4, 15),
    category: 'travel',
    decision: 'undecided',
    tags: ['travel', 'lounge', 'premium'],
    notes: 'Centurion Lounge, multiple credits to maximize. AF increased to $895 in Jan 2026.',
  },
  {
    id: 'amex-gold',
    name: 'Amex Gold',
    issuer: 'American Express',
    network: 'Amex',
    cardType: 'personal',
    status: 'active',
    openDate: d(year - 1, 5, 20),
    annualFee: 325,
    annualFeeMonth: 5,
    countsToward524: true,
    category: 'travel',
    decision: 'keep',
    tags: ['dining', 'groceries'],
    notes: '4x dining, 4x groceries. $10/mo Uber, $10/mo dining, $7/mo Dunkin credits.',
  },
  {
    id: 'marriott-boundless',
    name: 'Marriott Bonvoy Boundless',
    issuer: 'Chase',
    network: 'Visa',
    cardType: 'personal',
    status: 'active',
    openDate: d(year, 1, 12),
    annualFee: 95,
    annualFeeMonth: 1,
    countsToward524: true,
    category: 'hotel',
    decision: 'undecided',
    tags: ['hotel', 'marriott'],
    notes: '35K Free Night Certificate on anniversary.',
  },
  {
    id: 'united-explorer',
    name: 'United Explorer',
    issuer: 'Chase',
    network: 'Visa',
    cardType: 'personal',
    status: 'active',
    openDate: d(year - 3, 9, 1),
    annualFee: 150,
    annualFeeMonth: 9,
    countsToward524: true,
    category: 'airline',
    decision: 'downgrade',
    tags: ['airline', 'united'],
    notes: 'AF increased to $150. Free checked bag, 2 United Club passes, rideshare & Instacart credits.',
  },
  {
    id: 'united-quest',
    name: 'United Quest',
    issuer: 'Chase',
    network: 'Visa',
    cardType: 'personal',
    status: 'active',
    openDate: d(year - 1, 11, 3),
    annualFee: 350,
    annualFeeMonth: 11,
    countsToward524: true,
    category: 'airline',
    decision: 'keep',
    tags: ['airline', 'united'],
    notes: 'AF increased to $350. $200 United travel credit, 10K award flight discount, rideshare & Instacart credits.',
  },
  {
    id: 'venture-x',
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'Visa',
    cardType: 'personal',
    status: 'active',
    openDate: d(year, 2, 1),
    annualFee: 395,
    annualFeeMonth: 2,
    countsToward524: true,
    category: 'travel',
    decision: 'keep',
    tags: ['travel', 'lounge'],
    notes: '$300 travel portal credit, 10K anniversary miles, Cap One Lounge.',
  },
];

export const sampleBenefits: CardBenefit[] = [
  // Amex Platinum credits (updated Jan 2026)
  {
    id: 'b1', cardId: 'amex-plat', name: 'Uber Cash Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 15, amountUsed: 15,
    lastUsedDate: d(year, today.getMonth() + 1, 5), notes: '$15/mo, $20 in December ($200/yr total).',
  },
  {
    id: 'b2', cardId: 'amex-plat', name: 'Digital Entertainment Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 25, amountUsed: 25,
    lastUsedDate: d(year, today.getMonth() + 1, 1), notes: '$25/mo for Disney+, Hulu, ESPN+, Peacock, NYT, WSJ, YouTube Premium/TV, Paramount+.',
  },
  {
    id: 'b3', cardId: 'amex-plat', name: 'Saks Credit (H1)',
    creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, amountUsed: 0,
    expirationDate: d(year, 6, 30), notes: '$50 Jan–Jun at Saks.',
  },
  {
    id: 'b4', cardId: 'amex-plat', name: 'Airline Incidental Credit',
    creditType: 'annual', valueType: 'dollar', totalAmount: 200, amountUsed: 75,
    resetDate: d(year, 1, 1), notes: 'Select one airline per calendar year.',
  },
  {
    id: 'b5', cardId: 'amex-plat', name: 'Global Entry / TSA PreCheck Credit',
    creditType: 'one-time', valueType: 'dollar', totalAmount: 100, amountUsed: 100,
    lastUsedDate: d(year - 1, 6, 15), notes: 'Every 4 years. Used for Global Entry.',
  },
  {
    id: 'b5b', cardId: 'amex-plat', name: 'Walmart+ Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 12.95, amountUsed: 12.95,
    lastUsedDate: d(year, today.getMonth() + 1, 1), notes: 'Walmart+ membership credit (~$155/yr).',
  },
  {
    id: 'b5c', cardId: 'amex-plat', name: 'Hotel Credit (H1)',
    creditType: 'semi-annual', valueType: 'dollar', totalAmount: 300, amountUsed: 0,
    expirationDate: d(year, 6, 30), notes: '$300 Jan–Jun for prepaid Fine Hotels + Resorts (1-night) or Hotel Collection (2-night).',
  },
  {
    id: 'b5d', cardId: 'amex-plat', name: 'Hotel Credit (H2)',
    creditType: 'semi-annual', valueType: 'dollar', totalAmount: 300, amountUsed: 0,
    expirationDate: d(year, 12, 31), notes: '$300 Jul–Dec for prepaid Fine Hotels + Resorts (1-night) or Hotel Collection (2-night).',
  },
  {
    id: 'b5e', cardId: 'amex-plat', name: 'Resy Dining Credit',
    creditType: 'quarterly', valueType: 'dollar', totalAmount: 100, amountUsed: 0,
    notes: '$100/quarter at Resy-affiliated restaurants ($400/yr).',
  },
  {
    id: 'b5f', cardId: 'amex-plat', name: 'Lululemon Credit',
    creditType: 'quarterly', valueType: 'dollar', totalAmount: 75, amountUsed: 0,
    notes: '$75/quarter at Lululemon ($300/yr).',
  },
  {
    id: 'b5g', cardId: 'amex-plat', name: 'CLEAR Plus Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 17.42, amountUsed: 17.42,
    lastUsedDate: d(year, today.getMonth() + 1, 1), notes: 'Monthly CLEAR Plus membership credit (~$209/yr).',
  },
  // Amex Gold
  {
    id: 'b6', cardId: 'amex-gold', name: 'Uber Cash Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 10, amountUsed: 0,
    notes: '$10/mo Uber Cash ($120/yr).',
  },
  {
    id: 'b7', cardId: 'amex-gold', name: 'Dining Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 10, amountUsed: 10,
    lastUsedDate: d(year, today.getMonth() + 1, 12), notes: '$10/mo at Grubhub, Seamless, The Cheesecake Factory, etc.',
  },
  {
    id: 'b7b', cardId: 'amex-gold', name: 'Dunkin\' Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 7, amountUsed: 0,
    notes: '$7/mo at Dunkin\'.',
  },
  // Chase Sapphire Reserve
  {
    id: 'b8', cardId: 'csr', name: 'Travel Credit',
    creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 300, amountUsed: 180,
    notes: '$300 annual travel credit, resets on card anniversary.',
  },
  // Chase Sapphire Preferred
  {
    id: 'b8b', cardId: 'csp', name: '$50 Hotel Credit',
    creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 50, amountUsed: 0,
    notes: '$50 annual hotel credit through Chase Travel.',
  },
  // Marriott Boundless
  {
    id: 'b9', cardId: 'marriott-boundless', name: '35K Free Night Certificate',
    creditType: 'annual', valueType: 'certificate', totalAmount: 35000, amountUsed: 0,
    expirationDate: d(year, 12, 31),
    notes: 'Free night certificate up to 35K points. Awarded on anniversary.',
  },
  // United Quest (updated 2025)
  {
    id: 'b10', cardId: 'united-quest', name: 'United Travel Credit',
    creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, amountUsed: 0,
    notes: '$200 United travel credit on each account anniversary.',
  },
  {
    id: 'b10b', cardId: 'united-quest', name: '10K Award Flight Discount',
    creditType: 'annual', valueType: 'points', totalAmount: 10000, amountUsed: 0,
    notes: '10,000-mile award flight discount on anniversary; earn a second after $20K spend.',
  },
  {
    id: 'b10c2', cardId: 'united-quest', name: 'Rideshare Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 8, amountUsed: 0,
    notes: '$8/mo Jan–Nov, $12 in Dec ($100/yr; enrollment required).',
  },
  {
    id: 'b10c3', cardId: 'united-quest', name: 'Renowned Hotels Credit',
    creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 150, amountUsed: 0,
    notes: 'Up to $150 for prepaid Renowned Hotels and Resorts bookings per anniversary year.',
  },
  {
    id: 'b10c4', cardId: 'united-quest', name: 'Instacart+ Credits',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 15, amountUsed: 0,
    notes: '$10 Instacart+ + $5 Instacart credit per month ($180/yr; ends Dec 2027).',
  },
  // United Explorer (updated 2025)
  {
    id: 'b10c', cardId: 'united-explorer', name: 'United Club Passes',
    creditType: 'annual', valueType: 'certificate', totalAmount: 2, amountUsed: 0,
    notes: '2 United Club one-time passes per year (cannot be shared).',
  },
  {
    id: 'b10d', cardId: 'united-explorer', name: 'Rideshare Credit',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 5, amountUsed: 0,
    notes: '$5/mo rideshare credit ($60/yr; enrollment required).',
  },
  {
    id: 'b10e', cardId: 'united-explorer', name: 'Instacart+ Credits',
    creditType: 'monthly', valueType: 'dollar', totalAmount: 10, amountUsed: 0,
    notes: '$10/mo Instacart+ credit ($120/yr; ends Dec 2027).',
  },
  // Venture X
  {
    id: 'b11', cardId: 'venture-x', name: 'Travel Portal Credit',
    creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 300, amountUsed: 0,
    notes: '$300 credit for Capital One Travel bookings.',
  },
  {
    id: 'b12', cardId: 'venture-x', name: '10K Anniversary Bonus Miles',
    creditType: 'annual', valueType: 'points', totalAmount: 10000, amountUsed: 0,
    notes: '10,000 bonus miles on anniversary.',
  },
];

export const defaultSettings: AppSettings = {
  reminderDays: 30,
  defaultHideBusiness: false,
  dateFormat: 'MM/dd/yyyy',
  customTags: ['travel', 'hotel', 'airline', 'cashback', 'business', 'dining', 'groceries', 'lounge', 'premium', 'points', 'united', 'marriott'],
};
