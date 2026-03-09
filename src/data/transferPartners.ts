export type PartnerType = 'airline' | 'hotel';

export interface TransferPartner {
  name: string;
  type: PartnerType;
  ratio: string; // e.g. "1:1", "1,000:800"
}

export interface IssuerPartners {
  issuer: string;
  program: string;
  partners: TransferPartner[];
}

export const transferPartnersData: IssuerPartners[] = [
  {
    issuer: 'Amex',
    program: 'Membership Rewards',
    partners: [
      // Airlines (alphabetical)
      { name: 'Aer Lingus Avios', type: 'airline', ratio: '1:1' },
      { name: 'Aeromexico Club Premier', type: 'airline', ratio: '1:1.6' },
      { name: 'Air Canada Aeroplan', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM Flying Blue', type: 'airline', ratio: '1:1' },
      { name: 'ANA Mileage Club', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'British Airways Avios', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific Asia Miles', type: 'airline', ratio: '1,000:800' },
      { name: 'Delta SkyMiles', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1,000:800' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'Finnair Plus (via BA)', type: 'airline', ratio: '1:1' },
      { name: 'Hawaiian Airlines', type: 'airline', ratio: '1:1' },
      { name: 'Iberia Avios', type: 'airline', ratio: '1:1' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '250:200' },
      { name: 'Qantas Frequent Flyer', type: 'airline', ratio: '1:1' },
      { name: 'Qatar Privilege Club Avios', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines KrisFlyer', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic Flying Club', type: 'airline', ratio: '1:1' },
      // Hotels (alphabetical)
      { name: 'Choice Privileges', type: 'hotel', ratio: '1:1' },
      { name: 'Hilton Honors', type: 'hotel', ratio: '1:2' },
      { name: 'Marriott Bonvoy', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Bilt',
    program: 'Bilt Rewards',
    partners: [
      // Airlines (alphabetical)
      { name: 'Aer Lingus Avios', type: 'airline', ratio: '1:1' },
      { name: 'Air Canada Aeroplan', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM Flying Blue', type: 'airline', ratio: '1:1' },
      { name: 'Alaska Atmos Rewards', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'British Airways Avios', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific Asia Miles', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'Finnair Plus (via BA)', type: 'airline', ratio: '1:1' },
      { name: 'Iberia Avios', type: 'airline', ratio: '1:1' },
      { name: 'JAL Mileage Bank', type: 'airline', ratio: '1:1' },
      { name: 'Qatar Privilege Club Avios', type: 'airline', ratio: '1:1' },
      { name: 'Southwest Rapid Rewards', type: 'airline', ratio: '1:1' },
      { name: 'Spirit Free Spirit', type: 'airline', ratio: '1:1' },
      { name: 'TAP Air Portugal Miles&Go', type: 'airline', ratio: '1:1' },
      { name: 'Turkish Airlines Miles&Smiles', type: 'airline', ratio: '1:1' },
      { name: 'United MileagePlus', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic Flying Club', type: 'airline', ratio: '1:1' },
      // Hotels (alphabetical)
      { name: 'Accor Live Limitless (ALL)', type: 'hotel', ratio: '3:2' },
      { name: 'Hilton Honors', type: 'hotel', ratio: '1:1' },
      { name: 'IHG One Rewards', type: 'hotel', ratio: '1:1' },
      { name: 'Marriott Bonvoy', type: 'hotel', ratio: '20K:25K' },
      { name: 'World of Hyatt', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Capital One',
    program: 'Capital One Miles',
    partners: [
      // Airlines (alphabetical)
      { name: 'Aeromexico Rewards', type: 'airline', ratio: '1:1' },
      { name: 'Air Canada Aeroplan', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM Flying Blue', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'British Airways Avios', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific Asia Miles', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '4:3' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'EVA Infinity MileageLands', type: 'airline', ratio: '2:1.5' },
      { name: 'Finnair Plus', type: 'airline', ratio: '1:1' },
      { name: 'JAL Mileage Bank', type: 'airline', ratio: '2:1.5' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '5:3' },
      { name: 'Qantas Frequent Flyer', type: 'airline', ratio: '1:1' },
      { name: 'Qatar Privilege Club Avios', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines KrisFlyer', type: 'airline', ratio: '1:1' },
      { name: 'TAP Air Portugal Miles&Go', type: 'airline', ratio: '1:1' },
      { name: 'Turkish Airlines Miles&Smiles', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Red', type: 'airline', ratio: '1:1' },
      // Hotels (alphabetical)
      { name: 'Accor Live Limitless (ALL)', type: 'hotel', ratio: '2:1' },
      { name: 'Choice Privileges', type: 'hotel', ratio: '1:1' },
      { name: 'Preferred Hotels I Prefer', type: 'hotel', ratio: '1:2' },
      { name: 'Wyndham Rewards', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Chase',
    program: 'Ultimate Rewards',
    partners: [
      // Airlines (alphabetical)
      { name: 'Aer Lingus Avios', type: 'airline', ratio: '1:1' },
      { name: 'Air Canada Aeroplan', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM Flying Blue', type: 'airline', ratio: '1:1' },
      { name: 'British Airways Avios', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1:1' },
      { name: 'Finnair Plus', type: 'airline', ratio: '1:1' },
      { name: 'Iberia Avios', type: 'airline', ratio: '1:1' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '1:1' },
      { name: 'Qatar Privilege Club Avios', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines KrisFlyer', type: 'airline', ratio: '1:1' },
      { name: 'Southwest Rapid Rewards', type: 'airline', ratio: '1:1' },
      { name: 'United MileagePlus', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic Flying Club', type: 'airline', ratio: '1:1' },
      // Hotels (alphabetical)
      { name: 'IHG One Rewards', type: 'hotel', ratio: '1:1' },
      { name: 'Marriott Bonvoy', type: 'hotel', ratio: '1:1' },
      { name: 'World of Hyatt', type: 'hotel', ratio: '1:1' },
      { name: 'Wyndham Rewards', type: 'hotel', ratio: '1:1' },
    ],
  },
  {
    issuer: 'Citi',
    program: 'ThankYou Points',
    partners: [
      // Airlines (alphabetical)
      { name: 'Aer Lingus Avios (via Qatar)', type: 'airline', ratio: '1:1' },
      { name: 'Air France/KLM Flying Blue', type: 'airline', ratio: '1:1' },
      { name: 'American AAdvantage', type: 'airline', ratio: '1:1' },
      { name: 'Avianca LifeMiles', type: 'airline', ratio: '1:1' },
      { name: 'British Airways Avios (via Qatar)', type: 'airline', ratio: '1:1' },
      { name: 'Cathay Pacific Asia Miles', type: 'airline', ratio: '1:1' },
      { name: 'Emirates Skywards', type: 'airline', ratio: '1,000:800' },
      { name: 'Etihad Guest', type: 'airline', ratio: '1:1' },
      { name: 'EVA Air Infinity MileageLands', type: 'airline', ratio: '1:1' },
      { name: 'Finnair Plus (via Qatar)', type: 'airline', ratio: '1:1' },
      { name: 'Iberia Avios (via Qatar)', type: 'airline', ratio: '1:1' },
      { name: 'InterMiles (Jet Airways)', type: 'airline', ratio: '1:1' },
      { name: 'JetBlue TrueBlue', type: 'airline', ratio: '1:1' },
      { name: 'Malaysia Enrich', type: 'airline', ratio: '1:1' },
      { name: 'Qantas Frequent Flyer', type: 'airline', ratio: '1:1' },
      { name: 'Qatar Privilege Club Avios', type: 'airline', ratio: '1:1' },
      { name: 'Singapore Airlines KrisFlyer', type: 'airline', ratio: '1:1' },
      { name: 'Thai Airways Royal Orchid Plus', type: 'airline', ratio: '1:1' },
      { name: 'Turkish Airlines Miles&Smiles', type: 'airline', ratio: '1:1' },
      { name: 'Virgin Atlantic Flying Club', type: 'airline', ratio: '1:1' },
      // Hotels (alphabetical)
      { name: 'Choice Privileges', type: 'hotel', ratio: '1:2' },
      { name: 'Preferred Hotels I Prefer', type: 'hotel', ratio: '1:4' },
      { name: 'Wyndham Rewards', type: 'hotel', ratio: '1:1' },
    ],
  },
];
