import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

export function CheckoutHeader() {
  return (
    <div className={'flex gap-4 items-center'}>
      <Link href={'/'}>
        <Button variant={'secondary'} className={'h-[32px] bg-[#182222] border-border w-[32px] p-0 rounded-[4px]'}>
          <ChevronLeft />
        </Button>
      </Link>
      <Logo size="md" />
    </div>
  );
}
