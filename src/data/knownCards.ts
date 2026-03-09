import { CardNetwork, CardCategory, BenefitValueType, CreditResetType } from '@/types/cards';

export interface WelcomeOffer {
  /** e.g. "60,000 points" or "$300 cash back" */
  amount: string;
  /** Spend requirement, e.g. "$4,000 in 3 months" */
  spendRequirement?: string;
}

export interface KnownCardInfo {
  name: string;
  issuer: string;
  network: CardNetwork;
  annualFee: number;
  category: CardCategory;
  benefits: KnownBenefitInfo[];
  /** Eligibility rules for signup bonus */
  eligibilityRules?: EligibilityRule[];
  /** Current publicly available welcome offer */
  currentOffer?: WelcomeOffer;
  /** Highest known historical welcome offer */
  highestHistoricalOffer?: WelcomeOffer;
}

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
  /** Cards that conflict (by name). If empty, uses self. */
  conflictCards?: string[];
  /** Months since last bonus to be eligible again */
  cooldownMonths?: number;
  /** Human-readable description */
  description: string;
}

export const knownCards: KnownCardInfo[] = [
  // ==================== CHASE ====================
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    currentOffer: { amount: '60,000 points', spendRequirement: '$4,000 in 3 months' },
    highestHistoricalOffer: { amount: '100,000 points', spendRequirement: '$4,000 in 3 months' },
    benefits: [
      { name: '$50 Hotel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 50, notes: '$50 annual hotel credit through Chase Travel.' },
      { name: 'DoorDash DashPass', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary DashPass membership.' },
      { name: 'DoorDash Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 5, notes: '$5/mo DoorDash credit on restaurants ($60/yr).' },
    ],
    eligibilityRules: [
      { type: 'product-family', conflictCards: ['Chase Sapphire Preferred', 'Chase Sapphire Reserve'], cooldownMonths: 48, description: 'Not eligible if you received a Sapphire bonus in the last 48 months or currently hold any Sapphire card.' },
    ],
  },
  {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 795,
    category: 'travel',
    currentOffer: { amount: '60,000 points', spendRequirement: '$4,000 in 3 months' },
    highestHistoricalOffer: { amount: '100,000 points', spendRequirement: '$4,000 in 3 months' },
    benefits: [
      { name: 'Travel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 300, notes: '$300 annual travel credit, auto-applied to travel purchases.' },
      { name: 'The Edit Hotel Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 250, notes: '$250 Jan–Jun for The Edit by Chase Travel hotel stays (2-night min).' },
      { name: 'The Edit Hotel Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 250, notes: '$250 Jul–Dec for The Edit by Chase Travel hotel stays (2-night min).' },
      { name: 'Dining Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Jan–Jun at Sapphire Reserve Exclusive Tables restaurants.' },
      { name: 'Dining Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Jul–Dec at Sapphire Reserve Exclusive Tables restaurants.' },
      { name: 'StubHub/Viagogo Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Jan–Jun for tickets on StubHub or Viagogo.' },
      { name: 'StubHub/Viagogo Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Jul–Dec for tickets on StubHub or Viagogo.' },
      { name: 'DoorDash Non-Restaurant Promo', creditType: 'monthly', valueType: 'dollar', totalAmount: 20, notes: '2x $10/mo DoorDash non-restaurant promos ($240/yr).' },
      { name: 'DoorDash Restaurant Promo', creditType: 'monthly', valueType: 'dollar', totalAmount: 5, notes: '$5/mo DoorDash restaurant promo ($60/yr).' },
      { name: 'Apple Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 288, notes: '$288 Apple credit (activation required).' },
      { name: 'Peloton Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Peloton membership credit ($120/yr).' },
      { name: 'Lyft Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Lyft in-app credit ($120/yr).' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 120, notes: 'Up to $120 every 4 years.' },
      { name: 'DoorDash DashPass', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary DashPass membership.' },
    ],
    eligibilityRules: [
      { type: 'product-family', conflictCards: ['Chase Sapphire Preferred', 'Chase Sapphire Reserve'], cooldownMonths: 48, description: 'Not eligible if you received a Sapphire bonus in the last 48 months or currently hold any Sapphire card.' },
    ],
  },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    currentOffer: { amount: '$300 cash back', spendRequirement: '$500 in 3 months' },
    highestHistoricalOffer: { amount: '$300 cash back', spendRequirement: '$500 in 3 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the Freedom Unlimited bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    currentOffer: { amount: '$200 cash back', spendRequirement: '$500 in 3 months' },
    highestHistoricalOffer: { amount: '$200 cash back', spendRequirement: '$500 in 3 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the Freedom Flex bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase Freedom Rise',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Chase Ink Business Preferred',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'business',
    currentOffer: { amount: '100,000 points', spendRequirement: '$8,000 in 3 months' },
    highestHistoricalOffer: { amount: '100,000 points', spendRequirement: '$8,000 in 3 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the Ink Business Preferred bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase Ink Business Cash',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'business',
    currentOffer: { amount: '$350 cash back', spendRequirement: '$3,000 in 3 months' },
    highestHistoricalOffer: { amount: '$750 cash back', spendRequirement: '$6,000 in 3 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the Ink Business Cash bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase Ink Business Unlimited',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'business',
    currentOffer: { amount: '$500 cash back', spendRequirement: '$3,000 in 3 months' },
    highestHistoricalOffer: { amount: '$900 cash back', spendRequirement: '$6,000 in 3 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the Ink Business Unlimited bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase Aeroplan',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'airline',
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the Aeroplan bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase British Airways',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'airline',
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the British Airways bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Chase Disney Inspire',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'other',
    benefits: [],
  },
  {
    name: 'Chase Amazon Prime',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Chase Ritz-Carlton',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 550,
    category: 'hotel',
    benefits: [
      { name: 'Airline Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 300, notes: '$300 annual airline credit.' },
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 85000, notes: 'Free night certificate up to 85K points on anniversary.' },
    ],
    eligibilityRules: [
      { type: 'product-family', conflictCards: ['Chase Ritz-Carlton', 'Amex Brilliant'], cooldownMonths: 24, description: 'Subject to Marriott cross-issuer family rules with Amex Marriott cards.' },
    ],
  },

  // ==================== AMERICAN EXPRESS ====================
  {
    name: 'Amex Platinum',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 895,
    category: 'travel',
    currentOffer: { amount: '80,000 points', spendRequirement: '$8,000 in 6 months' },
    highestHistoricalOffer: { amount: '150,000 points', spendRequirement: '$6,000 in 6 months' },
    benefits: [
      { name: 'Uber Cash Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo, $20 in December ($200/yr total).' },
      { name: 'Digital Entertainment Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 25, notes: '$25/mo for Disney+, Hulu, ESPN+, Peacock, NYT, WSJ, YouTube Premium/TV, Paramount+.' },
      { name: 'Saks Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jan–Jun at Saks.' },
      { name: 'Saks Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jul–Dec at Saks.' },
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: 'Select one airline per calendar year.' },
      { name: 'Hotel Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 300, notes: '$300 Jan–Jun for prepaid Fine Hotels + Resorts or Hotel Collection.' },
      { name: 'Hotel Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 300, notes: '$300 Jul–Dec for prepaid Fine Hotels + Resorts or Hotel Collection.' },
      { name: 'Walmart+ Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 12.95, notes: 'Walmart+ membership credit (~$155/yr).' },
      { name: 'Resy Dining Credit', creditType: 'quarterly', valueType: 'dollar', totalAmount: 100, notes: '$100/quarter at Resy-affiliated restaurants ($400/yr).' },
      { name: 'Lululemon Credit', creditType: 'quarterly', valueType: 'dollar', totalAmount: 75, notes: '$75/quarter at Lululemon ($300/yr).' },
      { name: 'CLEAR Plus Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 17.42, notes: 'Monthly CLEAR Plus membership credit (~$209/yr).' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule: not eligible if you have ever received the welcome bonus on this card.' },
    ],
  },
  {
    name: 'Amex Platinum for Schwab',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 895,
    category: 'travel',
    currentOffer: { amount: '80,000 points', spendRequirement: '$6,000 in 6 months' },
    highestHistoricalOffer: { amount: '100,000 points', spendRequirement: '$6,000 in 6 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule. Note: Schwab Platinum is treated as a separate product from the regular Platinum.' },
    ],
  },
  {
    name: 'Amex Platinum for Morgan Stanley',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 895,
    category: 'travel',
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule. Note: Morgan Stanley Platinum is treated as a separate product from the regular Platinum.' },
    ],
  },
  {
    name: 'Amex Gold',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 325,
    category: 'travel',
    currentOffer: { amount: '60,000 points', spendRequirement: '$6,000 in 6 months' },
    highestHistoricalOffer: { amount: '90,000 points', spendRequirement: '$4,000 in 6 months' },
    benefits: [
      { name: 'Uber Cash Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Uber Cash ($120/yr).' },
      { name: 'Dining Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo at Grubhub, Seamless, The Cheesecake Factory, Goldbelly, Wine.com, Five Guys.' },
      { name: 'Dunkin\' Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 7, notes: '$7/mo at Dunkin\' ($84/yr).' },
      { name: 'Resy Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jan–Jun at U.S. Resy restaurants.' },
      { name: 'Resy Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jul–Dec at U.S. Resy restaurants.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule: not eligible if you have ever received the welcome bonus on this card.' },
    ],
  },
  {
    name: 'Amex Green',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 150,
    category: 'travel',
    currentOffer: { amount: '40,000 points', spendRequirement: '$3,000 in 6 months' },
    highestHistoricalOffer: { amount: '60,000 points', spendRequirement: '$3,000 in 6 months' },
    benefits: [
      { name: 'CLEAR Plus Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 189, notes: 'CLEAR Plus membership credit.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule: not eligible if you have ever received the welcome bonus on this card.' },
    ],
  },
  {
    name: 'Amex Business Platinum',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 695,
    category: 'business',
    currentOffer: { amount: '120,000 points', spendRequirement: '$15,000 in 3 months' },
    highestHistoricalOffer: { amount: '170,000 points', spendRequirement: '$15,000 in 3 months' },
    benefits: [
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 airline incidental credit per calendar year.' },
      { name: 'Dell Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jan–Jun Dell credit.' },
      { name: 'Dell Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jul–Dec Dell credit.' },
      { name: 'Adobe Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo Adobe credit (~$180/yr).' },
      { name: 'Indeed Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo Indeed credit (~$180/yr).' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Amex Business Gold',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 375,
    category: 'business',
    currentOffer: { amount: '70,000 points', spendRequirement: '$10,000 in 3 months' },
    highestHistoricalOffer: { amount: '70,000 points', spendRequirement: '$10,000 in 3 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Amex Blue Cash Preferred',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 95,
    category: 'cashback',
    currentOffer: { amount: '$250 cash back', spendRequirement: '$3,000 in 6 months' },
    highestHistoricalOffer: { amount: '$400 cash back', spendRequirement: '$3,000 in 6 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Amex Blue Cash Everyday',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 0,
    category: 'cashback',
    currentOffer: { amount: '$200 cash back', spendRequirement: '$2,000 in 6 months' },
    highestHistoricalOffer: { amount: '$250 cash back', spendRequirement: '$2,000 in 6 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Amex Everyday Preferred',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 95,
    category: 'other',
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Rakuten Amex',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },

  // ==================== HOTEL CARDS ====================
  {
    name: 'Amex Brilliant',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 650,
    category: 'hotel',
    currentOffer: { amount: '85,000 points', spendRequirement: '$6,000 in 6 months' },
    highestHistoricalOffer: { amount: '150,000 points', spendRequirement: '$6,000 in 6 months' },
    benefits: [
      { name: 'Marriott Statement Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 25, notes: '$25/mo at Marriott properties ($300/yr).' },
      { name: '85K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 85000, notes: 'Free night certificate up to 85K points. Awarded on anniversary.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
      { type: 'product-family', conflictCards: ['Amex Brilliant', 'Marriott Bonvoy Boundless', 'Marriott Bonvoy Bountiful', 'Chase Ritz-Carlton'], cooldownMonths: 24, description: 'Marriott cross-issuer family rules: not eligible if you received a bonus on any Marriott co-brand card in the last 24 months.' },
    ],
  },
  {
    name: 'Marriott Bonvoy Boundless',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'hotel',
    currentOffer: { amount: '3 free nights (up to 50K each)', spendRequirement: '$3,000 in 3 months' },
    highestHistoricalOffer: { amount: '5 free nights (up to 50K each)', spendRequirement: '$5,000 in 3 months' },
    benefits: [
      { name: '35K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 35000, notes: 'Free night certificate up to 35K points. Awarded on anniversary.' },
    ],
    eligibilityRules: [
      { type: 'product-family', conflictCards: ['Marriott Bonvoy Boundless', 'Marriott Bonvoy Bountiful', 'Amex Brilliant', 'Chase Ritz-Carlton'], cooldownMonths: 24, description: 'Marriott cross-issuer family rules apply.' },
    ],
  },
  {
    name: 'Marriott Bonvoy Bold',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'hotel',
    benefits: [],
  },
  {
    name: 'Marriott Bonvoy Bountiful',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 250,
    category: 'hotel',
    benefits: [
      { name: '50K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 50000, notes: 'Free night certificate up to 50K points. Awarded on anniversary.' },
    ],
    eligibilityRules: [
      { type: 'product-family', conflictCards: ['Marriott Bonvoy Boundless', 'Marriott Bonvoy Bountiful', 'Amex Brilliant', 'Chase Ritz-Carlton'], cooldownMonths: 24, description: 'Marriott cross-issuer family rules apply.' },
    ],
  },
  {
    name: 'Marriott Bonvoy Business',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 125,
    category: 'hotel',
    benefits: [
      { name: '35K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 35000, notes: 'Free night certificate up to 35K points. Awarded on anniversary.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Hilton Honors Aspire',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 550,
    category: 'hotel',
    currentOffer: { amount: '175,000 points', spendRequirement: '$6,000 in 6 months' },
    highestHistoricalOffer: { amount: '175,000 points', spendRequirement: '$6,000 in 6 months' },
    benefits: [
      { name: 'Hilton Resort Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 per half at Hilton resorts ($200/yr).' },
      { name: 'Hilton Airline Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 airline incidental credit.' },
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Free weekend night certificate at any Hilton property.' },
      { name: 'Diamond Status', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary Hilton Honors Diamond status.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Hilton Honors Surpass',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 150,
    category: 'hotel',
    currentOffer: { amount: '130,000 points', spendRequirement: '$3,000 in 6 months' },
    highestHistoricalOffer: { amount: '150,000 points', spendRequirement: '$3,000 in 6 months' },
    benefits: [
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Free night certificate after $15K spend. Up to 2 per year.' },
      { name: 'Gold Status', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary Hilton Honors Gold status.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Hilton Honors',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 0,
    category: 'hotel',
    currentOffer: { amount: '80,000 points', spendRequirement: '$2,000 in 6 months' },
    highestHistoricalOffer: { amount: '100,000 points', spendRequirement: '$2,000 in 6 months' },
    benefits: [],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'IHG One Rewards Premier',
    issuer: 'Chase',
    network: 'Mastercard',
    annualFee: 99,
    category: 'hotel',
    currentOffer: { amount: '140,000 points', spendRequirement: '$3,000 in 3 months' },
    highestHistoricalOffer: { amount: '175,000 points', spendRequirement: '$3,000 in 3 months' },
    benefits: [
      { name: '40K Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 40000, notes: 'Free night up to 40K points on anniversary.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the IHG Premier bonus in the last 24 months.' },
    ],
  },
  {
    name: 'IHG One Rewards Traveler',
    issuer: 'Chase',
    network: 'Mastercard',
    annualFee: 0,
    category: 'hotel',
    benefits: [],
  },
  {
    name: 'World of Hyatt',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    category: 'hotel',
    currentOffer: { amount: '60,000 points', spendRequirement: '$6,000 in 6 months' },
    highestHistoricalOffer: { amount: '60,000 points', spendRequirement: '$6,000 in 6 months' },
    benefits: [
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 15000, notes: 'Free night at any Category 1-4 Hyatt on anniversary.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the World of Hyatt bonus in the last 24 months.' },
    ],
  },
  {
    name: 'World of Hyatt Business',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 199,
    category: 'hotel',
    benefits: [
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 15000, notes: 'Free night at any Category 1-4 Hyatt on anniversary.' },
    ],
  },
  {
    name: 'Wells Fargo Choice Privileges',
    issuer: 'Wells Fargo',
    network: 'Mastercard',
    annualFee: 0,
    category: 'hotel',
    benefits: [],
  },

  // ==================== AIRLINE CARDS ====================
  {
    name: 'United Explorer',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 150,
    category: 'airline',
    currentOffer: { amount: '60,000 miles', spendRequirement: '$3,000 in 3 months' },
    highestHistoricalOffer: { amount: '70,000 miles', spendRequirement: '$3,000 in 3 months' },
    benefits: [
      { name: 'United Club Passes', creditType: 'annual', valueType: 'certificate', totalAmount: 2, notes: '2 United Club one-time passes per year.' },
      { name: 'United Travel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 United travel credit after $10K spend.' },
      { name: 'United Hotels Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 annually for United Hotels bookings.' },
      { name: 'Rideshare Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 5, notes: '$5/mo rideshare credit ($60/yr).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 per anniversary year on JSX.' },
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 10, notes: '$10/mo Instacart+ credit ($120/yr).' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the United Explorer bonus in the last 24 months or currently hold this card.' },
    ],
  },
  {
    name: 'United Quest',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 350,
    category: 'airline',
    currentOffer: { amount: '70,000 miles', spendRequirement: '$4,000 in 3 months' },
    highestHistoricalOffer: { amount: '80,000 miles', spendRequirement: '$4,000 in 3 months' },
    benefits: [
      { name: 'United Travel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, notes: '$200 United travel credit on each anniversary.' },
      { name: '10K Award Flight Discount', creditType: 'annual', valueType: 'points', totalAmount: 10000, notes: '10,000-mile award flight discount on anniversary.' },
      { name: 'Renowned Hotels Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 150, notes: 'Up to $150 for Renowned Hotels bookings per anniversary year.' },
      { name: 'Rideshare Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 8, notes: '$8/mo Jan–Nov, $12 Dec ($100/yr).' },
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$10 Instacart+ + $5 credit/mo ($180/yr).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 150, notes: 'Up to $150 per anniversary year on JSX.' },
      { name: 'Avis/Budget Rental Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 80, notes: 'Up to $80 for Avis/Budget per anniversary year.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received the United Quest bonus in the last 24 months.' },
    ],
  },
  {
    name: 'United Gateway',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'airline',
    benefits: [],
  },
  {
    name: 'United Club',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 695,
    category: 'airline',
    benefits: [
      { name: 'United Club Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Unlimited United Club lounge access.' },
      { name: 'Renowned Hotels Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, notes: 'Up to $200 for Renowned Hotels per anniversary year.' },
      { name: 'Rideshare Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 12, notes: '$12/mo Jan–Nov, $18 Dec ($150/yr).' },
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 20, notes: '2x $10 Instacart+ credits/mo ($240/yr).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, notes: 'Up to $200 per anniversary year on JSX.' },
      { name: 'Avis/Budget Rental Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 for Avis/Budget per anniversary year.' },
    ],
  },
  {
    name: 'Delta SkyMiles Gold',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 150,
    category: 'airline',
    currentOffer: { amount: '50,000 miles', spendRequirement: '$3,000 in 6 months' },
    highestHistoricalOffer: { amount: '70,000 miles', spendRequirement: '$2,000 in 6 months' },
    benefits: [
      { name: 'Delta Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 Delta flight credit after $10K spend.' },
      { name: 'Delta Stays Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Delta Stays hotel credit.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Delta SkyMiles Platinum',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 350,
    category: 'airline',
    currentOffer: { amount: '60,000 miles', spendRequirement: '$4,000 in 6 months' },
    highestHistoricalOffer: { amount: '90,000 miles', spendRequirement: '$4,000 in 6 months' },
    benefits: [
      { name: 'Delta Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Delta flight credit after $10K spend.' },
      { name: 'Delta Stays Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Delta Stays hotel credit.' },
      { name: 'Resy Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jan–Jun at U.S. Resy restaurants.' },
      { name: 'Resy Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 Jul–Dec at U.S. Resy restaurants.' },
      { name: 'Companion Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Domestic companion certificate after $25K spend.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4.5 years.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Delta SkyMiles Reserve',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 650,
    category: 'airline',
    currentOffer: { amount: '70,000 miles', spendRequirement: '$5,000 in 6 months' },
    highestHistoricalOffer: { amount: '110,000 miles', spendRequirement: '$5,000 in 6 months' },
    benefits: [
      { name: 'Delta Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 Delta flight credit.' },
      { name: 'Delta Stays Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 Delta Stays hotel credit.' },
      { name: 'Resy Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jan–Jun at U.S. Resy restaurants.' },
      { name: 'Resy Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jul–Dec at U.S. Resy restaurants.' },
      { name: 'Companion Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Domestic first class companion certificate.' },
      { name: 'Delta Sky Club Access', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Delta Sky Club access when flying Delta.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4.5 years.' },
    ],
    eligibilityRules: [
      { type: 'once-per-lifetime', description: 'Amex once-per-lifetime rule.' },
    ],
  },
  {
    name: 'Southwest Rapid Rewards Priority',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 229,
    category: 'airline',
    currentOffer: { amount: '50,000 points', spendRequirement: '$1,000 in 3 months' },
    highestHistoricalOffer: { amount: '75,000 points', spendRequirement: '$3,000 in 3 months' },
    benefits: [
      { name: 'Southwest Travel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 75, notes: '$75 Southwest travel credit per anniversary year.' },
      { name: 'Upgraded Boardings', creditType: 'quarterly', valueType: 'certificate', totalAmount: 4, notes: '4 upgraded boardings per year when available.' },
      { name: '7,500 Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 7500, notes: '7,500 anniversary points.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received a Southwest Priority bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Southwest Rapid Rewards Plus',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 99,
    category: 'airline',
    currentOffer: { amount: '50,000 points', spendRequirement: '$1,000 in 3 months' },
    highestHistoricalOffer: { amount: '75,000 points', spendRequirement: '$3,000 in 3 months' },
    benefits: [
      { name: '3,000 Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 3000, notes: '3,000 anniversary points.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received a Southwest Plus bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Southwest Rapid Rewards Premier',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 149,
    category: 'airline',
    currentOffer: { amount: '50,000 points', spendRequirement: '$1,000 in 3 months' },
    highestHistoricalOffer: { amount: '75,000 points', spendRequirement: '$3,000 in 3 months' },
    benefits: [
      { name: '6,000 Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 6000, notes: '6,000 anniversary points.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 24, description: 'Not eligible if you received a Southwest Premier bonus in the last 24 months.' },
    ],
  },
  {
    name: 'Citi AAdvantage Executive',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 595,
    category: 'airline',
    currentOffer: { amount: '70,000 miles', spendRequirement: '$7,000 in 3 months' },
    highestHistoricalOffer: { amount: '70,000 miles', spendRequirement: '$7,000 in 3 months' },
    benefits: [
      { name: 'Admirals Club Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Admirals Club membership for primary + authorized users.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 5 years.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Citi 48-month rule: not eligible if you received any Citi AAdvantage bonus in the last 48 months.' },
    ],
  },
  {
    name: 'Citi AAdvantage Platinum',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 99,
    category: 'airline',
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Citi 48-month rule: not eligible if you received any Citi AAdvantage bonus in the last 48 months.' },
    ],
  },
  {
    name: 'Citi AAdvantage Globe',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 250,
    category: 'airline',
    benefits: [
      { name: 'AAdvantage Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 American Airlines flight discount after $15K spend.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 5 years.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Citi 48-month rule: not eligible if you received any Citi AAdvantage bonus in the last 48 months.' },
    ],
  },
  {
    name: 'BoA Alaska Atmos Ascent',
    issuer: 'Bank of America',
    network: 'Visa',
    annualFee: 95,
    category: 'airline',
    benefits: [
      { name: 'Companion Fare', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Annual companion fare from $122 ($99 + taxes/fees) on Alaska Airlines.' },
    ],
  },
  {
    name: 'BoA Alaska Atmos Summit',
    issuer: 'Bank of America',
    network: 'Visa',
    annualFee: 395,
    category: 'airline',
    benefits: [
      { name: '25K Global Companion Award', creditType: 'annual', valueType: 'certificate', totalAmount: 25000, notes: '25,000-point Global Companion Award on anniversary (no spend required).' },
      { name: '100K Global Companion Award', creditType: 'annual', valueType: 'certificate', totalAmount: 100000, notes: '100,000-point Global Companion Award after $60K spend in anniversary year.' },
      { name: 'Status Points Boost', creditType: 'annual', valueType: 'points', totalAmount: 10000, notes: '10,000 Atmos Rewards status points on anniversary.' },
      { name: 'Alaska Lounge Passes', creditType: 'quarterly', valueType: 'certificate', totalAmount: 2, notes: '2 Alaska Lounge passes per quarter (8/yr).' },
      { name: 'Alaska Wi-Fi Passes', creditType: 'quarterly', valueType: 'certificate', totalAmount: 2, notes: '2 Alaska inflight Wi-Fi passes per quarter (8/yr).' },
    ],
  },
  {
    name: 'BoA Air France KLM',
    issuer: 'Bank of America',
    network: 'Mastercard',
    annualFee: 95,
    category: 'airline',
    benefits: [],
  },
  {
    name: 'BoA Free Spirit',
    issuer: 'Bank of America',
    network: 'Mastercard',
    annualFee: 0,
    category: 'airline',
    benefits: [],
  },
  {
    name: 'JetBlue Plus',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 99,
    category: 'airline',
    benefits: [
      { name: 'Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 5000, notes: '5,000 bonus TrueBlue points on anniversary.' },
    ],
  },
  {
    name: 'Hawaiian Airlines World Elite',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 99,
    category: 'airline',
    benefits: [
      { name: 'Companion Discount', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Annual 50% off companion discount on Hawaiian Airlines.' },
    ],
  },
  {
    name: 'FNBO Amtrak Preferred',
    issuer: 'FNBO',
    network: 'Mastercard',
    annualFee: 79,
    category: 'airline',
    benefits: [],
  },
  {
    name: 'Cardless Qatar Airways Infinite',
    issuer: 'Cardless',
    network: 'Visa',
    annualFee: 299,
    category: 'airline',
    benefits: [],
  },
  {
    name: 'Synchrony Virgin Red Rewards',
    issuer: 'Synchrony',
    network: 'Mastercard',
    annualFee: 0,
    category: 'airline',
    benefits: [],
  },

  // ==================== CAPITAL ONE ====================
  {
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'Visa',
    annualFee: 395,
    category: 'travel',
    benefits: [
      { name: 'Travel Portal Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 300, notes: '$300 credit for Capital One Travel bookings.' },
      { name: '10K Anniversary Bonus Miles', creditType: 'annual', valueType: 'points', totalAmount: 10000, notes: '10,000 bonus miles on anniversary.' },
      { name: 'Priority Pass Lounge Access', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Unlimited Priority Pass lounge access for cardholder + 2 guests.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 every 4 years.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Not eligible if you received a Venture X or Venture bonus in the last 48 months.' },
    ],
  },
  {
    name: 'Capital One Venture',
    issuer: 'Capital One',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    benefits: [],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Not eligible if you received a Venture or Venture X bonus in the last 48 months.' },
    ],
  },
  {
    name: 'Capital One VentureOne',
    issuer: 'Capital One',
    network: 'Visa',
    annualFee: 0,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'Capital One Savor',
    issuer: 'Capital One',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Capital One Quicksilver',
    issuer: 'Capital One',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },

  // ==================== CITI ====================
  {
    name: 'Citi Strata Premier',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 95,
    category: 'travel',
    benefits: [
      { name: 'Hotel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 annual hotel credit through Citi Travel portal.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Citi 48-month rule: not eligible if you received any ThankYou card bonus in the last 48 months.' },
    ],
  },
  {
    name: 'Citi Strata Elite',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 595,
    category: 'travel',
    benefits: [
      { name: 'Hotel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 300, notes: '$300 off a hotel stay of 2+ nights via Citi Travel.' },
      { name: 'Splurge Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 annual credit at 1stDibs, AA, Best Buy, Future, Live Nation.' },
      { name: 'Blacklane Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jan–Jun Blacklane chauffeur credit.' },
      { name: 'Blacklane Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jul–Dec Blacklane chauffeur credit.' },
      { name: 'Admirals Club Passes', creditType: 'annual', valueType: 'certificate', totalAmount: 4, notes: '4 Admirals Club 24-hour passes per year.' },
    ],
    eligibilityRules: [
      { type: 'same-card-bonus', cooldownMonths: 48, description: 'Citi 48-month rule.' },
    ],
  },
  {
    name: 'Citi Strata',
    issuer: 'Citi',
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
    name: 'Citi Custom Cash',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },

  // ==================== WELLS FARGO ====================
  {
    name: 'Wells Fargo Autograph',
    issuer: 'Wells Fargo',
    network: 'Visa',
    annualFee: 0,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'Wells Fargo Autograph Journey',
    issuer: 'Wells Fargo',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    benefits: [
      { name: 'Airline Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 50, notes: '$50 annual airline incidental credit.' },
    ],
  },
  {
    name: 'Wells Fargo Premier Autograph',
    issuer: 'Wells Fargo',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'Wells Fargo Active Cash',
    issuer: 'Wells Fargo',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },

  // ==================== BILT ====================
  {
    name: 'Bilt Blue',
    issuer: 'Bilt (Cardless)',
    network: 'Mastercard',
    annualFee: 0,
    category: 'other',
    benefits: [],
  },
  {
    name: 'Bilt Obsidian',
    issuer: 'Bilt (Cardless)',
    network: 'Mastercard',
    annualFee: 95,
    category: 'other',
    benefits: [
      { name: 'Hotel Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 semi-annual Bilt Travel portal hotel credit ($100/yr).' },
    ],
  },
  {
    name: 'Bilt Palladium',
    issuer: 'Bilt (Cardless)',
    network: 'Mastercard',
    annualFee: 495,
    category: 'travel',
    benefits: [
      { name: 'Hotel Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 200, notes: '$200 semi-annual Bilt Travel portal hotel credit ($400/yr).' },
      { name: 'Annual Bilt Cash', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 in Bilt Cash annually.' },
    ],
  },

  // ==================== US BANK ====================
  {
    name: 'U.S. Bank Smartly',
    issuer: 'U.S. Bank',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'U.S. Bank Altitude Connect',
    issuer: 'U.S. Bank',
    network: 'Visa',
    annualFee: 0,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'U.S. Bank Altitude Go',
    issuer: 'U.S. Bank',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },

  // ==================== BANK OF AMERICA ====================
  {
    name: 'Bank of America Premium Rewards Elite',
    issuer: 'Bank of America',
    network: 'Visa',
    annualFee: 550,
    category: 'travel',
    benefits: [
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 300, notes: '$300 annual airline incidental credit.' },
      { name: 'Lifestyle Credit', creditType: 'quarterly', valueType: 'dollar', totalAmount: 75, notes: '$75/quarter for select lifestyle purchases ($300/yr).' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
  },
  {
    name: 'Bank of America Premium Rewards',
    issuer: 'Bank of America',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    benefits: [
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 annual airline incidental credit.' },
    ],
  },
  {
    name: 'Bank of America Customized Cash Rewards',
    issuer: 'Bank of America',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Bank of America Unlimited Cash Rewards',
    issuer: 'Bank of America',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },

  // ==================== BARCLAYS ====================
  {
    name: 'Barclays Arrival Plus',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 95,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'Luxury Card Gold',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 1199,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'Luxury Card Black',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 699,
    category: 'travel',
    benefits: [],
  },
  {
    name: 'Luxury Card Titanium',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 299,
    category: 'travel',
    benefits: [],
  },

  // ==================== DISCOVER ====================
  {
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    network: 'Discover',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Discover it Miles',
    issuer: 'Discover',
    network: 'Discover',
    annualFee: 0,
    category: 'travel',
    benefits: [],
  },

  // ==================== OTHER ====================
  {
    name: 'Robinhood Platinum',
    issuer: 'Robinhood',
    network: 'Visa',
    annualFee: 695,
    category: 'travel',
    benefits: [
      { name: 'Hotel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 500, notes: '$500 annual hotel credit (booked through Robinhood app).' },
      { name: 'Travel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 300, notes: '$300 annual travel credit.' },
      { name: 'DoorDash Discount', creditType: 'annual', valueType: 'dollar', totalAmount: 250, notes: '$250 annual DoorDash discount.' },
      { name: 'Restaurant Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 250, notes: '$250 annual credit at 15,000+ eligible restaurants.' },
      { name: 'Autonomous Rides Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 250, notes: '$250 annual credit on autonomous rides.' },
      { name: 'Wearables Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 annual credit toward wearables (Apple Watch, Garmin, etc.).' },
      { name: 'DashPass Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary DashPass membership ($120/yr value).' },
      { name: 'Priority Pass Lounge Access', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Unlimited Priority Pass lounge access.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Global Entry or TSA PreCheck credit.' },
      { name: 'Oura Ring Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary Oura Ring membership.' },
      { name: 'Function Health Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Function Health membership ($365/yr value).' },
      { name: 'Amazon One Medical', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Amazon One Medical membership ($199/yr value).' },
    ],
  },
  {
    name: 'SoFi Smart Card',
    issuer: 'SoFi',
    network: 'Mastercard',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Coinbase One Card',
    issuer: 'Coinbase',
    network: 'Amex',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Shop Your Way 5321',
    issuer: 'Synchrony',
    network: 'Visa',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
];

export function findKnownCard(name: string): KnownCardInfo | undefined {
  const lower = name.toLowerCase();
  return knownCards.find(c => c.name.toLowerCase() === lower);
}
