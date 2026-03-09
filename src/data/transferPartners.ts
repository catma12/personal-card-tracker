export type PartnerType = 'airline' | 'hotel';

export interface TransferPartner {
  name: string;
  type: PartnerType;
  ratio: string; // e.g. "1:1", "1:1.5"
  bonus?: string; // e.g. "30% bonus through 3/31"
}

export interface IssuerPartners {
  issuer: string;
  program: string;
  partners: TransferPartner[];
}

export const transferPartnersData: IssuerPartners[] = [
  {
    issuer: 'Chase',
    program: 'Ultimate Rewards',
    partners: [
      { name: 'United Airlines', type: 'airline', ratio: '1:1' },
      { name: 'Southwest Airlines', type: 'airline', ratio: '1:1' },
      { name: 'British Airways', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM (Flying Blue)', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines (KrisFlyer)', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Iberia Plus', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic', type: 'airline', ratio: '1:1' },
      { name: 'Aer Lingus', type: 'airline', ratio: '1:1' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '1:1' },
      { name: 'IHG One Rewards', type: 'hotel', ratio: '1:1' },
      { name: 'World of Hyatt', type: 'hotel', ratio: '1:1' },
      { name: 'Marriott Bonvoy', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Amex',
    program: 'Membership Rewards',
    partners: [
      { name: 'Delta SkyMiles', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM (Flying Blue)', type: 'airline', ratio: '1:1' },
      { name: 'British Airways', type: 'airline', ratio: '1:1' },
      { name: 'ANA Mileage Club', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines (KrisFlyer)', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific (Asia Miles)', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'Hawaiian Airlines', type: 'airline', ratio: '1:1' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '1:0.8' },
      { name: 'Qantas Frequent Flyer', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic', type: 'airline', ratio: '1:1' },
      { name: 'Aeroplan (Air Canada)', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'Iberia Plus', type: 'airline', ratio: '1:1' },
      { name: 'Hilton Honors', type: 'hotel', ratio: '1:2' },
      { name: 'Marriott Bonvoy', type: 'hotel', ratio: '1:1' },
      { name: 'Choice Privileges', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Citi',
    program: 'ThankYou Points',
    partners: [
      { name: 'Turkish Airlines (Miles&Smiles)', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines (KrisFlyer)', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM (Flying Blue)', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific (Asia Miles)', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'EVA Air (Infinity MileageLands)', type: 'airline', ratio: '1:1' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '1:1' },
      { name: 'Qantas Frequent Flyer', type: 'airline', ratio: '1:1' },
      { name: 'Qatar Airways (Privilege Club)', type: 'airline', ratio: '1:1' },
      { name: 'Thai Airways (Royal Orchid Plus)', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'Accor Live Limitless', type: 'hotel', ratio: '1:2' },
      { name: 'Choice Privileges', type: 'hotel', ratio: '1:1' },
      { name: 'Wyndham Rewards', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Capital One',
    program: 'Capital One Miles',
    partners: [
      { name: 'Turkish Airlines (Miles&Smiles)', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM (Flying Blue)', type: 'airline', ratio: '1:1' },
      { name: 'British Airways', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines (KrisFlyer)', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific (Asia Miles)', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'Qantas Frequent Flyer', type: 'airline', ratio: '1:1' },
      { name: 'TAP Air Portugal', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'Finnair Plus', type: 'airline', ratio: '1:1' },
      { name: 'Aeromexico (Club Premier)', type: 'airline', ratio: '1:1' },
      { name: 'Accor Live Limitless', type: 'hotel', ratio: '1:2' },
      { name: 'Wyndham Rewards', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Bilt',
    program: 'Bilt Rewards',
    partners: [
      { name: 'American Airlines (AAdvantage)', type: 'airline', ratio: '1:1' },
      { name: 'United Airlines', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM (Flying Blue)', type: 'airline', ratio: '1:1' },
      { name: 'Turkish Airlines (Miles&Smiles)', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific (Asia Miles)', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic', type: 'airline', ratio: '1:1' },
      { name: 'Alaska Airlines (Mileage Plan)', type: 'airline', ratio: '1:1' },
      { name: 'Aeroplan (Air Canada)', type: 'airline', ratio: '1:1' },
      { name: 'Ethiopian Airlines (ShebaMiles)', type: 'airline', ratio: '1:1' },
      { name: 'World of Hyatt', type: 'hotel', ratio: '1:1' },
      { name: 'IHG One Rewards', type: 'hotel', ratio: '1:1' },
      { name: 'Marriott Bonvoy', type: 'hotel', ratio: '1:1' },
    ],
  },
];
