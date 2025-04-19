import { PricingTier } from '@/constants/pricing-tier';
import { IBillingFrequency } from '@/constants/billing-frequency';
import { FeaturesList } from '@/components/home/pricing/features-list';
import { PriceAmount } from '@/components/home/pricing/price-amount';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PriceTitle } from '@/components/home/pricing/price-title';
import { Separator } from '@/components/ui/separator';
import { FeaturedCardGradient } from '@/components/gradients/featured-card-gradient';
import Link from 'next/link';

interface Props {
  loading: boolean;
  frequency: IBillingFrequency;
  priceMap: Record<string, string>;
}

export function PriceCards({ loading, frequency, priceMap }: Props) {
  const isMonthly = frequency.value === 'month';

  return (
    <div className="mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {PricingTier.map((tier) => (
        <div 
          key={tier.id} 
          className={cn(
            'rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden border border-white/10 relative',
            {
              'lg:-mt-4 lg:mb-4': tier.featured // Makes premium card taller by adding negative margin top and positive margin bottom
            }
          )}
        >
          <div className={cn('flex gap-5 flex-col rounded-lg rounded-b-none')}>
            {tier.featured && <FeaturedCardGradient />}
            <PriceTitle tier={tier} />
            <PriceAmount
              loading={loading}
              tier={tier}
              priceMap={priceMap}
              value={frequency.value}
              priceSuffix={frequency.priceSuffix}
            />
            <div className={'px-8'}>
              <Separator className={'bg-border'} />
            </div>
            <div className={'px-8 text-[16px] leading-[24px] text-secondary flex flex-col items-center'}>
              {isMonthly ? (
                <>
                  <span>Just {tier.yearlyPrice}/mo</span>
                  <span>with yearly billing</span>
                </>
              ) : (
                <span>Billed as {priceMap[tier.priceId[frequency.value]].replace(/\.00$/, '')}</span>
              )}
            </div>
          </div>
          <div className={'px-8 mt-8'}>
            <Button className={'w-full'} variant={'secondary'} asChild={true}>
              <Link href={`/checkout/${tier.priceId[frequency.value]}`}>Get started</Link>
            </Button>
          </div>
          <FeaturesList tier={tier} />
        </div>
      ))}
    </div>
  );
}
