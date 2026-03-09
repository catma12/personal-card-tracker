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
      { name: 'Uber Cash Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo, $20 in December ($200/yr total).' },
      { name: 'Digital Entertainment Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 25, notes: '$25/mo for Disney+, Hulu, ESPN+, Peacock, NYT, WSJ, YouTube Premium/TV, Paramount+.' },
      { name: 'Saks Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jan–Jun at Saks.' },
      { name: 'Saks Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jul–Dec at Saks.' },
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: 'Select one airline per calendar year.' },
      { name: 'Hotel Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 300, notes: '$300 Jan–Jun for prepaid Fine Hotels + Resorts (1-night) or Hotel Collection (2-night).' },
      { name: 'Hotel Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 300, notes: '$300 Jul–Dec for prepaid Fine Hotels + Resorts (1-night) or Hotel Collection (2-night).' },
      { name: 'Walmart+ Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 12.95, notes: 'Walmart+ membership credit (~$155/yr).' },
      { name: 'Resy Dining Credit', creditType: 'quarterly', valueType: 'dollar', totalAmount: 100, notes: '$100/quarter at Resy-affiliated restaurants ($400/yr).' },
      { name: 'Lululemon Credit', creditType: 'quarterly', valueType: 'dollar', totalAmount: 75, notes: '$75/quarter at Lululemon ($300/yr).' },
      { name: 'CLEAR Plus Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 17.42, notes: 'Monthly CLEAR Plus membership credit (~$209/yr).' },
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
      { name: 'Uber Cash Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Uber Cash ($120/yr).' },
      { name: 'Dining Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo at Grubhub, Seamless, The Cheesecake Factory, etc.' },
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
      { name: 'Marriott Statement Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 25, notes: '$25/mo at Marriott properties ($300/yr).' },
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
    annualFee: 150,
    category: 'airline',
    benefits: [
      { name: 'United Club Passes', creditType: 'annual', valueType: 'certificate', totalAmount: 2, notes: '2 United Club one-time passes per year (cannot be shared).' },
      { name: 'United Travel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 United travel credit after $10K spend in a calendar year.' },
      { name: 'United Hotels Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 annually ($50 for first and second prepaid United Hotels bookings).' },
      { name: 'Rideshare Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 5, notes: '$5/mo rideshare credit ($60/yr; enrollment required).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 per anniversary year on JSX bookings.' },
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Instacart+ credit ($120/yr; ends Dec 2027).' },
    ],
  },
  {
    name: 'United Quest',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 350,
    category: 'airline',
    benefits: [
      { name: 'United Travel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, notes: '$200 United travel credit on each account anniversary.' },
      { name: '10K Award Flight Discount', creditType: 'annual', valueType: 'points', totalAmount: 10000, notes: '10,000-mile award flight discount on anniversary; earn a second after $20K spend.' },
      { name: 'Renowned Hotels Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 150, notes: 'Up to $150 for prepaid Renowned Hotels and Resorts bookings per anniversary year.' },
      { name: 'Rideshare Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 8, notes: '$8/mo Jan–Nov, $12 in Dec ($100/yr; enrollment required).' },
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$10 Instacart+ credit + $5 Instacart credit per month ($180/yr; ends Dec 2027).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 150, notes: 'Up to $150 per anniversary year on JSX bookings.' },
      { name: 'Avis/Budget Rental Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 80, notes: 'Up to $80 in United TravelBank credits for Avis/Budget rentals per anniversary year.' },
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
      { name: 'Hilton Resort Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 per half at Hilton resorts ($200/yr).' },
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
