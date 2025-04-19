export interface Tier {
  name: string;
  id: 'standard' | 'premium' | 'professional';
  icon: string;
  description: string;
  photosPerMonth: number;
  pricePerPhoto: string;
  yearlyPrice: string;
  yearlyTotal: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}

export const PricingTier: Tier[] = [
  {
    name: 'Standard',
    id: 'standard',
    icon: '/assets/icons/price-tiers/free-icon.svg',
    description: '$348/year',
    photosPerMonth: 15,
    pricePerPhoto: '$2.33',
    yearlyPrice: '$29',
    yearlyTotal: '$348',
    features: [
      'Unlimited renders and downloads',
      'All room types and styles',
      'Furniture removal included',
      'No watermark'
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_STANDARD_MONTHLY_PRODUCT_ID!,
      year: process.env.NEXT_PUBLIC_PADDLE_STANDARD_YEARLY_PRODUCT_ID!
    },
  },
  {
    name: 'Premium',
    id: 'premium',
    icon: '/assets/icons/price-tiers/basic-icon.svg',
    description: '$600/year',
    photosPerMonth: 40,
    pricePerPhoto: '$1.50',
    yearlyPrice: '$50',
    yearlyTotal: '$600',
    features: [
      'Unlimited renders and downloads',
      'All room types and styles',
      'Furniture removal included',
      'No watermark'
    ],
    featured: true,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_PREMIUM_MONTHLY_PRODUCT_ID!,
      year: process.env.NEXT_PUBLIC_PADDLE_PREMIUM_YEARLY_PRODUCT_ID!
    },
  },
  {
    name: 'Professional',
    id: 'professional',
    icon: '/assets/icons/price-tiers/pro-icon.svg',
    description: '$1,380/year',
    photosPerMonth: 100,
    pricePerPhoto: '$1.35',
    yearlyPrice: '$115',
    yearlyTotal: '$1,380',
    features: [
      'Unlimited renders and downloads',
      'All room types and styles',
      'Furniture removal included',
      'No watermark'
    ],
    featured: false,
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_PROFESSIONAL_MONTHLY_PRODUCT_ID!,
      year: process.env.NEXT_PUBLIC_PADDLE_PROFESSIONAL_YEARLY_PRODUCT_ID!
    },
  },
];
