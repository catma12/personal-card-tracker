import { CardNetwork, CardCategory, BenefitValueType, CreditResetType } from '@/types/cards';

export interface KnownCardInfo {
  name: string;
  issuer: string;
  network: CardNetwork;
  annualFee: number;
  category: CardCategory;
  benefits: KnownBenefitInfo[];
}

export interface KnownBenefitInfo {
  name: string;
  creditType: CreditResetType;
  valueType: BenefitValueType;
  totalAmount: number;
  notes: string;
}

export const knownCards: KnownCardInfo[] = [
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    benefits: [
      { name: '$50 Hotel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 50, notes: '$50 annual hotel credit through Chase Travel.' },
    ],
  },
  {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 795,
    category: 'travel',
    benefits: [
      { name: 'Travel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 300, notes: '$300 annual travel credit, resets on card anniversary.' },
    ],
  },
  {
    name: 'Amex Platinum',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 895,
    category: 'travel',
    benefits: [
      { name: 'Uber Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo, $35 in December.' },
      { name: 'Digital Entertainment Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 20, notes: 'Audible, Disney+, Peacock, ESPN+, etc.' },
      { name: 'Saks Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jan–Jun at Saks.' },
      { name: 'Saks Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jul–Dec at Saks.' },
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: 'Select one airline per calendar year.' },
      { name: 'Hotel Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 per half for prepaid Fine Hotels + Resorts or Hotel Collection.' },
      { name: 'Walmart+ Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 12.95, notes: 'Walmart+ membership credit.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
  },
  {
    name: 'Amex Gold',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 325,
    category: 'travel',
    benefits: [
      { name: 'Uber Cash Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Uber Cash.' },
      { name: 'Dining Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: 'Grubhub, Seamless, The Cheesecake Factory, etc.' },
      { name: 'Dunkin\' Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 7, notes: '$7/mo at Dunkin\'.' },
    ],
  },
  {
    name: 'Amex Brilliant',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 650,
    category: 'hotel',
    benefits: [
      { name: 'Marriott Statement Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 25, notes: '$25/mo at Marriott properties.' },
      { name: '85K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 85000, notes: 'Free night certificate up to 85K points. Awarded on anniversary.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
  },
  {
    name: 'Marriott Bonvoy Boundless',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'hotel',
    benefits: [
      { name: '35K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 35000, notes: 'Free night certificate up to 35K points. Awarded on anniversary.' },
    ],
  },
  {
    name: 'United Explorer',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'airline',
    benefits: [
      { name: 'United Club Passes', creditType: 'annual', valueType: 'certificate', totalAmount: 2, notes: '2 United Club one-time passes per year.' },
    ],
  },
  {
    name: 'United Quest',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 250,
    category: 'airline',
    benefits: [
      { name: 'United Purchase Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 125, notes: '$125 back on United purchases.' },
      { name: '5K Award Miles Back', creditType: 'annual', valueType: 'points', totalAmount: 5000, notes: '5,000 miles back on saver award flights, up to 2x/year.' },
    ],
  },
  {
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'Visa',
    annualFee: 395,
    category: 'travel',
    benefits: [
      { name: 'Travel Portal Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 300, notes: '$300 credit for Capital One Travel bookings.' },
      { name: '10K Anniversary Bonus Miles', creditType: 'annual', valueType: 'points', totalAmount: 10000, notes: '10,000 bonus miles on anniversary.' },
    ],
  },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Citi Double Cash',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Amex Blue Cash Preferred',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 95,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Hilton Honors Aspire',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 550,
    category: 'hotel',
    benefits: [
      { name: 'Hilton Resort Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 per half at Hilton resorts.' },
      { name: 'Hilton Airline Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 airline incidental credit.' },
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Free weekend night certificate at any Hilton property.' },
      { name: 'Diamond Status', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary Hilton Honors Diamond status.' },
    ],
  },
  {
    name: 'IHG One Rewards Premier',
    issuer: 'Chase',
    network: 'Mastercard',
    annualFee: 99,
    category: 'hotel',
    benefits: [
      { name: '40K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 40000, notes: 'Free night up to 40K points on anniversary.' },
    ],
  },
  {
    name: 'World of Hyatt',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'hotel',
    benefits: [
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 15000, notes: 'Free night at any Category 1-4 Hyatt on anniversary.' },
    ],
  },
];

export function findKnownCard(name: string): KnownCardInfo | undefined {
  const lower = name.toLowerCase();
  return knownCards.find(c => c.name.toLowerCase() === lower);
}
