export type PartnerType = 'airline' | 'hotel';

export interface TransferPartner {
  name: string;
  type: PartnerType;
  ratio: string;
}

export interface IssuerPartners {
  issuer: string;
  program: string;
  partners: TransferPartner[];
}

export const transferPartnersData: IssuerPartners[] = [];
