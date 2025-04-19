import { Tier } from '@/constants/pricing-tier';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  loading: boolean;
  tier: Tier;
  priceMap: Record<string, string>;
  value: string;
  priceSuffix: string;
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
  const isMonthly = value === 'month';
  
  // Calculate yearly price per photo
  const yearlyPricePerPhoto = (parseFloat(tier.yearlyPrice.replace('$', '')) / tier.photosPerMonth).toFixed(2);

  return (
    <div className="mt-6 flex flex-col px-8 gap-2">
      {loading ? (
        <Skeleton className="h-[200px] w-full bg-border" />
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            <div className={cn('text-6xl leading-[72px] tracking-[-1.2px] font-medium')}>
              {tier.photosPerMonth}
            </div>
            <div className={cn('text-base leading-[24px] text-secondary')}>photos per month</div>
          </div>
          
          <div className="flex flex-col items-center text-center mt-4">
            <div className={cn('text-4xl leading-[48px] tracking-[-0.8px] font-medium')}>
              {isMonthly ? priceMap[tier.priceId[value]].replace(/\.00$/, '') : tier.yearlyPrice}
            </div>
            <div className={cn('text-base leading-[24px] text-secondary')}>{priceSuffix}</div>
          </div>

          <div className="flex flex-col items-center text-center mt-2">
            <div className={cn('text-xl leading-[30px] font-medium text-secondary')}>
              ${isMonthly ? tier.pricePerPhoto.replace('$', '') : yearlyPricePerPhoto} / photo
            </div>
          </div>
        </>
      )}
    </div>
  );
}
