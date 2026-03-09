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
  // ==================== CHASE ====================
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
    benefits: [],
  },
  {
    name: 'Chase Ink Business Cash',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'business',
    benefits: [],
  },
  {
    name: 'Chase Ink Business Unlimited',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 0,
    category: 'business',
    benefits: [],
  },

  // ==================== AMERICAN EXPRESS ====================
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
    name: 'Amex Green',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 150,
    category: 'travel',
    benefits: [
      { name: 'LoungeBuddy Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 annual LoungeBuddy credit.' },
      { name: 'CLEAR Plus Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 189, notes: 'CLEAR Plus membership credit.' },
    ],
  },
  {
    name: 'Amex Business Platinum',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 695,
    category: 'business',
    benefits: [
      { name: 'Airline Incidental Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 airline incidental credit per calendar year.' },
      { name: 'Dell Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jan–Jun Dell credit.' },
      { name: 'Dell Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jul–Dec Dell credit.' },
      { name: 'Adobe Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo Adobe credit (~$180/yr).' },
      { name: 'Indeed Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$15/mo Indeed credit (~$180/yr).' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
  },
  {
    name: 'Amex Business Gold',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 375,
    category: 'business',
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
    name: 'Amex Blue Cash Everyday',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 0,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Amex Everyday Preferred',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 95,
    category: 'other',
    benefits: [],
  },

  // ==================== HOTEL CARDS ====================
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
    name: 'Hilton Honors Surpass',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 150,
    category: 'hotel',
    benefits: [
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Free night certificate after $15K spend. Up to 2 per year.' },
      { name: 'Gold Status', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Complimentary Hilton Honors Gold status.' },
    ],
  },
  {
    name: 'Hilton Honors',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 0,
    category: 'hotel',
    benefits: [],
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
    benefits: [
      { name: 'Free Night Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 15000, notes: 'Free night at any Category 1-4 Hyatt on anniversary.' },
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

  // ==================== AIRLINE CARDS ====================
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
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 15, notes: '$10 Instacart+ + $5 Instacart credit per month ($180/yr; ends Dec 2027).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 150, notes: 'Up to $150 per anniversary year on JSX bookings.' },
      { name: 'Avis/Budget Rental Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 80, notes: 'Up to $80 in United TravelBank credits for Avis/Budget rentals per anniversary year.' },
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
      { name: 'United Club Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Unlimited United Club lounge access for you, 1 adult guest, and dependent children.' },
      { name: 'Renowned Hotels Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, notes: 'Up to $200 for prepaid Renowned Hotels bookings per anniversary year.' },
      { name: 'Rideshare Credit', creditType: 'monthly', valueType: 'dollar', totalAmount: 12, notes: '$12/mo Jan–Nov, $18 in Dec ($150/yr; enrollment required).' },
      { name: 'Instacart+ Credits', creditType: 'monthly', valueType: 'dollar', totalAmount: 20, notes: '2x $10 Instacart+ credits per month ($240/yr; ends Dec 2027).' },
      { name: 'JSX Charter Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 200, notes: 'Up to $200 per anniversary year on JSX bookings.' },
      { name: 'Avis/Budget Rental Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 100, notes: 'Up to $100 in United TravelBank credits for Avis/Budget per anniversary year.' },
    ],
  },
  {
    name: 'Delta SkyMiles Gold',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 150,
    category: 'airline',
    benefits: [
      { name: 'Delta Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Delta flight credit after $10K spend.' },
    ],
  },
  {
    name: 'Delta SkyMiles Platinum',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 350,
    category: 'airline',
    benefits: [
      { name: 'Delta Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 150, notes: '$150 Delta flight credit after $10K spend.' },
      { name: 'Companion Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Domestic companion certificate after $25K spend.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4.5 years.' },
    ],
  },
  {
    name: 'Delta SkyMiles Reserve',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 650,
    category: 'airline',
    benefits: [
      { name: 'Delta Flight Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 Delta flight credit.' },
      { name: 'Companion Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Domestic first class companion certificate.' },
      { name: 'Delta Sky Club Access', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Delta Sky Club access when flying Delta.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4.5 years.' },
    ],
  },
  {
    name: 'Southwest Rapid Rewards Priority',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 149,
    category: 'airline',
    benefits: [
      { name: 'Southwest Travel Credit', creditType: 'anniversary-year', valueType: 'dollar', totalAmount: 75, notes: '$75 Southwest travel credit per anniversary year.' },
      { name: 'Upgraded Boardings', creditType: 'quarterly', valueType: 'certificate', totalAmount: 4, notes: '4 upgraded boardings per year when available.' },
      { name: '7,500 Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 7500, notes: '7,500 anniversary points each card anniversary.' },
    ],
  },
  {
    name: 'Southwest Rapid Rewards Plus',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 69,
    category: 'airline',
    benefits: [
      { name: '3,000 Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 3000, notes: '3,000 anniversary points each card anniversary.' },
    ],
  },
  {
    name: 'Southwest Rapid Rewards Premier',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 99,
    category: 'airline',
    benefits: [
      { name: '6,000 Anniversary Points', creditType: 'annual', valueType: 'points', totalAmount: 6000, notes: '6,000 anniversary points each card anniversary.' },
    ],
  },
  {
    name: 'AAdvantage Aviator Red',
    issuer: 'Barclays',
    network: 'Mastercard',
    annualFee: 99,
    category: 'airline',
    benefits: [
      { name: 'Companion Certificate', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Domestic companion certificate after $20K spend.' },
    ],
  },
  {
    name: 'Citi AAdvantage Executive',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 595,
    category: 'airline',
    benefits: [
      { name: 'Admirals Club Membership', creditType: 'annual', valueType: 'certificate', totalAmount: 1, notes: 'Admirals Club membership for primary cardholder + authorized users.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 5 years.' },
    ],
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
    ],
  },
  {
    name: 'Capital One Venture',
    issuer: 'Capital One',
    network: 'Visa',
    annualFee: 95,
    category: 'travel',
    benefits: [],
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
    annualFee: 95,
    category: 'cashback',
    benefits: [],
  },
  {
    name: 'Capital One SavorOne',
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
  },
  {
    name: 'Citi Strata Elite',
    issuer: 'Citi',
    network: 'Mastercard',
    annualFee: 595,
    category: 'travel',
    benefits: [
      { name: 'Hotel Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 300, notes: '$300 off a hotel stay of 2+ nights booked through Citi Travel per calendar year.' },
      { name: 'Splurge Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 200, notes: '$200 annual credit at 1stDibs, American Airlines, Best Buy, Future, Live Nation.' },
      { name: 'Blacklane Credit (H1)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jan–Jun Blacklane chauffeur service credit.' },
      { name: 'Blacklane Credit (H2)', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 100, notes: '$100 Jul–Dec Blacklane chauffeur service credit.' },
      { name: 'Admirals Club Passes', creditType: 'annual', valueType: 'certificate', totalAmount: 4, notes: '4 Admirals Club 24-hour passes per calendar year.' },
    ],
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
    issuer: 'Bilt (Column N.A.)',
    network: 'Mastercard',
    annualFee: 0,
    category: 'other',
    benefits: [],
  },
  {
    name: 'Bilt Obsidian',
    issuer: 'Bilt (Column N.A.)',
    network: 'Mastercard',
    annualFee: 95,
    category: 'other',
    benefits: [
      { name: 'Hotel Credit', creditType: 'semi-annual', valueType: 'dollar', totalAmount: 50, notes: '$50 semi-annual Bilt Travel portal hotel credit ($100/yr).' },
    ],
  },
  {
    name: 'Bilt Palladium',
    issuer: 'Bilt (Column N.A.)',
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
    name: 'U.S. Bank Altitude Reserve',
    issuer: 'U.S. Bank',
    network: 'Visa',
    annualFee: 400,
    category: 'travel',
    benefits: [
      { name: 'Travel Center Credit', creditType: 'annual', valueType: 'dollar', totalAmount: 325, notes: '$325 annual credit for purchases through U.S. Bank Travel Center.' },
      { name: 'Global Entry / TSA PreCheck Credit', creditType: 'one-time', valueType: 'dollar', totalAmount: 100, notes: 'Every 4 years.' },
    ],
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
];

export function findKnownCard(name: string): KnownCardInfo | undefined {
  const lower = name.toLowerCase();
  return knownCards.find(c => c.name.toLowerCase() === lower);
}
